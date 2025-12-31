import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Helmet } from "react-helmet";
import { FiSearch, FiPackage, FiUser, FiDollarSign, FiCalendar, FiMapPin, FiGrid, FiList } from "react-icons/fi";

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
  const [viewMode, setViewMode] = useState("card"); // "card" or "table"
  const [statusFilter, setStatusFilter] = useState("All orders");

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
    const addressStr = typeof order.shippingAddress === 'object' 
      ? `${order.shippingAddress?.address || ''} ${order.shippingAddress?.city || ''} ${order.shippingAddress?.state || ''}`.toLowerCase()
      : (order.shippingAddress || '').toLowerCase();
    
    const matchesSearch = (
      order._id.toLowerCase().includes(searchLower) ||
      order.buyer?.name?.toLowerCase().includes(searchLower) ||
      order.status?.toLowerCase().includes(searchLower) ||
      addressStr.includes(searchLower)
    );
    
    const matchesStatus = statusFilter === "All orders" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return "No address provided";
    
    if (typeof address === 'string') {
      return address;
    }
    
    // Object format (new delivery address)
    const parts = [];
    if (address.address) parts.push(address.address);
    if (address.locality) parts.push(address.locality);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.pincode) parts.push(address.pincode);
    
    return parts.length > 0 ? parts.join(', ') : "No address provided";
  };

  // Get address details for display
  const getAddressDetails = (address) => {
    if (!address) return null;
    if (typeof address === 'string') return null;
    return {
      name: address.name || '',
      phone: address.phone || '',
      addressType: address.addressType || '',
    };
  };

  return (
    <>
      <Helmet>
        <title>Orders Management - Admin Dashboard</title>
      </Helmet>
      <div className="flex min-h-screen bg-gray-50">
        <AdminMenu />
        
        <div className="flex-1 ml-0 lg:ml-64">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 sticky top-0 z-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Order</h1>
                <p className="text-sm text-gray-500 mt-1">{filteredOrders.length} Orders found</p>
              </div>
              
              <div className="flex items-center gap-3">
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
                <div className="flex items-center gap-2 border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-2 ${viewMode === "table" ? "bg-orange-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                    title="Table View"
                  >
                    <FiList className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("card")}
                    className={`p-2 ${viewMode === "card" ? "bg-orange-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                    title="Card View"
                  >
                    <FiGrid className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Status Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
              {["All orders", "Order Placed", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    statusFilter === status
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {status}
                </button>
              ))}
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
            ) : viewMode === "table" ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrders.map((order, index) => {
                        const orderTotal = order.totalAmount || 
                          (order.products?.reduce((sum, p) => sum + (p.price || 0), 0) || 0);
                        const firstProduct = order.products?.[0];
                        
                        return (
                          <tr key={order._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{order._id.substring(0, 8)}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {firstProduct && (
                                  <img
                                    src={`${process.env.REACT_APP_API_BASE_URL}/api/v1/product/product-photo/${firstProduct._id}`}
                                    alt={firstProduct.name}
                                    className="w-10 h-10 object-cover rounded"
                                  />
                                )}
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {firstProduct?.name || "N/A"}
                                  </div>
                                  {order.products?.length > 1 && (
                                    <div className="text-xs text-gray-500">
                                      +{order.products.length - 1} more
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 max-w-xs">
                                {order.shippingAddress ? (
                                  typeof order.shippingAddress === 'object' ? (
                                    <div>
                                      <div className="font-medium">{order.shippingAddress.name}</div>
                                      <div className="text-xs text-gray-500 truncate">
                                        {formatAddress(order.shippingAddress)}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-xs text-gray-500 truncate">
                                      {formatAddress(order.shippingAddress)}
                                    </div>
                                  )
                                ) : (
                                  <span className="text-gray-400">N/A</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {moment(order.createdAt).format("DD/MM/YYYY")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              ₹{orderTotal.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                className="px-3 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                                onChange={(e) => handleChange(order._id, e.target.value)}
                                value={order.status}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {status.map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
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
                              <div className="flex items-center gap-2 text-gray-600">
                                <FiMapPin className="w-4 h-4" />
                                <span><strong>Payment:</strong> {order.paymentMode || "N/A"}</span>
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

                        {/* Delivery Address Section */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide flex items-center gap-2">
                            <FiMapPin className="w-4 h-4" />
                            Delivery Address
                          </h4>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            {order.shippingAddress ? (
                              typeof order.shippingAddress === 'object' ? (
                                <div>
                                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                                    <span className="font-semibold text-gray-800">
                                      {order.shippingAddress.name || "N/A"}
                                    </span>
                                    {order.shippingAddress.addressType && (
                                      <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded uppercase">
                                        {order.shippingAddress.addressType}
                                      </span>
                                    )}
                                    {order.shippingAddress.phone && (
                                      <span className="text-sm text-gray-600">
                                        {order.shippingAddress.phone}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-700 leading-relaxed">
                                    {formatAddress(order.shippingAddress)}
                                  </p>
                                  {order.shippingAddress.landmark && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      <strong>Landmark:</strong> {order.shippingAddress.landmark}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  {formatAddress(order.shippingAddress)}
                                </p>
                              )
                            ) : (
                              <p className="text-sm text-gray-500 italic">No delivery address provided</p>
                            )}
                          </div>
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
