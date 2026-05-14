import mongoose from "mongoose";
import { PAYMENT_MODES } from "../constants/paymentModes.js";

const verificationHistorySchema = new mongoose.Schema(
  {
    actor: { type: mongoose.ObjectId, ref: "users" },
    actorName: { type: String, default: "" },
    action: { type: String, required: true },
    note: { type: String, default: "" },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "Products",
      },
    ],
    payment: {},

    paymentMode: {
      type: String,
      enum: PAYMENT_MODES,
      default: "Online",
    },

    paymentStatus: {
      type: String,
      enum: ["Success", "Pending", "Failed", "Paid"],
      default: "Pending",
    },

    /** UPI / QR manual verification lifecycle */
    paymentVerificationStatus: {
      type: String,
      enum: ["NA", "Pending", "Verified", "Rejected", "Timed_Out"],
      default: "NA",
    },

    paymentScreenshotURL: { type: String, default: "" },
    /** Stored filename under uploads/payment-proofs (server-only basename) */
    paymentScreenshotFilename: { type: String, default: "" },
    transactionId: { type: String, default: "" },
    paymentAppName: {
      type: String,
      enum: ["", "PhonePe", "Google Pay", "Paytm", "Other"],
      default: "",
    },
    adminRemarks: { type: String, default: "" },
    paymentTimerExpiry: { type: Date },
    paymentProofSubmittedAt: { type: Date },

    orderSubtotal: { type: Number },
    deliveryCharge: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },

    verificationHistory: {
      type: [verificationHistorySchema],
      default: [],
    },

    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },

    shippingAddress: {
      type: Object,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      default: "Not Processed",
      enum: [
        "Not Processed",
        "Order Placed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Returned",
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
