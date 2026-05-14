import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import { FiUpload, FiArrowLeft } from "react-icons/fi";

const PAYMENT_APPS = ["PhonePe", "Google Pay", "Paytm", "Other"];

const QrCheckoutPage = () => {
  const { orderId } = useParams();
  const [auth] = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [utr, setUtr] = useState("");
  const [paymentApp, setPaymentApp] = useState("PhonePe");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const authHeader = { Authorization: `Bearer ${auth?.token}` };

  const loadOrder = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/product/qr-order/${orderId}`,
        { headers: authHeader }
      );
      if (data.success) setOrder(data.order);
    } catch (e) {
      console.log(e);
      toast.error("Could not load order");
      navigate("/dashboard/user/orders");
    } finally {
      setLoading(false);
    }
  }, [orderId, auth?.token, navigate]);

  useEffect(() => {
    if (auth?.token) loadOrder();
  }, [auth?.token, loadOrder]);

  useEffect(() => {
    if (order?.paymentProofSubmittedAt) {
      navigate(`/dashboard/user/order-confirmation/${orderId}`, { replace: true });
    }
  }, [order, orderId, navigate]);

  const subtotal = Number(order?.orderSubtotal ?? order?.totalAmount ?? 0);
  const delivery = Number(order?.deliveryCharge ?? 0);
  const discount = Number(order?.discountAmount ?? 0);
  const payable = Number(order?.totalAmount ?? subtotal + delivery - discount);

  const qrUrl =
    order && payable > 0
      ? `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
          `upi://pay?pa=8768006557@ptyes&pn=Medicure&am=${payable}&cu=INR`
        )}`
      : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const digits = utr.replace(/\D/g, "");
    if (digits.length !== 12) {
      toast.error("Enter the 12-digit UPI reference / UTR");
      return;
    }
    if (!file) {
      toast.error("Please attach a payment screenshot");
      return;
    }
    try {
      setSubmitting(true);
      const fd = new FormData();
      fd.append("transactionId", digits);
      fd.append("paymentAppName", paymentApp);
      fd.append("screenshot", file);
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/product/qr-order/${orderId}/submit-proof`,
        fd,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      toast.success("Payment details submitted");
      navigate(`/dashboard/user/order-confirmation/${orderId}`);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout title="UPI payment">
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
        </div>
      </Layout>
    );
  }

  if (!order) return null;

  const blocked =
    order.paymentVerificationStatus === "Timed_Out" || order.status === "Cancelled";

  return (
    <Layout title="Complete UPI payment">
      <div className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="hidden md:block col-span-1">
            <UserMenu />
          </div>
          <div className="col-span-1 md:col-span-3 space-y-6">
            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600"
            >
              <FiArrowLeft /> Back to cart
            </button>

            <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">UPI / QR payment</h1>
                  <p className="text-sm text-gray-500 mt-1">Order #{String(order._id).slice(-8).toUpperCase()}</p>
                </div>
                {!blocked && (
                  <span className="text-sm font-semibold text-amber-800 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-lg">
                    Awaiting payment & proof
                  </span>
                )}
              </div>

              <div className="border border-dashed border-gray-200 rounded-lg p-4 mb-6 bg-gray-50/80">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Amount breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery charge</span>
                    <span>₹{delivery.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Discount</span>
                    <span className="text-green-600">− ₹{discount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200 mt-2">
                    <span>Payable amount</span>
                    <span>₹{payable.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {!blocked ? (
                <>
                  <div className="flex flex-col items-center mb-8 p-4 border border-gray-100 rounded-xl bg-white">
                    <p className="text-sm font-semibold text-gray-800 mb-2">Scan QR to pay</p>
                    {qrUrl && (
                      <img src={qrUrl} alt="UPI QR" className="w-64 h-64 object-contain border border-gray-200 rounded-lg" />
                    )}
                    <p className="text-xs text-gray-500 mt-3">UPI ID: 8768006557@ptyes</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">12-digit UPI / UTR reference</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={14}
                        value={utr}
                        onChange={(e) => setUtr(e.target.value.replace(/\D/g, "").slice(0, 12))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Enter 12 digits"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment app</label>
                      <select
                        value={paymentApp}
                        onChange={(e) => setPaymentApp(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500"
                      >
                        {PAYMENT_APPS.map((a) => (
                          <option key={a} value={a}>
                            {a}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <FiUpload /> Payment screenshot
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="w-full text-sm text-gray-600"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting || blocked}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg shadow disabled:opacity-50"
                    >
                      {submitting ? "Submitting…" : "Submit payment proof"}
                    </button>
                  </form>
                </>
              ) : (
                <p className="text-center text-red-600 font-medium py-8">
                  {order.paymentVerificationStatus === "Timed_Out"
                    ? "This order is no longer accepting payment proof. Please contact support or place a new order."
                    : "This order has been cancelled."}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QrCheckoutPage;
