import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";
import toast from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();

  //
  const [status, setStatus] = useState([
    "Order Placed",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Returned",
  ]);
  const [changeStatus, setCHangeStatus] = useState("");

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

    //Cencel Order
  const handleChange = async (orderId) => {
    try {
      const res  = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/order-status/${orderId}`, {
        status: "Cancelled",
      });
      if(res.data.success)
        {
          toast.success(res.data.message);
          getOrders();
        }
        else{
          toast.error(res.data.message);
    
        }
    
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title={"Your Orders"}>
      <div className="container-flui p-3 m-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          
          <div className="col-md-9">
            <h1 className="text-center">All Orders</h1>
            {/* <p>{JSON.stringify(orders,null,4)}</p> */}
            {orders?.map((o, i) => {
              return (
                <div className="border shadow">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Order ID</th>
                        <th scope="col">Status</th>
                        <th scope="col">Buyer</th>
                        <th scope="col"> date</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{o?._id}</td>
                        <td>{o?.status}</td>
                        <td>{o?.buyer?.name}</td>
                        <td>{moment(o?.createAt).fromNow()}</td>
                        <td>{o?.payment.success ? "Success" : "Failed"}</td>
                        {/* <td>{o?.payment?._id}</td> */}
                        <td>{o?.products?.length}</td>
                      </tr>
                  <tr>
                    <td colspan="6">
                      <div className="container">
                        {o?.products?.map((p, i) => (
                        <div className="row mb-2 p-3 card flex-row" key={p._id}>
                          <div className="col-md-4">
                            <img
                             src={`${process.env.REACT_APP_API_BASE_URL}/api/v1/product/product-photo/${p._id}`}
                             className="card-img-top"
                             alt={p.name}
                             width="100px"
                             height={"100px"}
                            />
                          </div>
                        <div className="col-md-8">
                          <p>{p.name}</p>
                          <p>{p.description.substring(0, 30)}</p>
                          <p>Price : {p.price}</p>
                        </div>
                      </div>
                        ))}
                      </div>{o?.status==="Order Placed"? (<>
                  <button
                    className="btn btn-outline-warning"
                    // className="btn btn-danger"
                    onClick={() => handleChange(o._id)}
                    defaultValue={o?.status}
                    >
                      Cancel Order
                  </button></>): (<></>)}
                  <br></br>
                  </td>
                  </tr>
                  </tbody>
                  </table>
                </div>
              );
            })}
            <br></br>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;