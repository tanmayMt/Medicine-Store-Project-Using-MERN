import React, { useState } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import { Helmet } from "react-helmet";
import { FiPercent, FiPlus, FiEdit, FiTrash2, FiCalendar, FiTag } from "react-icons/fi";

const Discounts = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [discounts] = useState([
    {
      id: 1,
      code: "SAVE20",
      type: "percentage",
      value: 20,
      minPurchase: 50,
      maxDiscount: 100,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      usageLimit: 1000,
      usedCount: 234,
      status: "active"
    },
    {
      id: 2,
      code: "FLAT50",
      type: "fixed",
      value: 50,
      minPurchase: 100,
      maxDiscount: 50,
      startDate: "2024-02-01",
      endDate: "2024-12-31",
      usageLimit: 500,
      usedCount: 89,
      status: "active"
    },
    {
      id: 3,
      code: "NEWUSER",
      type: "percentage",
      value: 15,
      minPurchase: 0,
      maxDiscount: 50,
      startDate: "2024-01-15",
      endDate: "2024-06-30",
      usageLimit: 2000,
      usedCount: 1456,
      status: "active"
    }
  ]);

  return (
    <>
      <Helmet>
        <title>Discounts - Admin Dashboard</title>
      </Helmet>
      <div className="flex min-h-screen bg-gray-50">
        <AdminMenu />
        
        <div className="flex-1 ml-0 lg:ml-64">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex flex-col lg:flex-row items-start lg:items-center justify-between sticky top-0 z-10 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Discounts & Coupons</h1>
              <p className="text-sm text-gray-600 mt-1">Manage promotional codes and discounts</p>
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              <span>Create Discount</span>
            </button>
          </div>

          {/* Content */}
          <div className="p-4 lg:p-6">
            {discounts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-100">
                <FiPercent className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-4">No discounts created yet</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Create Your First Discount
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {discounts.map((discount) => (
                  <div key={discount.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-orange-100 p-2 rounded-lg">
                          <FiTag className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{discount.code}</h3>
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                            discount.status === "active" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {discount.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <FiEdit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                          <FiTrash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Discount Type</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {discount.type === "percentage" ? `${discount.value}%` : `₹${discount.value}`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Min Purchase</span>
                        <span className="text-sm font-semibold text-gray-900">₹{discount.minPurchase}</span>
                      </div>
                      {discount.maxDiscount && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Max Discount</span>
                          <span className="text-sm font-semibold text-gray-900">₹{discount.maxDiscount}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Usage</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {discount.usedCount} / {discount.usageLimit}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <FiCalendar className="w-3 h-3" />
                        <span>Valid until {new Date(discount.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: `${(discount.usedCount / discount.usageLimit) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Create Modal */}
            {showCreateModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Discount</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Discount Code</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="e.g., SAVE20"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                          <option value="percentage">Percentage</option>
                          <option value="fixed">Fixed Amount</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="20"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Purchase</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="0"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowCreateModal(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                        Create
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Discounts;

