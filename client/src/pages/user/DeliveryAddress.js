import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import axios from "axios";
import { 
  FiMapPin, 
  FiUser, 
  FiPhone, 
  FiEdit3, 
  FiTrash2, 
  FiCheck, 
  FiPlus,
  FiHome,
  FiBriefcase,
  FiNavigation
} from "react-icons/fi";

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
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <UserMenu />
            </div>

            <div className="col-span-1 md:col-span-3 space-y-6">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                      <FiMapPin className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-bold">Delivery Addresses</h1>
                  </div>
                  <p className="text-green-100 text-lg">
                    Manage your delivery addresses for faster checkout
                  </p>
                </div>
              </div>

              {/* Main Content */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8">

                {/* Existing Addresses */}
                {!loading && addresses.length > 0 && (
                  <div className="space-y-4 mb-8">
                    {addresses.map((address) => (
                      <div
                        key={address._id}
                        className={`border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-lg ${
                          address.isDefault 
                            ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50' 
                            : 'border-gray-200 bg-white hover:border-green-300'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="mt-1">
                            <input
                              type="radio"
                              name="selectedAddress"
                              checked={selectedAddress === address._id}
                              onChange={() => {
                                setSelectedAddress(address._id);
                                handleSetDefault(address._id);
                              }}
                              className="w-5 h-5 text-green-600 focus:ring-green-500"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3 flex-wrap">
                              <h3 className="text-lg font-bold text-gray-900">
                                {address.name}
                              </h3>
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                address.addressType === 'Home' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {address.addressType === 'Home' ? <FiHome className="w-3 h-3" /> : <FiBriefcase className="w-3 h-3" />}
                                {address.addressType}
                              </span>
                              {address.isDefault && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white shadow-sm">
                                  <FiCheck className="w-3 h-3" />
                                  DEFAULT
                                </span>
                              )}
                            </div>
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2 text-gray-700">
                                <FiPhone className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium">{address.phone}</span>
                              </div>
                              <div className="flex items-start gap-2 text-gray-700">
                                <FiNavigation className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <span className="text-sm leading-relaxed">
                                  {address.address}, {address.locality}, {address.city}, {address.state} - {address.pincode}
                                </span>
                              </div>
                              {address.landmark && (
                                <div className="flex items-center gap-2 text-gray-600">
                                  <FiMapPin className="w-4 h-4 text-gray-400" />
                                  <span className="text-xs">Landmark: {address.landmark}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-3 pt-4 border-t border-gray-200">
                              <button
                                onClick={() => handleEdit(address)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-semibold transition-colors"
                              >
                                <FiEdit3 className="w-4 h-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(address._id)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-semibold transition-colors"
                              >
                                <FiTrash2 className="w-4 h-4" />
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
                <div className={`border-2 rounded-xl p-6 transition-all duration-300 ${
                  showAddForm 
                    ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50' 
                    : 'border-gray-200 bg-white hover:border-green-300'
                }`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FiPlus className="w-5 h-5 text-green-600" />
                    </div>
                    <label className="text-xl font-bold text-gray-900 cursor-pointer" onClick={() => setShowAddForm(!showAddForm)}>
                      {showAddForm ? 'Adding New Address' : 'Add A New Address'}
                    </label>
                  </div>

                  {showAddForm && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <FiUser className="w-4 h-4 text-gray-400" />
                            Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-gray-50 focus:bg-white"
                            required
                          />
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <FiPhone className="w-4 h-4 text-gray-400" />
                            10-digit mobile number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            maxLength="10"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-gray-50 focus:bg-white"
                            required
                          />
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <FiMapPin className="w-4 h-4 text-gray-400" />
                            Pincode <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            maxLength="6"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-gray-50 focus:bg-white"
                            required
                          />
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <FiNavigation className="w-4 h-4 text-gray-400" />
                            Locality <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="locality"
                            value={formData.locality}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-gray-50 focus:bg-white"
                            required
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <FiMapPin className="w-4 h-4 text-gray-400" />
                            Address (Area and Street) <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none resize-none transition-all bg-gray-50 focus:bg-white"
                            required
                          />
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <FiNavigation className="w-4 h-4 text-gray-400" />
                            City/District/Town <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-gray-50 focus:bg-white"
                            required
                          />
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <FiMapPin className="w-4 h-4 text-gray-400" />
                            State <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-gray-50 focus:bg-white"
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
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <FiMapPin className="w-4 h-4 text-gray-400" />
                            Landmark (Optional)
                          </label>
                          <input
                            type="text"
                            name="landmark"
                            value={formData.landmark}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-gray-50 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <FiPhone className="w-4 h-4 text-gray-400" />
                            Alternate Phone (Optional)
                          </label>
                          <input
                            type="tel"
                            name="alternatePhone"
                            value={formData.alternatePhone}
                            onChange={handleChange}
                            maxLength="10"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-gray-50 focus:bg-white"
                          />
                        </div>
                      </div>

                      {/* Address Type */}
                      <div className="pt-4 border-t border-gray-200">
                        <label className="block text-sm font-semibold text-gray-700 mb-4">
                          Address Type
                        </label>
                        <div className="flex flex-wrap gap-4">
                          <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-green-300 bg-gray-50 hover:bg-green-50 flex-1 min-w-[200px]">
                            <input
                              type="radio"
                              name="addressType"
                              value="Home"
                              checked={formData.addressType === "Home"}
                              onChange={handleChange}
                              className="w-5 h-5 text-green-600"
                            />
                            <div className="flex items-center gap-2">
                              <FiHome className="w-5 h-5 text-blue-600" />
                              <div>
                                <span className="text-sm font-semibold text-gray-900 block">Home</span>
                                <span className="text-xs text-gray-500">All day delivery</span>
                              </div>
                            </div>
                          </label>
                          <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-green-300 bg-gray-50 hover:bg-green-50 flex-1 min-w-[200px]">
                            <input
                              type="radio"
                              name="addressType"
                              value="Work"
                              checked={formData.addressType === "Work"}
                              onChange={handleChange}
                              className="w-5 h-5 text-green-600"
                            />
                            <div className="flex items-center gap-2">
                              <FiBriefcase className="w-5 h-5 text-purple-600" />
                              <div>
                                <span className="text-sm font-semibold text-gray-900 block">Work</span>
                                <span className="text-xs text-gray-500">10 AM - 5 PM delivery</span>
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                        <button
                          type="submit"
                          disabled={loading}
                          className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Saving...
                            </>
                          ) : editingAddress ? (
                            <>
                              <FiEdit3 className="w-5 h-5" />
                              Update Address
                            </>
                          ) : (
                            <>
                              <FiCheck className="w-5 h-5" />
                              Save and Deliver Here
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={resetForm}
                          className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-gray-700 font-semibold border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {!showAddForm && (
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <FiPlus className="w-5 h-5" />
                      Add New Address
                    </button>
                  )}
                </div>

                {loading && addresses.length === 0 && (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading addresses...</p>
                  </div>
                )}

                {!loading && addresses.length === 0 && !showAddForm && (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <FiMapPin className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Delivery Addresses</h3>
                    <p className="text-gray-500 mb-6">Add your first delivery address to get started</p>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <FiPlus className="w-5 h-5" />
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


