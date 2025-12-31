import React, { useState } from "react";
import Layout from "./../components/Layout/Layout";
import { BiCurrentLocation } from "react-icons/bi"; // Requires: npm install react-icons

const AddressForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    pincode: "",
    locality: "",
    address: "",
    city: "",
    state: "",
    landmark: "",
    altPhone: "",
    type: "home",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted", formData);
    // Add your API call logic here
  };

  // Helper for input styling
  const inputStyle = "w-full border border-gray-300 rounded-[2px] px-3 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm text-gray-700 placeholder-gray-400";

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 py-8 font-sans">
        <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-[2px]">
          
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
              ADD A NEW ADDRESS
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            
            {/* Current Location Button */}
            <button
              type="button"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-[2px] text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors mb-6"
            >
              <BiCurrentLocation className="text-lg" />
              Use my current location
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Name */}
              <div className="group">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  className={inputStyle}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Mobile */}
              <div>
                <input
                  type="text"
                  name="mobile"
                  placeholder="10-digit mobile number"
                  className={inputStyle}
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Pincode */}
              <div>
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  className={inputStyle}
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Locality */}
              <div>
                <input
                  type="text"
                  name="locality"
                  placeholder="Locality"
                  className={inputStyle}
                  value={formData.locality}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Address Area */}
            <div className="mb-4">
              <textarea
                name="address"
                placeholder="Address (Area and Street)"
                className={`${inputStyle} h-24 resize-none`}
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* City */}
              <div>
                <input
                  type="text"
                  name="city"
                  placeholder="City/District/Town"
                  className={inputStyle}
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* State Dropdown */}
              <div>
                <select
                  name="state"
                  className={`${inputStyle} bg-white`}
                  value={formData.state}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>--Select State--</option>
                  <option value="WB">West Bengal</option>
                  <option value="MH">Maharashtra</option>
                  <option value="DL">Delhi</option>
                  {/* Add more states */}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Landmark */}
              <div>
                <input
                  type="text"
                  name="landmark"
                  placeholder="Landmark (Optional)"
                  className={inputStyle}
                  value={formData.landmark}
                  onChange={handleChange}
                />
              </div>
              {/* Alternate Phone */}
              <div>
                <input
                  type="text"
                  name="altPhone"
                  placeholder="Alternate Phone (Optional)"
                  className={inputStyle}
                  value={formData.altPhone}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Address Type */}
            <div className="mb-8">
              <label className="block text-xs text-gray-500 font-semibold mb-3 uppercase">Address Type</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="home"
                    checked={formData.type === "home"}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Home (All day delivery)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="work"
                    checked={formData.type === "work"}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Work (Delivery between 10 AM - 5 PM)</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="w-full md:w-auto bg-[#fb641b] text-white px-8 py-3.5 text-sm font-bold uppercase shadow-sm hover:shadow-md transition-shadow rounded-[2px]"
              >
                Save and Deliver Here
              </button>
              <button
                type="button"
                className="text-blue-600 font-semibold text-sm uppercase hover:text-blue-800 px-4"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddressForm;