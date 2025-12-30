import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import toast from "react-hot-toast";
const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //total price 
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        total = total + item.price;
      });
      return total.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      });
    } catch (error) {
      console.log(error);
    }
  };
  //detele item
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      toast.success("Item is Removed from Card");
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  //get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/product/braintree/token`);
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getToken();
  }, [auth?.token]);

  //handle payments
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/product/braintree/payment`, {
        nonce,
        cart,
      });
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully ");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <Layout>
      <div className="container mx-auto px-4">
        <div className="mb-4">
          <div className="w-full">
            <h1 className="text-center bg-gray-100 p-2 mb-1 rounded">
              {`Hello ${auth?.token && auth?.user?.name}`}
            </h1>
            <h4 className="text-center">
              {cart?.length
                ? `You Have ${cart.length} items in your cart ${
                    auth?.token ? "" : "please login to checkout"
                  }`
                : " Your Cart Is Empty"}
            </h4>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/3">
            {cart?.map((p) => (
              <div key={p._id} className="flex flex-row mb-2 p-3 bg-white border border-gray-200 rounded shadow-sm">
                <div className="w-1/3 md:w-1/4">
                  <img
                    src={`${process.env.REACT_APP_API_BASE_URL}/api/v1/product/product-photo/${p._id}`}
                    className="w-full h-48 object-cover rounded"
                    alt={p.name}
                  />
                </div>
                <div className="w-2/3 md:w-3/4 pl-4">
                  <p className="font-bold text-lg mb-2">{p.name}</p>
                  <p className="text-blue-600 mb-2">{p.description.substring(0, 30)}</p>
                  <p className="text-green-600 font-bold mb-2">Price : 
                      {p.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "INR",
                      })}
                  </p>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300"
                    onClick={() => removeCartItem(p._id)}
                  >
                    ❌ <b>Remove</b>
                  </button>                  
                </div>
              </div>
            ))}
          </div>
          <div className="w-full md:w-1/3 text-center">
            <h2 className="text-2xl font-bold mb-4">Cart Summary</h2>
            <p className="mb-2">Total | Checkout | Payment</p>
            <hr className="mb-4" />
            <h4 className="text-xl font-semibold mb-4">Total : {totalPrice()} </h4>
            {auth?.user?.address ? (
              <>
                <div className="mb-3">
                  <h4 className="font-semibold mb-2">Current Address</h4>
                  <h5 className="mb-3">{auth?.user?.address}</h5>
                  <button
                    className="px-4 py-2 border border-yellow-500 text-yellow-600 hover:bg-yellow-50 font-medium rounded transition-colors"
                    onClick={() => navigate("/dashboard/user/address-update")}
                  >
                    Update Address
                  </button>
                </div>
              </>
            ) : (
              <div className="mb-3">
                {auth?.token ? (
                  <button
                    className="px-4 py-2 border border-yellow-500 text-yellow-600 hover:bg-yellow-50 font-medium rounded transition-colors"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                ) : (
                  <button
                    className="px-4 py-2 border border-yellow-500 text-yellow-600 hover:bg-yellow-50 font-medium rounded transition-colors"
                    onClick={() =>
                      navigate("/login", {
                        state: "/cart",
                      })
                    }
                  >
                    Please Login to checkout
                  </button>
                )}
              </div>
            )}
            {/* After Implement Payment */}
            <div className="mt-2">
              {!clientToken || !cart?.length ? (
                ""
              ) : (
                <>
                  <DropIn
                    options={{
                      authorization: clientToken,
                      paypal: {
                        flow: "vault",
                      },
                    }}
                    onInstance={(instance) => setInstance(instance)}
                  />

                  <button
                    className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    onClick={handlePayment}
                    disabled={loading || !instance || !auth?.user?.address}
                  >
                    {loading ? "Processing ...." : "Make Payment"}
                  </button>
                </>
              )}
            </div>            
          </div>
        </div>
      </div>
      
    </Layout>
  );
};

export default CartPage;
