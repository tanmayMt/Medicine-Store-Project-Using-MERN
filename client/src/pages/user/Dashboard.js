import React from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import { NavLink } from "react-router-dom";

const Dashboard = () => {
  const [auth] = useAuth();
  
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
                <p className="text-gray-500 mb-8">From your account dashboard. you can easily check & view your recent orders, manage your shipping and billing addresses and edit your password and account details.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 border border-gray-200 rounded-lg hover:border-black transition-colors">
                        <h3 className="text-lg font-bold mb-2">Account Info</h3>
                        <p className="text-gray-600 text-sm mb-1">{auth?.user?.email}</p>
                        <p className="text-gray-600 text-sm">{auth?.user?.phone}</p>
                        <NavLink to="/dashboard/user/profile" className="text-sm font-bold underline mt-4 inline-block hover:text-blue-600">Edit Account</NavLink>
                    </div>
                    
                     <div className="p-6 border border-gray-200 rounded-lg hover:border-black transition-colors">
                        <h3 className="text-lg font-bold mb-2">Shipping Address</h3>
                        <p className="text-gray-600 text-sm mb-1">{auth?.user?.address || "No address set"}</p>
                        <NavLink to="/dashboard/user/profile" className="text-sm font-bold underline mt-4 inline-block hover:text-blue-600">Edit Address</NavLink>
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