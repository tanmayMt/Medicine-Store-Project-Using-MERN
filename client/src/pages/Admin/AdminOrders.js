import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Helmet } from "react-helmet";
import { FiSearch, FiPackage, FiUser, FiDollarSign, FiCalendar } from "react-icons/fi";

const AdminOrders = () => {
  const [status] = useState([
    "Not Processed",
    "Order Placed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Returned"
  ]);
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const getOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/all-orders`);
      setOrders(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const handleChange = async (orderId, value) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/order-status-admin/${orderId}`, {
        status: value,
      });
      toast.success("Order status updated successfully");
      getOrders();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update order status");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      "Not Processed": "bg-gray-100 text-gray-800",
      "Order Placed": "bg-blue-100 text-blue-800",
      "Processing": "bg-yellow-100 text-yellow-800",
      "Shipped": "bg-purple-100 text-purple-800",
      "Delivered": "bg-green-100 text-green-800",
      "Cancelled": "bg-red-100 text-red-800",
      "Returned": "bg-orange-100 text-orange-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order._id.toLowerCase().includes(searchLower) ||
      order.buyer?.name?.toLowerCase().includes(searchLower) ||
      order.status?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <>
      <Helmet>
        <title>Orders Management - Admin Dashboard</title>
      </Helmet>
      <div className="flex min-h-screen bg-gray-50">
        <AdminMenu />
        
        <div className="flex-1 ml-0 lg:ml-64">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex flex-col lg:flex-row items-start lg:items-center justify-between sticky top-0 z-10 gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
            
            <div className="relative w-full lg:w-64">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-4 lg:p-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-100">
                <FiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No orders found</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => {
                  const orderTotal = order.totalAmount || 
                    (order.products?.reduce((sum, p) => sum + (p.price || 0), 0) || 0);
                  
                  return (
                    <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                      {/* Order Header */}
                      <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-gray-200">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-800">Order #{order._id.substring(0, 8)}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center gap-2 text-gray-600">
                                <FiUser className="w-4 h-4" />
                                <span><strong>Customer:</strong> {order.buyer?.name || "N/A"}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <FiCalendar className="w-4 h-4" />
                                <span><strong>Date:</strong> {moment(order.createdAt).format("DD MMM YYYY, hh:mm A")}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <FiDollarSign className="w-4 h-4" />
                                <span><strong>Total:</strong> ₹{orderTotal.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="lg:ml-4">
                            <select
                              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-sm font-medium"
                              onChange={(e) => handleChange(order._id, e.target.value)}
                              value={order.status}
                            >
                              {status.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="p-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                          Order Items ({order.products?.length || 0})
                        </h4>
                        <div className="space-y-4">
                          {order.products?.map((product) => (
                            <div key={product._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="w-20 h-20 flex-shrink-0">
                                <img
                                  src={`${process.env.REACT_APP_API_BASE_URL}/api/v1/product/product-photo/${product._id}`}
                                  alt={product.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-semibold text-gray-800 mb-1">{product.name}</h5>
                                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                  {product.description?.substring(0, 100)}
                                  {product.description?.length > 100 && "..."}
                                </p>
                                <div className="flex items-center gap-4">
                                  <span className="text-sm font-semibold text-orange-600">
                                    ₹{product.price?.toLocaleString() || "0"}
                                  </span>
                                  {product.quantity && (
                                    <span className="text-sm text-gray-500">
                                      Qty: {product.quantity}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Payment Info */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Payment Status:</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.payment?.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                              {order.payment?.success ? "Success" : "Failed"}
                            </span>
                          </div>
                          {order.paymentMode && (
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-sm text-gray-600">Payment Mode:</span>
                              <span className="text-sm font-medium text-gray-800">{order.paymentMode}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminOrders;
