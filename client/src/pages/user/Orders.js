import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";
import toast from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/orders`);
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  // Cancel Order Function
  const handleCancel = async (orderId) => {
    try {
      const res = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/order-status/${orderId}`, {
        status: "Cancelled",
      });
      if (res.data.success) {
        toast.success(res.data.message);
        getOrders();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Helper for Status Color
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered": return "text-green-500";
      case "Shipped": return "text-blue-500";
      case "Cancelled": return "text-red-500";
      case "Order Placed": return "text-yellow-600";
      default: return "text-gray-500";
    }
  };

  return (
    <Layout title={"Your Orders"}>
      <div className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="col-span-1">
              <UserMenu />
            </div>

            {/* Main Content */}
            <div className="col-span-1 md:col-span-3">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

              <div className="space-y-6">
                {orders?.map((o, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-hover hover:shadow-md">
                    
                    {/* Top Section: Images & Action Button */}
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
                      <div className="flex -space-x-2 overflow-hidden mb-4 sm:mb-0">
                        {o?.products?.map((p) => (
                          <img
                            key={p._id}
                            src={`${process.env.REACT_APP_API_BASE_URL}/api/v1/product/product-photo/${p._id}`}
                            alt={p.name}
                            className="inline-block h-16 w-16 rounded-md object-cover border-2 border-white shadow-sm bg-gray-100"
                          />
                        ))}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2">
                         <button className="px-6 py-2 border border-gray-300 rounded-none uppercase text-xs font-bold tracking-wider hover:bg-black hover:text-white transition-colors">
                            View Order
                         </button>
                         {o?.status === "Order Placed" && (
                           <button 
                             onClick={() => handleCancel(o._id)}
                             className="text-xs text-red-500 hover:text-red-700 underline text-center"
                           >
                             Cancel Order
                           </button>
                         )}
                      </div>
                    </div>

                    {/* Divider */}
                    <hr className="border-gray-100 mb-6" />

                    {/* Bottom Section: Order Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-1">Order Number</p>
                        <p className="text-sm font-medium text-gray-900">#{o?._id?.substring(0, 8)}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-1">Date</p>
                        <p className="text-sm font-medium text-gray-900">{moment(o?.createAt).format("DD MMMM YYYY")}</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-1">Total</p>
                        <p className="text-sm font-medium text-gray-900">
                          {/* Assuming products have price, simplistic sum here or use o.payment.amount if available */}
                          {o?.products?.reduce((acc, item) => acc + item.price, 0).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-1">Status</p>
                        <p className={`text-sm font-medium ${getStatusColor(o?.status)}`}>
                          {o?.status}
                        </p>
                      </div>
                    </div>

                  </div>
                ))}

                {orders.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500">No orders found.</p>
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

export default Orders;