import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import { useAuth } from "../../context/auth";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FiDollarSign,
  FiShoppingCart,
  FiUsers,
  FiSearch,
  FiBell,
  FiMessageCircle,
  FiChevronDown,
} from "react-icons/fi";
import { Helmet } from "react-helmet";

const AdminDashboard = () => {
  const [auth] = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [timeframe, setTimeframe] = useState("Last 8 Days");
  const [conversionTimeframe, setConversionTimeframe] = useState("This Week");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/dashboard-stats`
        );
        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (auth?.token) {
      fetchStats();
    }
  }, [auth?.token]);

  // Category colors for charts
  const categoryColors = ["#ea580c", "#fb923c", "#fdba74", "#fed7aa"];

  // Sample data for Active Users (can be replaced with real data later)
  const userData = [
    { country: "United States", percentage: 36 },
    { country: "United Kingdom", percentage: 24 },
    { country: "Indonesia", percentage: 17.5 },
    { country: "Russia", percentage: 15 },
  ];

  // Sample data for Conversion Rate (can be replaced with real data later)
  const conversionData = [
    { stage: "Product Views", value: 25000, trend: "+9%" },
    { stage: "Add to Cart", value: 12000, trend: "+6%" },
    { stage: "Proceed to Checkout", value: 8500, trend: "+4%" },
    { stage: "Completed Purchases", value: stats?.totalOrders || 0, trend: "+7%" },
    { stage: "Abandoned Carts", value: 3000, trend: "-5%" },
  ];

  // Sample data for Traffic Sources (can be replaced with real data later)
  const trafficData = [
    { source: "Direct Traffic", percentage: 40 },
    { source: "Organic Search", percentage: 30 },
    { source: "Social Media", percentage: 15 },
    { source: "Referral Traffic", percentage: 10 },
    { source: "Email Campaigns", percentage: 5 },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminMenu />
        <div className="flex-1 ml-0 lg:ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const totalSales = stats?.totalSales || 0;
  const totalOrders = stats?.totalOrders || 0;
  const totalVisitors = stats?.totalUsers || 0;
  const monthlyTarget = stats?.monthlyTarget || 600000;
  const monthlyRevenue = stats?.monthlyRevenue || 0;
  const monthlyTargetPercentage = stats?.monthlyTargetPercentage || 0;
  const activeUsers = stats?.totalUsers || 0;
  const revenueData = stats?.revenueData || [];
  const categoryData = stats?.categoryData || [];

  // Format category data with colors
  const formattedCategoryData = categoryData.map((cat, index) => ({
    ...cat,
    color: categoryColors[index % categoryColors.length],
  }));

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - EzMart</title>
      </Helmet>
      <div className="flex min-h-screen bg-gray-50">
            <AdminMenu />
        
        {/* Main Content Area */}
        <div className="flex-1 ml-0 lg:ml-64">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex flex-col lg:flex-row items-start lg:items-center justify-between sticky top-0 z-10 gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            
            <div className="flex items-center gap-2 lg:gap-4 w-full lg:w-auto">
              {/* Search Bar */}
              <div className="relative flex-1 lg:flex-initial">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search stock, order, etc"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-full lg:w-64"
                />
              </div>

              {/* Icons */}
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FiBell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FiMessageCircle className="w-5 h-5 text-gray-600" />
              </button>

              {/* User Profile */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
                >
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {auth?.user?.name?.charAt(0)?.toUpperCase() || "A"}
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-semibold text-gray-800">
                      {auth?.user?.name || "Admin"}
                    </p>
                    <p className="text-xs text-gray-500">Admin</p>
                  </div>
                  <FiChevronDown className="w-4 h-4 text-gray-600" />
                </button>
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-20">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        {auth?.user?.name}
                      </p>
                      <p className="text-xs text-gray-500">{auth?.user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        localStorage.removeItem("auth");
                        window.location.href = "/login";
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-4 lg:p-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6">
              {/* Total Sales */}
              <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <FiDollarSign className="w-6 h-6 text-orange-500" />
                    </div>
                    <h3 className="text-gray-600 font-medium">Total Sales</h3>
                  </div>
                </div>
                <p className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                  ₹{totalSales.toLocaleString()}
                </p>
                <p className={`text-sm font-medium ${
                  stats?.salesChange?.startsWith("+") ? "text-green-600" : "text-red-600"
                }`}>
                  {stats?.salesChange || "0%"} vs last week
                </p>
              </div>

              {/* Total Orders */}
              <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiShoppingCart className="w-6 h-6 text-blue-500" />
                    </div>
                    <h3 className="text-gray-600 font-medium">Total Orders</h3>
                  </div>
                </div>
                <p className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                  {totalOrders.toLocaleString()}
                </p>
                <p className={`text-sm font-medium ${
                  stats?.ordersChange?.startsWith("+") ? "text-green-600" : "text-red-600"
                }`}>
                  {stats?.ordersChange || "0%"} vs last week
                </p>
              </div>

              {/* Total Visitors */}
              <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <FiUsers className="w-6 h-6 text-green-500" />
                    </div>
                    <h3 className="text-gray-600 font-medium">Total Customers</h3>
                  </div>
                </div>
                <p className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                  {totalVisitors.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 font-medium">+8.02% vs last week</p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
              {/* Revenue Analytics */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-4 lg:p-6 border border-gray-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
                  <h3 className="text-lg font-semibold text-gray-800">Revenue Analytics</h3>
                  <div className="relative">
                    <select
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value)}
                      className="appearance-none bg-orange-500 text-white px-4 py-2 rounded-lg pr-8 focus:outline-none cursor-pointer text-sm font-medium"
                    >
                      <option>Last 8 Days</option>
                      <option>Last 30 Days</option>
                      <option>Last 3 Months</option>
                    </select>
                    <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white w-4 h-4 pointer-events-none" />
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis 
                      stroke="#6b7280" 
                      tickFormatter={(value) => `₹${value.toLocaleString()}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                      formatter={(value, name) => {
                        if (name === "Revenue" || name === "Order") {
                          return [`₹${value.toLocaleString()}`, name];
                        }
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#ea580c"
                      strokeWidth={2}
                      name="Revenue"
                      dot={{ fill: "#ea580c", r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="order"
                      stroke="#ea580c"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Order"
                      dot={{ fill: "#ea580c", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Monthly Target */}
              <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Target</h3>
                <div className="flex flex-col items-center justify-center mb-4">
                  <div className="relative w-40 h-40 lg:w-48 lg:h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            {
                              name: "Completed",
                              value: monthlyTargetPercentage,
                              color: "#ea580c",
                            },
                            {
                              name: "Remaining",
                              value: 100 - monthlyTargetPercentage,
                              color: "#e5e7eb",
                            },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          startAngle={90}
                          endAngle={-270}
                          dataKey="value"
                        >
                          <Cell fill="#ea580c" />
                          <Cell fill="#e5e7eb" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl lg:text-3xl font-bold text-gray-800">{monthlyTargetPercentage}%</p>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-green-600 font-medium text-center mb-2">
                  +8.02% from last month
                </p>
                <p className="text-xs text-gray-600 text-center mb-4">
                  Great Progress! Our achievement increased by ₹200,000; let's reach 100% next month.
                </p>
                <div className="flex justify-between text-sm">
                  <div className="text-center">
                    <p className="text-gray-600">Target</p>
                    <p className="font-semibold text-gray-800">₹{monthlyTarget.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Revenue</p>
                    <p className="font-semibold text-gray-800">₹{monthlyRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
              {/* Top Categories */}
              <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Top Categories</h3>
                  <a href="#" className="text-sm text-orange-500 hover:underline">
                    See All
                  </a>
                </div>
                {formattedCategoryData.length > 0 ? (
                  <>
                    <div className="flex items-center justify-center mb-4">
                      <div className="relative w-40 h-40 lg:w-48 lg:h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={formattedCategoryData}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={70}
                              dataKey="value"
                            >
                              {formattedCategoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-xs text-gray-600">Total Sales</p>
                            <p className="text-sm lg:text-lg font-bold text-gray-800">
                              ₹{formattedCategoryData.reduce((sum, cat) => sum + cat.value, 0).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {formattedCategoryData.map((category, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: category.color }}
                            ></div>
                            <span className="text-sm text-gray-700">{category.name}</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-800">
                            ₹{category.value.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-center text-gray-500 py-8">No category data available</p>
                )}
              </div>

              {/* Active User */}
              <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Users</h3>
                <p className="text-2xl lg:text-3xl font-bold text-gray-800 mb-1">{activeUsers.toLocaleString()}</p>
                <p className="text-sm text-green-600 font-medium mb-4">+8.02% from last month</p>
                <div className="space-y-3">
                  {userData.map((user, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700">{user.country}</span>
                        <span className="text-sm font-semibold text-gray-800">{user.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: `${user.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conversion Rate */}
              <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 border border-gray-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
                  <h3 className="text-lg font-semibold text-gray-800">Conversion Rate</h3>
                  <div className="relative">
                    <select
                      value={conversionTimeframe}
                      onChange={(e) => setConversionTimeframe(e.target.value)}
                      className="appearance-none bg-orange-500 text-white px-4 py-2 rounded-lg pr-8 focus:outline-none cursor-pointer text-sm font-medium"
                    >
                      <option>This Week</option>
                      <option>This Month</option>
                      <option>This Year</option>
                    </select>
                    <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white w-4 h-4 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-3">
                  {conversionData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-700">{item.stage}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-800">
                              {item.value.toLocaleString()}
                            </span>
                            <span
                              className={`text-xs font-medium ${
                                item.trend.startsWith("+") ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {item.trend}
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full"
                            style={{
                              width: `${(item.value / conversionData[0].value) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Traffic Sources */}
            <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Traffic Sources</h3>
              <div className="space-y-3">
                {trafficData.map((source, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">{source.source}</span>
                      <span className="text-sm font-semibold text-gray-800">{source.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
