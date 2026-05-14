import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";
import { useAuth } from "../../context/auth";
import { Helmet } from "react-helmet";
import { FiCheck, FiX, FiZoomIn, FiRefreshCw } from "react-icons/fi";

const api = process.env.REACT_APP_API_BASE_URL;

function PaymentScreenshotThumb({ orderId, token, onZoom }) {
  const [src, setSrc] = useState("");
  const objectUrlRef = useRef("");

  useEffect(() => {
    let alive = true;
    objectUrlRef.current = "";
    setSrc("");

    (async () => {
      try {
        const res = await axios.get(`${api}/api/v1/product/payment-proof/${orderId}`, {
          responseType: "blob",
          headers: { Authorization: `Bearer ${token}` },
        });
        const objectUrl = URL.createObjectURL(res.data);
        if (!alive) {
          URL.revokeObjectURL(objectUrl);
          return;
        }
        objectUrlRef.current = objectUrl;
        setSrc(objectUrl);
      } catch {
        if (alive) setSrc("");
      }
    })();

    return () => {
      alive = false;
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = "";
      }
    };
  }, [orderId, token]);

  if (!src) {
    return <span className="text-xs text-gray-400">No screenshot yet</span>;
  }
  return (
    <button
      type="button"
      onClick={() => onZoom(src)}
      className="relative group block w-full max-w-[140px] mx-auto"
    >
      <img src={src} alt="Payment proof" className="w-full h-28 object-cover rounded-lg border border-gray-200" />
      <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg text-white text-xs font-semibold gap-1">
        <FiZoomIn /> Zoom
      </span>
    </button>
  );
}

const AdminQrPayments = () => {
  const [auth] = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [zoomSrc, setZoomSrc] = useState(null);
  const [remarks, setRemarks] = useState({});

  const headers = { Authorization: `Bearer ${auth?.token}` };

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${api}/api/v1/auth/orders/qr-pending-verification`, { headers });
      setOrders(data.orders || []);
    } catch (e) {
      console.log(e);
      toast.error("Failed to load pending verifications");
    } finally {
      setLoading(false);
    }
  }, [auth?.token]);

  useEffect(() => {
    if (auth?.token) load();
  }, [auth?.token, load]);

  const verify = async (orderId, action) => {
    try {
      await axios.put(
        `${api}/api/v1/auth/orders/verify-qr/${orderId}`,
        { action, adminRemarks: remarks[orderId] || "" },
        { headers }
      );
      toast.success(action === "approve" ? "Payment approved" : "Payment rejected");
      setRemarks((r) => ({ ...r, [orderId]: "" }));
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Update failed");
    }
  };

  return (
    <>
      <Helmet>
        <title>UPI / QR verification — Admin</title>
      </Helmet>
      {zoomSrc && (
        <button
          type="button"
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setZoomSrc(null)}
        >
          <img src={zoomSrc} alt="Zoom" className="max-h-[90vh] max-w-full rounded-lg shadow-2xl" />
        </button>
      )}
      <div className="flex min-h-screen bg-gray-50">
        <AdminMenu />
        <div className="flex-1 ml-0 lg:ml-64 p-4 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">UPI / QR verification</h1>
              <p className="text-sm text-gray-500 mt-1">Orders with payment mode QR and verification pending</p>
            </div>
            <button
              type="button"
              onClick={load}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              <FiRefreshCw /> Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-100 p-12 text-center text-gray-500">
              No orders pending QR verification.
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-orange-100 flex flex-wrap justify-between gap-2">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Order</p>
                      <p className="font-mono font-bold text-gray-900">#{String(order._id).slice(-10)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Amount</p>
                      <p className="text-lg font-bold text-orange-700">₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Customer</p>
                      <p className="font-medium text-gray-900">{order.buyer?.name}</p>
                      <p className="text-sm text-gray-600">{order.buyer?.email}</p>
                      <p className="text-sm text-gray-600">{order.buyer?.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Payment details</p>
                      <p className="text-sm text-gray-700">
                        <span className="text-gray-500">UTR:</span>{" "}
                        {order.upiTransactionId || order.transactionId || "—"}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="text-gray-500">App:</span> {order.paymentAppName || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Screenshot</p>
                      <PaymentScreenshotThumb orderId={order._id} token={auth?.token} onZoom={setZoomSrc} />
                    </div>
                  </div>
                  <div className="px-6 pb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Admin remarks</label>
                    <textarea
                      rows={2}
                      value={remarks[order._id] || ""}
                      onChange={(e) => setRemarks((r) => ({ ...r, [order._id]: e.target.value }))}
                      placeholder="e.g. Amount mismatch, UTR not found…"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 mb-4"
                    />
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        disabled={!(order.transactionId || order.upiTransactionId)}
                        onClick={() => verify(order._id, "approve")}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-40"
                      >
                        <FiCheck /> Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => verify(order._id, "reject")}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
                      >
                        <FiX /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminQrPayments;
