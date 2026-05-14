import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import {
  validateCartAgainstInventory,
  decrementInventoryForCart,
  orderProductIdsFromCart,
  computeCartTotal,
} from "../utils/cartStock.js";
import { restoreInventoryFromProductIds } from "../utils/orderInventory.js";
import { sendOrderEmail, notifySmsWhatsapp } from "../helpers/orderNotifications.js";
import { emitNewOrderCreated } from "../utils/adminOrderSocket.js";
import { isValidUpiPaymentApp } from "../constants/upiPaymentApps.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, "..", "uploads", "payment-proofs");

function ensureUploadDir() {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

function pushHistory(order, { actorId, actorName, action, note }) {
  const entry = {
    actor: actorId || undefined,
    actorName: actorName || "System",
    action,
    note: note || "",
    at: new Date(),
  };
  if (!Array.isArray(order.verificationHistory)) order.verificationHistory = [];
  order.verificationHistory.push(entry);
}

async function isAdminUser(userId) {
  const u = await userModel.findById(userId).select("role");
  return u && u.role === 1;
}

function syncUpiProofFields(order, utrDigits, app, relativeUrl) {
  order.transactionId = utrDigits;
  order.upiTransactionId = utrDigits;
  order.paymentAppName = app;
  order.paymentScreenshotURL = relativeUrl;
  order.paymentScreenshotUrl = relativeUrl;
}

function parseCartAndAddress(req) {
  const hasMultipartProof =
    !!(req.files?.screenshot || req.files?.paymentScreenshot) ||
    !!(req.fields?.cart && (req.fields?.upiTransactionId || req.fields?.transactionId));

  if (Array.isArray(req.body?.cart) && !hasMultipartProof) {
    return {
      cart: req.body.cart,
      shippingAddress: req.body.shippingAddress,
      proofMode: "legacy_json",
    };
  }

  let cart;
  let shippingAddress;
  try {
    const cartRaw = req.fields?.cart;
    const addrRaw = req.fields?.shippingAddress;
    cart = typeof cartRaw === "string" ? JSON.parse(cartRaw) : cartRaw;
    shippingAddress =
      typeof addrRaw === "string" ? JSON.parse(addrRaw) : addrRaw;
  } catch (e) {
    return { error: "Invalid cart or address payload" };
  }
  if (!Array.isArray(cart) || cart.length === 0) {
    return { error: "Invalid cart" };
  }
  return { cart, shippingAddress, proofMode: "multipart", fields: req.fields, files: req.files };
}

async function attachPaymentProofFromUpload(order, req) {
  const rawUtr =
    req.fields?.upiTransactionId ??
    req.fields?.transactionId ??
    "";
  const utr = String(rawUtr).replace(/\D/g, "");
  if (utr.length !== 12) {
    return { error: "Enter a valid 12-digit UPI / UTR number" };
  }
  const app = (req.fields?.paymentAppName || "").toString();
  if (!isValidUpiPaymentApp(app)) {
    return { error: "Invalid payment app" };
  }
  const file = req.files?.screenshot || req.files?.paymentScreenshot;
  if (!file) {
    return { error: "Payment screenshot is required" };
  }

  ensureUploadDir();
  const ext = path.extname(file.name || "") || ".jpg";
  const safeName = `${order._id}${ext}`;
  const dest = path.join(UPLOAD_DIR, safeName);
  fs.writeFileSync(dest, fs.readFileSync(file.path));
  try {
    fs.unlinkSync(file.path);
  } catch (_) {}

  const relativeUrl = `/api/v1/product/payment-proof/${order._id}`;
  order.paymentScreenshotFilename = safeName;
  syncUpiProofFields(order, utr, app, relativeUrl);
  order.paymentProofSubmittedAt = new Date();
  return { ok: true };
}

/** POST — create QR order, reserve stock */
export const qrOrderInitController = async (req, res) => {
  try {
    const u = await userModel.findById(req.user._id);
    const parsed = parseCartAndAddress(req);
    if (parsed.error) {
      return res.status(400).send({ success: false, message: parsed.error });
    }
    const { cart, shippingAddress, proofMode } = parsed;

    const stockCheck = await validateCartAgainstInventory(cart);
    if (!stockCheck.ok) {
      return res.status(400).send({
        success: false,
        message: "Insufficient stock",
        errors: stockCheck.errors,
      });
    }

    const orderSubtotal = computeCartTotal(cart);
    const deliveryCharge = 0;
    const discountAmount = 0;
    const totalAmount = orderSubtotal + deliveryCharge - discountAmount;

    let order;
    try {
      order = await new orderModel({
        products: orderProductIdsFromCart(cart),
        payment: { paymentMethod: "QR" },
        paymentMode: "QR",
        paymentStatus: "Pending",
        paymentVerificationStatus: "Pending",
        adminSeen: false,
        orderSubtotal,
        deliveryCharge,
        discountAmount,
        totalAmount,
        buyer: req.user._id,
        shippingAddress: shippingAddress || u.address,
        status: "Order Placed",
      }).save();
      await decrementInventoryForCart(cart);
    } catch (err) {
      console.log(err);
      if (order?._id) await orderModel.findByIdAndDelete(order._id);
      return res.status(500).send({
        success: false,
        message: err?.message || "Could not create QR order",
      });
    }

    let proofErr;
    if (proofMode === "multipart") {
      proofErr = await attachPaymentProofFromUpload(order, req);
      if (proofErr?.error) {
        await restoreInventoryFromProductIds(order.products);
        await orderModel.findByIdAndDelete(order._id);
        return res.status(400).send({ success: false, message: proofErr.error });
      }
    }

    pushHistory(order, {
      actorId: req.user._id,
      actorName: u.name,
      action: "order_created",
      note:
        proofMode === "multipart"
          ? "QR order placed with UPI proof"
          : "QR order placed — pending payment proof",
    });

    if (proofMode === "multipart") {
      const submitter = await userModel.findById(req.user._id).select("name");
      pushHistory(order, {
        actorId: req.user._id,
        actorName: submitter?.name,
        action: "proof_submitted",
        note: `UTR ${order.upiTransactionId} via ${order.paymentAppName} (with order)`,
      });
    }
    await order.save();

    emitNewOrderCreated({ orderId: String(order._id) });

    try {
      if (proofMode === "multipart") {
        await sendOrderEmail(
          u.email,
          "Medicure — Order placed (payment proof received)",
          `Hi ${u.name},\n\nYour order ${order._id} has been placed and we received your UPI payment details. Our team will verify shortly.\n\nAmount: ₹${totalAmount}\n\nTeam Medicure`
        );
        await notifySmsWhatsapp(
          u,
          "whatsapp",
          `Order ${String(order._id).slice(-8)} placed with UPI proof. Awaiting verification.`
        );
      } else {
        await sendOrderEmail(
          u.email,
          "Medicure — Order placed (UPI/QR pending verification)",
          `Hi ${u.name},\n\nYour order ${order._id} has been placed. Please complete UPI payment and submit your transaction ID and screenshot from the checkout page.\n\nAmount payable: ₹${totalAmount}\n\nTeam Medicure`
        );
        await notifySmsWhatsapp(
          u,
          "whatsapp",
          `Order ${String(order._id).slice(-8)} placed. Submit UPI proof in the app when ready.`
        );
      }
    } catch (e) {
      console.error(e);
    }

    return res.status(201).json({
      success: true,
      orderId: order._id,
      order,
      proofSubmitted: proofMode === "multipart",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "QR order init failed" });
  }
};

/** GET — buyer (or admin) single order */
export const getQrOrderByIdController = async (req, res) => {
  try {
    const order = await orderModel
      .findById(req.params.orderId)
      .populate("products", "-photo")
      .populate("buyer", "name email phone");
    if (!order) return res.status(404).send({ success: false, message: "Order not found" });
    const admin = await isAdminUser(req.user._id);
    const buyerId = order.buyer?._id?.toString() || order.buyer?.toString();
    if (!admin && buyerId !== req.user._id.toString()) {
      return res.status(403).send({ success: false, message: "Forbidden" });
    }
    return res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Error fetching order" });
  }
};

/** PATCH — buyer submits UTR + app + screenshot */
export const qrOrderSubmitProofController = async (req, res) => {
  try {
    ensureUploadDir();
    const order = await orderModel.findById(req.params.orderId);
    if (!order) return res.status(404).send({ success: false, message: "Order not found" });
    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).send({ success: false, message: "Forbidden" });
    }
    if (order.paymentMode !== "QR" && order.paymentMode !== "qrcode") {
      return res.status(400).send({ success: false, message: "Not a QR order" });
    }

    if (order.paymentVerificationStatus === "Timed_Out") {
      return res.status(400).send({ success: false, message: "This order is no longer accepting payment proof" });
    }
    if (order.paymentVerificationStatus !== "Pending") {
      return res.status(400).send({ success: false, message: "Order is not awaiting proof" });
    }

    const { transactionId, paymentAppName, upiTransactionId } = req.fields || {};
    const rawUtr = upiTransactionId ?? transactionId ?? "";
    const utr = String(rawUtr).replace(/\D/g, "");
    if (utr.length !== 12) {
      return res.status(400).send({ success: false, message: "Enter a valid 12-digit UPI / UTR number" });
    }
    const app = (paymentAppName || "").toString();
    if (!isValidUpiPaymentApp(app)) {
      return res.status(400).send({ success: false, message: "Invalid payment app" });
    }

    const file = req.files?.screenshot || req.files?.paymentScreenshot;
    if (!file) {
      return res.status(400).send({ success: false, message: "Payment screenshot is required" });
    }

    const ext = path.extname(file.name || "") || ".jpg";
    const safeName = `${order._id}${ext}`;
    const dest = path.join(UPLOAD_DIR, safeName);
    fs.writeFileSync(dest, fs.readFileSync(file.path));
    try {
      fs.unlinkSync(file.path);
    } catch (_) {}

    const relativeUrl = `/api/v1/product/payment-proof/${order._id}`;
    order.paymentScreenshotFilename = safeName;
    syncUpiProofFields(order, utr, app, relativeUrl);
    order.paymentProofSubmittedAt = new Date();
    const submitter = await userModel.findById(req.user._id).select("name");
    pushHistory(order, {
      actorId: req.user._id,
      actorName: submitter?.name,
      action: "proof_submitted",
      note: `UTR ${utr} via ${app}`,
    });
    await order.save();

    const buyer = await userModel.findById(order.buyer).select("name email phone");
    try {
      await sendOrderEmail(
        buyer.email,
        "Medicure — Payment proof received",
        `Hi ${buyer.name},\n\nWe received your payment details for order ${order._id}. Our team will verify shortly.\n\nTeam Medicure`
      );
      await notifySmsWhatsapp(buyer, "sms", `Payment proof received for order ${String(order._id).slice(-8)}.`);
    } catch (e) {
      console.error(e);
    }

    return res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Could not save payment proof" });
  }
};

/** GET — stream screenshot (buyer or admin) */
export const getPaymentProofController = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.orderId).select("buyer paymentScreenshotFilename paymentMode");
    if (!order || !order.paymentScreenshotFilename) {
      return res.status(404).send("Not found");
    }
    const admin = await isAdminUser(req.user._id);
    if (!admin && order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).send("Forbidden");
    }
    const filePath = path.join(UPLOAD_DIR, order.paymentScreenshotFilename);
    if (!fs.existsSync(filePath)) return res.status(404).send("File missing");
    return res.sendFile(path.resolve(filePath));
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error");
  }
};

/** GET — admin list QR / UPI orders pending verification */
export const listQrPendingVerificationController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({
        paymentMode: { $in: ["QR", "qrcode"] },
        paymentVerificationStatus: "Pending",
        status: { $ne: "Cancelled" },
      })
      .populate("buyer", "name email phone")
      .populate("products", "-photo")
      .sort({ createdAt: -1 });
    return res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Failed to list orders" });
  }
};

/** PUT — admin approve / reject */
export const verifyQrPaymentAdminController = async (req, res) => {
  try {
    const { action, adminRemarks } = req.body;
    if (!["approve", "reject"].includes(action)) {
      return res.status(400).send({ success: false, message: "Invalid action" });
    }
    let order = await orderModel.findById(req.params.orderId);
    if (!order) return res.status(404).send({ success: false, message: "Order not found" });
    if (order.paymentVerificationStatus !== "Pending") {
      return res.status(400).send({ success: false, message: "Order is not pending verification" });
    }

    const adminUser = await userModel.findById(req.user._id).select("name");

    if (action === "approve") {
      if (!(order.transactionId || order.upiTransactionId) || !order.paymentScreenshotFilename) {
        return res.status(400).send({ success: false, message: "Payment proof is incomplete" });
      }
      order.paymentVerificationStatus = "Verified";
      order.paymentStatus = "Paid";
      order.status = "Processing";
      order.adminRemarks = (adminRemarks || "").toString();
      pushHistory(order, {
        actorId: req.user._id,
        actorName: adminUser?.name || "Admin",
        action: "approved",
        note: order.adminRemarks,
      });
    } else {
      order.paymentVerificationStatus = "Rejected";
      order.paymentStatus = "Failed";
      order.status = "Cancelled";
      order.adminRemarks = (adminRemarks || "").toString();
      await restoreInventoryFromProductIds(order.products);
      pushHistory(order, {
        actorId: req.user._id,
        actorName: adminUser?.name || "Admin",
        action: "rejected",
        note: order.adminRemarks,
      });
    }
    await order.save();

    const buyer = await userModel.findById(order.buyer).select("name email phone");
    if (buyer?.email) {
      try {
        if (action === "approve") {
          await sendOrderEmail(
            buyer.email,
            "Medicure — Payment verified",
            `Hi ${buyer.name},\n\nYour payment for order ${order._id} has been verified. Your order is now being processed.\n\nTeam Medicure`
          );
          await notifySmsWhatsapp(buyer, "sms", `Payment verified for order ${String(order._id).slice(-8)}.`);
        } else {
          await sendOrderEmail(
            buyer.email,
            "Medicure — Payment rejected",
            `Hi ${buyer.name},\n\nWe could not verify your payment for order ${order._id}. Reason: ${order.adminRemarks || "Not specified"}.\n\nTeam Medicure`
          );
          await notifySmsWhatsapp(buyer, "sms", `Payment rejected for order ${String(order._id).slice(-8)}.`);
        }
      } catch (e) {
        console.error(e);
      }
    }

    return res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Verification failed" });
  }
};
