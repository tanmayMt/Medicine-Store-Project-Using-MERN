import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";

const AdminOrders = () => {
  const [status, setStatus] = useState([

    "Order Placed",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Returned"
  ]);
  const [changeStatus, setCHangeStatus] = useState("");
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();
  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/all-orders`);
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const handleChange = async (orderId, value) => {
    try {
      const { data } = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/order-status-admin/${orderId}`, {
        status: value,
      });
      getOrders();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout title={"All Orders Data"}>
      <div className="flex flex-col md:flex-row gap-6 dashboard">
        <div className="w-full md:w-1/4">
          <AdminMenu />
        </div>
        <div className="w-full md:w-3/4">
          <h1 className="text-center">All Orders</h1>
          {orders?.map((o, i) => {
            return (
              <div className="border shadow">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{o?._id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <select
                          className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onChange={(e) => handleChange(o._id, e.target.value)}
                          defaultValue={o?.status}
                        >
                          {status.map((s, i) => (
                            <option key={i} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{o?.buyer?.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{o?.payment.success ? "Success" : "Failed"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{o?.products?.length}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="container mx-auto">
                  {o?.products?.map((p, i) => (
                    <div className="flex flex-row mb-2 p-3 bg-white border border-gray-200 rounded shadow-sm" key={p._id}>
                      <div className="w-1/3 md:w-1/4">
                        <img
                          src={`${process.env.REACT_APP_API_BASE_URL}/api/v1/product/product-photo/${p._id}`}
                          className="w-full h-24 object-cover rounded"
                          alt={p.name}
                        />
                      </div>
                      <div className="w-2/3 md:w-3/4 pl-4">
                        <h2 className="font-bold">{p.name}</h2>
                        <p className="text-gray-600">{p.description.substring(0, 30)}</p>
                        <p>Price : <b>{p.price}</b></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;
