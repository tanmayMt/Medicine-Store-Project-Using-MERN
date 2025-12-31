import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import { NavLink } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [auth] = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/delivery-addresses`
        );
        if (data.success) {
          setAddresses(data.addresses || []);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  const defaultAddress = addresses.find((addr) => addr.isDefault);
  
  return (
    <Layout title={"Dashboard - Ecommerce App"}>
      <div className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <UserMenu />
            </div>
            
            <div className="col-span-1 md:col-span-3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h1 className="text-3xl font-light text-gray-900 mb-2">Hello, <span className="font-bold">{auth?.user?.name}</span></h1>
                <p className="text-gray-500 mb-8">View your recent orders, manage your shipping and billing addresses, and update your account details</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 border border-gray-200 rounded-lg hover:border-black transition-colors">
                        <h3 className="text-lg font-bold mb-2">Account Info</h3>
                        <p className="text-gray-600 text-sm mb-1">{auth?.user?.email}</p>
                        <p className="text-gray-600 text-sm">{auth?.user?.phone}</p>
                        <NavLink to="/dashboard/user/profile" className="text-sm font-bold underline mt-4 inline-block hover:text-blue-600">Edit Account</NavLink>
                    </div>
                    
                    <div className="p-6 border border-gray-200 rounded-lg hover:border-black transition-colors">
                        <h3 className="text-lg font-bold mb-2">Delivery Addresses</h3>
                        {loading ? (
                          <p className="text-gray-600 text-sm">Loading...</p>
                        ) : addresses.length > 0 ? (
                          <div className="space-y-2">
                            <p className="text-gray-600 text-sm font-semibold">
                              {addresses.length} {addresses.length === 1 ? 'Address' : 'Addresses'} Saved
                            </p>
                            {defaultAddress && (
                              <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200">
                                <p className="text-gray-700 text-xs font-medium mb-1">
                                  {defaultAddress.name} ({defaultAddress.addressType})
                                </p>
                                <p className="text-gray-600 text-xs">
                                  {defaultAddress.address}, {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.pincode}
                                </p>
                                <span className="inline-block mt-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Default</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-600 text-sm mb-1">No delivery addresses set</p>
                        )}
                        <NavLink to="/dashboard/user/delivery-address" className="text-sm font-bold underline mt-4 inline-block hover:text-blue-600">
                          {addresses.length > 0 ? 'Manage Addresses' : 'Add Address'}
                        </NavLink>
                    </div>
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