import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";
import toast from "react-hot-toast";
import { 
  FiBox, 
  FiCalendar, 
  FiHash, 
  FiEye, 
  FiXCircle,
  FiPackage,
  FiShoppingBag,
  FiCheckCircle,
  FiTruck,
  FiClock
} from "react-icons/fi";
// Import Rupee Icon from FontAwesome or similar package since Feather (fi) doesn't have it
import { FaRupeeSign } from "react-icons/fa";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();
  const [loading, setLoading] = useState(true);

  const getOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/orders`);
      setOrders(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  // Cancel Order Function
  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }
    try {
      const res = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/order-status/${orderId}`, {
        status: "Cancelled",
      });
      if (res.data.success) {
        toast.success(res.data.message);
        getOrders();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to cancel order");
    }
  };

  // Helper for Status Color and Icon
  const getStatusConfig = (status) => {
    switch (status) {
      case "Delivered": 
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: <FiCheckCircle className="w-4 h-4" />,
          textColor: "text-green-600"
        };
      case "Shipped": 
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: <FiTruck className="w-4 h-4" />,
          textColor: "text-blue-600"
        };
      case "Cancelled": 
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          icon: <FiXCircle className="w-4 h-4" />,
          textColor: "text-red-600"
        };
      case "Order Placed": 
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: <FiClock className="w-4 h-4" />,
          textColor: "text-yellow-600"
        };
      default: 
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: <FiPackage className="w-4 h-4" />,
          textColor: "text-gray-600"
        };
    }
  };

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => {
    return sum + (order.products?.reduce((acc, item) => acc + (item.price || 0), 0) || 0);
  }, 0);

  return (
    <Layout title={"Your Orders"}>
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="col-span-1">
              <UserMenu />
            </div>

            {/* Main Content */}
            <div className="col-span-1 md:col-span-3 space-y-6">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                      <FiShoppingBag className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-bold">My Orders</h1>
                  </div>
                  <p className="text-blue-100 text-lg">Track and manage all your orders</p>
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white shadow-md">
                      <FiBox className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Total Orders</h3>
                  <p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg text-white shadow-md">
                      {/* Replaced FiDollarSign with FaRupeeSign */}
                      <FaRupeeSign className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Total Spent</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {/* Updated to Indian Currency Format */}
                    {totalSpent.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                  </p>
                </div>
              </div>

              {/* Orders List */}
              {loading ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-4">Loading your orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <FiBox className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Yet</h3>
                  <p className="text-gray-500 mb-6">You haven't placed any orders yet. Start shopping to see your orders here!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders?.map((o, i) => {
                    const statusConfig = getStatusConfig(o?.status);
                    const orderTotal = o?.products?.reduce((acc, item) => acc + (item.price || 0), 0) || 0;
                    
                    return (
                      <div key={i} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <FiHash className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-1">Order Number</p>
                              <p className="text-lg font-bold text-gray-900">#{o?._id?.substring(0, 8).toUpperCase()}</p>
                            </div>
                          </div>
                          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${statusConfig.color} font-semibold text-sm`}>
                            {statusConfig.icon}
                            {o?.status}
                          </div>
                        </div>

                        {/* Products Preview */}
                        <div className="mb-6">
                          <div className="flex -space-x-3 mb-4">
                            {o?.products?.slice(0, 4).map((p, idx) => (
                              <div key={p._id || idx} className="relative group">
                                <img
                                  src={`${process.env.REACT_APP_API_BASE_URL}/api/v1/product/product-photo/${p._id}`}
                                  alt={p.name}
                                  className="w-16 h-16 rounded-lg object-cover border-2 border-white shadow-md bg-gray-100 group-hover:scale-110 transition-transform duration-200"
                                />
                              </div>
                            ))}
                            {o?.products?.length > 4 && (
                              <div className="w-16 h-16 rounded-lg border-2 border-white shadow-md bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                +{o.products.length - 4}
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">{o?.products?.length}</span> {o?.products?.length === 1 ? 'item' : 'items'} in this order
                          </p>
                        </div>

                        {/* Order Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <FiCalendar className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-1">Order Date</p>
                              <p className="text-sm font-medium text-gray-900">{moment(o?.createAt).format("DD MMM YYYY")}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            {/* Replaced FiDollarSign with FaRupeeSign */}
                            <FaRupeeSign className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-1">Total Amount</p>
                              <p className="text-sm font-bold text-gray-900">
                                {/* Updated to Indian Currency Format */}
                                {orderTotal.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <FiPackage className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-1">Items</p>
                              <p className="text-sm font-medium text-gray-900">{o?.products?.length} {o?.products?.length === 1 ? 'Product' : 'Products'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                          <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg">
                            <FiEye className="w-4 h-4" />
                            View Order Details
                          </button>
                          {o?.status === "Order Placed" && (
                            <button 
                              onClick={() => handleCancel(o._id)}
                              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-red-600 font-semibold border-2 border-red-200 rounded-lg hover:bg-red-50 transition-all duration-200"
                            >
                              <FiXCircle className="w-4 h-4" />
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;