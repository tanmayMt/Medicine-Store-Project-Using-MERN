import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiBox, 
  FiDollarSign, 
  FiUser, 
  FiEdit3,
  FiArrowRight,
  FiShoppingBag,
  FiTrendingUp
} from "react-icons/fi";

const Dashboard = () => {
  const [auth] = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch addresses
        const addressRes = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/delivery-addresses`
        );
        if (addressRes.data.success) {
          setAddresses(addressRes.data.addresses || []);
        }
        setLoading(false);

        // Fetch orders
        const ordersRes = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/orders`
        );
        setOrders(ordersRes.data || []);
        setOrdersLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        setOrdersLoading(false);
      }
    };
    fetchData();
  }, []);

  const defaultAddress = addresses.find((addr) => addr.isDefault);
  
  // Calculate statistics
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => {
    return sum + (order.products?.reduce((acc, item) => acc + (item.price || 0), 0) || 0);
  }, 0);
  const pendingOrders = orders.filter(order => 
    order.status && !['Delivered', 'Cancelled'].includes(order.status)
  ).length;

  const statsCards = [
    {
      title: "Total Orders",
      value: totalOrders,
      icon: <FiShoppingBag className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Total Spent",
      value: `$${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <FiDollarSign className="w-6 h-6" />,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: <FiBox className="w-6 h-6" />,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600"
    },
    {
      title: "Saved Addresses",
      value: addresses.length,
      icon: <FiMapPin className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    }
  ];
  
  return (
    <Layout title={"Dashboard - Ecommerce App"}>
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <UserMenu />
            </div>
            
            <div className="col-span-1 md:col-span-3 space-y-6">
              {/* Welcome Header */}
              <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
                <div className="relative z-10">
                  <h1 className="text-4xl font-bold mb-2">
                    Welcome back, <span className="text-blue-200">{auth?.user?.name?.split(' ')[0] || 'User'}</span>!
                  </h1>
                  <p className="text-blue-100 text-lg">
                    Here's what's happening with your account today
                  </p>
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        {stat.icon}
                      </div>
                      <FiTrendingUp className={`w-5 h-5 ${stat.textColor} opacity-50`} />
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
                    <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Main Content Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Account Info Card */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white shadow-md">
                        <FiUser className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">Account Information</h3>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <FiMail className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-1">Email Address</p>
                        <p className="text-sm font-medium text-gray-800 truncate">{auth?.user?.email || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <FiPhone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-1">Phone Number</p>
                        <p className="text-sm font-medium text-gray-800">{auth?.user?.phone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  <NavLink 
                    to="/dashboard/user/profile" 
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group-hover:gap-3 duration-300"
                  >
                    <FiEdit3 className="w-4 h-4" />
                    Edit Account Details
                    <FiArrowRight className="w-4 h-4" />
                  </NavLink>
                </div>
                
                {/* Delivery Addresses Card */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg text-white shadow-md">
                        <FiMapPin className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">Delivery Addresses</h3>
                    </div>
                  </div>
                  
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    </div>
                  ) : addresses.length > 0 ? (
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                          <span className="font-bold text-gray-800">{addresses.length}</span> {addresses.length === 1 ? 'Address' : 'Addresses'} Saved
                        </p>
                      </div>
                      
                      {defaultAddress && (
                        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-20 h-20 bg-green-200 opacity-20 rounded-full -mr-10 -mt-10"></div>
                          <div className="relative z-10">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="text-sm font-bold text-gray-800 mb-1">
                                  {defaultAddress.name}
                                </p>
                                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-2">
                                  {defaultAddress.addressType}
                                </p>
                              </div>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-500 text-white shadow-sm">
                                Default
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {defaultAddress.address}, {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.pincode}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 mb-6">
                      <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                        <FiMapPin className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm">No delivery addresses set</p>
                    </div>
                  )}
                  
                  <NavLink 
                    to="/dashboard/user/delivery-address" 
                    className="inline-flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors group-hover:gap-3 duration-300"
                  >
                    {addresses.length > 0 ? (
                      <>
                        <FiEdit3 className="w-4 h-4" />
                        Manage Addresses
                      </>
                    ) : (
                      <>
                        <FiMapPin className="w-4 h-4" />
                        Add New Address
                      </>
                    )}
                    <FiArrowRight className="w-4 h-4" />
                  </NavLink>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <NavLink
                    to="/dashboard/user/orders"
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 group"
                  >
                    <div className="p-2 bg-blue-500 rounded-lg text-white group-hover:scale-110 transition-transform duration-300">
                      <FiBox className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">View Orders</p>
                      <p className="text-xs text-gray-500">Check your order history</p>
                    </div>
                    <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                  </NavLink>

                  <NavLink
                    to="/dashboard/user/profile"
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:from-purple-100 hover:to-pink-100 transition-all duration-300 group"
                  >
                    <div className="p-2 bg-purple-500 rounded-lg text-white group-hover:scale-110 transition-transform duration-300">
                      <FiUser className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">Update Profile</p>
                      <p className="text-xs text-gray-500">Edit your personal information</p>
                    </div>
                    <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-300" />
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;