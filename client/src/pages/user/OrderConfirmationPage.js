import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import { FiCheckCircle, FiClock, FiPackage } from "react-icons/fi";

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const [auth] = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/product/qr-order/${orderId}`,
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      if (data.success) setOrder(data.order);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [orderId, auth?.token]);

  useEffect(() => {
    if (auth?.token) load();
  }, [auth?.token, load]);

  const verification = order?.paymentVerificationStatus;
  const paymentLabel =
    verification === "Verified"
      ? "Verified"
      : verification === "Rejected"
        ? "Rejected"
        : verification === "Timed_Out"
          ? "Timed out"
          : "Pending";

  return (
    <Layout title="Order confirmation">
      <div className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="hidden md:block col-span-1">
            <UserMenu />
          </div>
          <div className="col-span-1 md:col-span-3">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
              {loading ? (
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto" />
              ) : (
                <>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-50 text-orange-600 mb-4">
                    {verification === "Verified" ? <FiCheckCircle className="w-8 h-8" /> : <FiClock className="w-8 h-8" />}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank you for your order</h1>
                  <p className="text-sm text-gray-500 mb-6">
                    Order ID: <span className="font-mono font-semibold text-gray-800">{order?._id}</span>
                  </p>
                  <div className="inline-block px-4 py-2 rounded-full bg-amber-50 text-amber-800 text-sm font-semibold mb-6">
                    Payment status: {paymentLabel}
                  </div>
                  {verification === "Pending" && (
                    <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                      Admin will verify your payment shortly. You will receive an email when your payment is confirmed.
                    </p>
                  )}
                  {verification === "Verified" && (
                    <p className="text-green-700 font-medium">Your payment has been verified. Your order is being processed.</p>
                  )}
                  {verification === "Rejected" && (
                    <p className="text-red-600">
                      {order?.adminRemarks
                        ? `Reason: ${order.adminRemarks}`
                        : "Your payment could not be verified. Please contact support."}
                    </p>
                  )}
                  {verification === "Timed_Out" && (
                    <p className="text-red-600">This order timed out before payment proof was received.</p>
                  )}
                  <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <Link
                      to="/dashboard/user/orders"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700"
                    >
                      <FiPackage /> View my orders
                    </Link>
                    <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                      Continue shopping
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmationPage;
