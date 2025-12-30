import React, { useState } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import { Helmet } from "react-helmet";
import { FiFileText, FiDownload, FiCalendar, FiTrendingUp, FiDollarSign, FiShoppingCart, FiUsers } from "react-icons/fi";

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const reportCards = [
    {
      title: "Total Sales",
      value: "₹45,231",
      change: "+12.5%",
      trend: "up",
      icon: FiDollarSign,
      color: "bg-green-500"
    },
    {
      title: "Total Orders",
      value: "1,234",
      change: "+8.2%",
      trend: "up",
      icon: FiShoppingCart,
      color: "bg-blue-500"
    },
    {
      title: "New Customers",
      value: "456",
      change: "+15.3%",
      trend: "up",
      icon: FiUsers,
      color: "bg-purple-500"
    },
    {
      title: "Revenue Growth",
      value: "23.5%",
      change: "+5.1%",
      trend: "up",
      icon: FiTrendingUp,
      color: "bg-orange-500"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Reports - Admin Dashboard</title>
      </Helmet>
      <div className="flex min-h-screen bg-gray-50">
        <AdminMenu />
        
        <div className="flex-1 ml-0 lg:ml-64">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex flex-col lg:flex-row items-start lg:items-center justify-between sticky top-0 z-10 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
              <p className="text-sm text-gray-600 mt-1">Analytics and insights for your store</p>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                <FiDownload className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 lg:p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {reportCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${card.color} p-3 rounded-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className={`text-sm font-medium ${
                        card.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}>
                        {card.change}
                      </span>
                    </div>
                    <h3 className="text-sm text-gray-600 mb-1">{card.title}</h3>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Report Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Report */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Sales Report</h2>
                  <FiCalendar className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Total Revenue</span>
                    <span className="text-lg font-semibold text-gray-900">₹45,231</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Average Order Value</span>
                    <span className="text-lg font-semibold text-gray-900">₹36.65</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Orders Completed</span>
                    <span className="text-lg font-semibold text-gray-900">1,234</span>
                  </div>
                </div>
              </div>

              {/* Customer Report */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Customer Report</h2>
                  <FiUsers className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">New Customers</span>
                    <span className="text-lg font-semibold text-gray-900">456</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Returning Customers</span>
                    <span className="text-lg font-semibold text-gray-900">778</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Customer Retention</span>
                    <span className="text-lg font-semibold text-gray-900">63.1%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FiFileText className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Order #{1000 + item} completed</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-green-600">+₹125.00</span>
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

export default Reports;

