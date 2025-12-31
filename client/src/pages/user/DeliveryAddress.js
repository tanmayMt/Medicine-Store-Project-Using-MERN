import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import axios from "axios";

const DeliveryAddress = () => {
  const [auth, setAuth] = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    pincode: "",
    locality: "",
    address: "",
    city: "",
    state: "",
    landmark: "",
    alternatePhone: "",
    addressType: "Home",
  });

  // Indian states list
  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];

  // Fetch addresses
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/delivery-addresses`
      );
      if (data.success) {
        setAddresses(data.addresses || []);
        const defaultAddress = data.addresses.find((addr) => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress._id);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      pincode: "",
      locality: "",
      address: "",
      city: "",
      state: "",
      landmark: "",
      alternatePhone: "",
      addressType: "Home",
    });
    setShowAddForm(false);
    setEditingAddress(null);
  };

  // Handle edit address
  const handleEdit = (address) => {
    setEditingAddress(address._id);
    setFormData({
      name: address.name,
      phone: address.phone,
      pincode: address.pincode,
      locality: address.locality,
      address: address.address,
      city: address.city,
      state: address.state,
      landmark: address.landmark || "",
      alternatePhone: address.alternatePhone || "",
      addressType: address.addressType || "Home",
    });
    setShowAddForm(true);
  };

  // Handle delete address
  const handleDelete = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        const { data } = await axios.delete(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/delivery-addresses/${addressId}`
        );
        if (data.success) {
          toast.success("Address deleted successfully");
          fetchAddresses();
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to delete address");
      }
    }
  };

  // Handle set default address
  const handleSetDefault = async (addressId) => {
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/delivery-addresses/${addressId}/set-default`
      );
      if (data.success) {
        toast.success("Default address updated");
        setSelectedAddress(addressId);
        fetchAddresses();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to set default address");
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.name ||
      !formData.phone ||
      !formData.pincode ||
      !formData.locality ||
      !formData.address ||
      !formData.city ||
      !formData.state
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (formData.phone.length !== 10) {
      toast.error("Phone number must be 10 digits");
      return;
    }

    if (formData.pincode.length !== 6) {
      toast.error("Pincode must be 6 digits");
      return;
    }

    try {
      setLoading(true);
      if (editingAddress) {
        // Update existing address
        const { data } = await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/delivery-addresses/${editingAddress}`,
          formData
        );
        if (data.success) {
          toast.success("Address updated successfully");
          resetForm();
          fetchAddresses();
        }
      } else {
        // Add new address
        const { data } = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/delivery-addresses`,
          formData
        );
        if (data.success) {
          toast.success("Address added successfully");
          resetForm();
          fetchAddresses();
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={"Delivery Address"}>
      <div className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <UserMenu />
            </div>

            <div className="col-span-1 md:col-span-3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                {/* Header */}
                <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg mb-6">
                  <h2 className="text-xl font-semibold">
                    {addresses.length} DELIVERY ADDRESS
                  </h2>
                </div>

                {/* Existing Addresses */}
                {!loading && addresses.length > 0 && (
                  <div className="space-y-4 mb-6">
                    {addresses.map((address) => (
                      <div
                        key={address._id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <input
                            type="radio"
                            name="selectedAddress"
                            checked={selectedAddress === address._id}
                            onChange={() => {
                              setSelectedAddress(address._id);
                              handleSetDefault(address._id);
                            }}
                            className="mt-1 w-5 h-5 text-blue-600"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900">
                                {address.name}
                              </h3>
                              <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded">
                                {address.addressType}
                              </span>
                              {address.isDefault && (
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                                  DEFAULT
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-1">
                              {address.phone}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {address.address}, {address.locality}, {address.city}, {address.state} - {address.pincode}
                            </p>
                            {address.landmark && (
                              <p className="text-gray-500 text-xs mt-1">
                                Landmark: {address.landmark}
                              </p>
                            )}
                            <div className="flex gap-4 mt-3">
                              <button
                                onClick={() => handleEdit(address)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(address._id)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Address Section */}
                <div className="border border-gray-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <input
                      type="radio"
                      name="selectedAddress"
                      checked={!selectedAddress && showAddForm}
                      onChange={() => {
                        setSelectedAddress(null);
                        setShowAddForm(true);
                      }}
                      className="w-5 h-5 text-blue-600"
                    />
                    <label className="text-lg font-semibold text-gray-900">
                      ADD A NEW ADDRESS
                    </label>
                  </div>

                  {showAddForm && (
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            10-digit mobile number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            maxLength="10"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pincode <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            maxLength="6"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Locality <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="locality"
                            value={formData.locality}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                            required
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address (Area and Street) <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City/District/Town <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            State <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                            required
                          >
                            <option value="">--Select State--</option>
                            {indianStates.map((state) => (
                              <option key={state} value={state}>
                                {state}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Landmark (Optional)
                          </label>
                          <input
                            type="text"
                            name="landmark"
                            value={formData.landmark}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Alternate Phone (Optional)
                          </label>
                          <input
                            type="tel"
                            name="alternatePhone"
                            value={formData.alternatePhone}
                            onChange={handleChange}
                            maxLength="10"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                          />
                        </div>
                      </div>

                      {/* Address Type */}
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address Type
                        </label>
                        <div className="flex gap-6">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="addressType"
                              value="Home"
                              checked={formData.addressType === "Home"}
                              onChange={handleChange}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">
                              Home (All day delivery)
                            </span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="addressType"
                              value="Work"
                              checked={formData.addressType === "Work"}
                              onChange={handleChange}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">
                              Work (Delivery between 10 AM - 5 PM)
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-4 mt-6">
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading
                            ? "Saving..."
                            : editingAddress
                            ? "UPDATE ADDRESS"
                            : "SAVE AND DELIVER HERE"}
                        </button>
                        <button
                          type="button"
                          onClick={resetForm}
                          className="px-6 py-3 bg-white text-blue-600 font-semibold border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          CANCEL
                        </button>
                      </div>
                    </form>
                  )}

                  {!showAddForm && (
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      + Add New Address
                    </button>
                  )}
                </div>

                {loading && addresses.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading addresses...</p>
                  </div>
                )}

                {!loading && addresses.length === 0 && !showAddForm && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No delivery addresses found</p>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add Your First Address
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DeliveryAddress;

