import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import { Helmet } from "react-helmet";
import { FiSettings, FiSave, FiUser, FiMail, FiPhone, FiMapPin, FiDollarSign, FiTruck, FiShield, FiBell } from "react-icons/fi";
import axios from "axios";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";

const Settings = () => {
  const [auth] = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      storeName: "Medicure",
      storeEmail: "admin@medicure.com",
      storePhone: "+1 (234) 567-890",
      storeAddress: "123 Medical Street, Health City, HC 12345",
      currency: "INR",
      timezone: "America/New_York"
    },
    payment: {
      stripeEnabled: true,
      paypalEnabled: true,
      cashOnDelivery: true,
      upiEnabled: true,
      upiId: "your-upi-id@paytm",
      stripeKey: "sk_test_...",
      paypalClientId: "client_id_..."
    },
    shipping: {
      freeShippingThreshold: 50,
      standardShipping: 5.99,
      expressShipping: 12.99,
      shippingZones: ["US", "CA", "UK","IN"]
    },
    notifications: {
      emailNotifications: true,
      orderNotifications: true,
      inventoryAlerts: true,
      weeklyReports: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      ipWhitelist: false
    }
  });

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/settings/get-settings`,
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );
      if (data.success && data.settings) {
        // Merge fetched settings with existing state
        setSettings((prev) => ({
          ...prev,
          general: { ...prev.general, ...data.settings.general },
          payment: { ...prev.payment, ...data.settings.payment },
          shipping: { ...prev.shipping, ...data.settings.shipping },
        }));
      }
    } catch (error) {
      console.log(error);
      // Don't show error if settings don't exist yet (first time)
      if (error.response?.status !== 404) {
        toast.error("Failed to load settings");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value
      }
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/settings/update-settings`,
        {
          general: settings.general,
          payment: settings.payment,
          shipping: settings.shipping,
        },
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message || "✅ Settings saved successfully!", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#10b981",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "bold",
            padding: "16px",
          },
        });
        // Show success message on page
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        toast.error(data.message || "Failed to save settings");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: FiSettings },
    { id: "payment", label: "Payment", icon: FiDollarSign },
    { id: "shipping", label: "Shipping", icon: FiTruck },
    { id: "notifications", label: "Notifications", icon: FiBell },
    { id: "security", label: "Security", icon: FiShield }
  ];

  return (
    <>
      <Helmet>
        <title>Settings - Admin Dashboard</title>
      </Helmet>
      <div className="flex min-h-screen bg-gray-50">
        <AdminMenu />
        
        <div className="flex-1 ml-0 lg:ml-64">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex flex-col lg:flex-row items-start lg:items-center justify-between sticky top-0 z-10 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
              <p className="text-sm text-gray-600 mt-1">Manage your store configuration</p>
            </div>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>

          {/* Success Confirmation Banner */}
          {saveSuccess && (
            <div className="mx-4 lg:mx-6 mt-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-md animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-800">Settings Saved Successfully!</p>
                  <p className="text-sm text-green-700 mt-1">Your changes have been saved to the database.</p>
                </div>
                <button
                  onClick={() => setSaveSuccess(false)}
                  className="text-green-500 hover:text-green-700 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Sidebar Tabs */}
              <div className="lg:w-64 flex-shrink-0">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-2 ${
                          activeTab === tab.id
                            ? "bg-orange-500 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Settings Content */}
              <div className="flex-1">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                  {/* General Settings */}
                  {activeTab === "general" && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">General Settings</h2>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                        <input
                          type="text"
                          value={settings.general.storeName}
                          onChange={(e) => handleInputChange("general", "storeName", e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Store Email</label>
                        <div className="relative">
                          <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="email"
                            value={settings.general.storeEmail}
                            onChange={(e) => handleInputChange("general", "storeEmail", e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Store Phone</label>
                        <div className="relative">
                          <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="tel"
                            value={settings.general.storePhone}
                            onChange={(e) => handleInputChange("general", "storePhone", e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Store Address</label>
                        <div className="relative">
                          <FiMapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                          <textarea
                            value={settings.general.storeAddress}
                            onChange={(e) => handleInputChange("general", "storeAddress", e.target.value)}
                            rows={3}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                          <select
                            value={settings.general.currency}
                            onChange={(e) => handleInputChange("general", "currency", e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            <option value="INR">INR (₹)</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                          <select
                            value={settings.general.timezone}
                            onChange={(e) => handleInputChange("general", "timezone", e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            <option value="America/New_York">Eastern Time</option>
                            <option value="America/Chicago">Central Time</option>
                            <option value="America/Denver">Mountain Time</option>
                            <option value="America/Los_Angeles">Pacific Time</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Settings */}
                  {activeTab === "payment" && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Settings</h2>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-gray-900">Stripe</h3>
                            <p className="text-sm text-gray-600">Credit card payments</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.payment.stripeEnabled}
                              onChange={(e) => handleInputChange("payment", "stripeEnabled", e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                          </label>
                        </div>

                        {settings.payment.stripeEnabled && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Stripe API Key</label>
                            <input
                              type="password"
                              value={settings.payment.stripeKey}
                              onChange={(e) => handleInputChange("payment", "stripeKey", e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                              placeholder="sk_test_..."
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-gray-900">PayPal</h3>
                            <p className="text-sm text-gray-600">PayPal payments</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.payment.paypalEnabled}
                              onChange={(e) => handleInputChange("payment", "paypalEnabled", e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-gray-900">Cash on Delivery</h3>
                            <p className="text-sm text-gray-600">Accept cash payments</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.payment.cashOnDelivery}
                              onChange={(e) => handleInputChange("payment", "cashOnDelivery", e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-gray-900">UPI Payment</h3>
                            <p className="text-sm text-gray-600">Accept UPI payments via QR code</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.payment.upiEnabled}
                              onChange={(e) => handleInputChange("payment", "upiEnabled", e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                          </label>
                        </div>

                        {settings.payment.upiEnabled && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
                            <input
                              type="text"
                              value={settings.payment.upiId}
                              onChange={(e) => handleInputChange("payment", "upiId", e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                              placeholder="your-upi-id@paytm"
                            />
                            <p className="text-xs text-gray-500 mt-1">Place your UPI QR code image at: client/public/images/upi-qr-code.png</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Shipping Settings */}
                  {activeTab === "shipping" && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Settings</h2>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Free Shipping Threshold (₹)</label>
                        <input
                          type="number"
                          value={settings.shipping.freeShippingThreshold}
                          onChange={(e) => handleInputChange("shipping", "freeShippingThreshold", e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Standard Shipping (₹)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={settings.shipping.standardShipping}
                            onChange={(e) => handleInputChange("shipping", "standardShipping", e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Express Shipping (₹)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={settings.shipping.expressShipping}
                            onChange={(e) => handleInputChange("shipping", "expressShipping", e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notifications Settings */}
                  {activeTab === "notifications" && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Notification Settings</h2>
                      
                      <div className="space-y-4">
                        {[
                          { key: "emailNotifications", label: "Email Notifications", desc: "Receive email updates" },
                          { key: "orderNotifications", label: "Order Notifications", desc: "Get notified of new orders" },
                          { key: "inventoryAlerts", label: "Inventory Alerts", desc: "Alert when stock is low" },
                          { key: "weeklyReports", label: "Weekly Reports", desc: "Receive weekly summary reports" }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div>
                              <h3 className="font-medium text-gray-900">{item.label}</h3>
                              <p className="text-sm text-gray-600">{item.desc}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.notifications[item.key]}
                                onChange={(e) => handleInputChange("notifications", item.key, e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Security Settings */}
                  {activeTab === "security" && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Security Settings</h2>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                            <p className="text-sm text-gray-600">Add an extra layer of security</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.security.twoFactorAuth}
                              onChange={(e) => handleInputChange("security", "twoFactorAuth", e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                          </label>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                          <input
                            type="number"
                            value={settings.security.sessionTimeout}
                            onChange={(e) => handleInputChange("security", "sessionTimeout", e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Password Expiry (days)</label>
                          <input
                            type="number"
                            value={settings.security.passwordExpiry}
                            onChange={(e) => handleInputChange("security", "passwordExpiry", e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;

