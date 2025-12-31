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
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const navigate = useNavigate();

  // Total price calculation
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

  // Delete item
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      toast.success("Item is Removed from Cart");
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  // Get payment gateway token
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
    fetchAddresses();
  }, [auth?.token]);

  // Fetch delivery addresses
  const fetchAddresses = async () => {
    if (!auth?.token) return;
    try {
      setLoadingAddresses(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/delivery-addresses`
      );
      if (data.success) {
        setAddresses(data.addresses || []);
        // Set default address if available
        const defaultAddr = data.addresses.find((addr) => addr.isDefault);
        if (defaultAddr) {
          setSelectedAddress(defaultAddr._id);
        } else if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]._id);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  // Payment Handlers (Online & COD)
  const handlePayment = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const selectedAddr = addresses.find((addr) => addr._id === selectedAddress);
      const { data } = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/product/braintree/payment`, {
        nonce,
        cart,
        shippingAddress: selectedAddr,
      });
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully");
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Payment Failed");
    }
  };

  const handleCOD = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }
    try {
      setLoading(true);
      const selectedAddr = addresses.find((addr) => addr._id === selectedAddress);
      const { data } = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/product/cod-order`, {
        cart,
        shippingAddress: selectedAddr,
      });
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Order Placed Successfully (Cash on Delivery)");
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Error Placing Order");
    }
  };

  return (
    <Layout title={"Cart - Medicure"}>
      <div className="bg-gray-100 min-h-screen py-4">
        <div className="container mx-auto px-4">
          
          <div className="flex flex-col md:flex-row gap-4">
            
            {/* LEFT COLUMN: Cart Items & Address */}
            <div className="w-full md:w-2/3 flex flex-col gap-4">
              
              {/* 1. Address Section (Redesigned) */}
              <div className="bg-white shadow-sm rounded-sm overflow-hidden">
                <div className="bg-blue-600 px-4 py-3">
                   <h3 className="text-white font-medium text-base">
                     {addresses.length} DELIVERY ADDRESS{addresses.length !== 1 ? 'ES' : ''}
                   </h3>
                </div>
                
                <div className="p-4">
                  {loadingAddresses ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">Loading addresses...</p>
                    </div>
                  ) : addresses.length > 0 ? (
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div key={address._id} className="flex items-start gap-4 border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors">
                          {/* Radio Button */}
                          <div className="mt-1">
                            <input 
                              type="radio" 
                              name="deliveryAddress"
                              checked={selectedAddress === address._id}
                              onChange={() => setSelectedAddress(address._id)}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500" 
                            />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <span className="font-semibold text-sm">{address.name}</span>
                              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase">
                                {address.addressType}
                              </span>
                              {address.isDefault && (
                                <span className="bg-green-100 text-green-800 text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase">
                                  DEFAULT
                                </span>
                              )}
                              <span className="font-semibold text-sm">{address.phone}</span>
                              <button 
                                className="ml-auto text-blue-600 font-semibold text-sm uppercase hover:text-blue-700"
                                onClick={() => navigate("/dashboard/user/delivery-address")}
                              >
                                Edit
                              </button>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                              {address.address}, {address.locality}, {address.city}, {address.state} - {address.pincode}
                            </p>
                            {address.landmark && (
                              <p className="text-xs text-gray-500 mb-2">
                                Landmark: {address.landmark}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      <button 
                        className="text-blue-600 font-semibold text-sm uppercase border border-blue-600 px-4 py-2 hover:bg-blue-50 w-full"
                        onClick={() => navigate("/dashboard/user/delivery-address")}
                      >
                        + Add New Address
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <p className="text-sm text-gray-500">No delivery address found.</p>
                      {auth?.token ? (
                        <button
                          className="text-blue-600 font-semibold text-sm uppercase border border-gray-200 px-4 py-2 hover:bg-blue-50 w-full"
                          onClick={() => navigate("/dashboard/user/delivery-address")}
                        >
                          Add Address
                        </button>
                      ) : (
                        <button
                          className="text-blue-600 font-semibold text-sm uppercase border border-gray-200 px-4 py-2 hover:bg-blue-50 w-full"
                          onClick={() => navigate("/login", { state: "/cart" })}
                        >
                          Login to Add Address
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Cart Items */}
              <div className="bg-white shadow-sm rounded-sm p-4">
                 <h3 className="font-semibold text-gray-700 mb-4 uppercase text-sm">Order Items ({cart?.length})</h3>
                 {cart?.map((p) => (
                  <div key={p._id} className="flex flex-row mb-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={`${process.env.REACT_APP_API_BASE_URL}/api/v1/product/product-photo/${p._id}`}
                        className="w-full h-full object-contain"
                        alt={p.name}
                      />
                    </div>
                    <div className="flex-1 pl-4">
                      <p className="font-medium text-sm text-gray-800 mb-1 hover:text-blue-600 cursor-pointer">{p.name}</p>
                      <p className="text-xs text-gray-500 mb-2">{p.description.substring(0, 50)}...</p>
                      <div className="flex items-center gap-2 mb-3">
                         <span className="text-sm font-semibold text-gray-900">
                            {p.price.toLocaleString("en-US", { style: "currency", currency: "INR" })}
                         </span>
                         {/* Fake Discount for visuals */}
                         <span className="text-xs text-green-600 font-bold">10% Off</span> 
                      </div>
                      
                      <button
                        className="font-semibold text-sm text-gray-800 hover:text-blue-600 uppercase"
                        onClick={() => removeCartItem(p._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
            
            {/* RIGHT COLUMN: Price Details & Payment */}
            <div className="w-full md:w-1/3">
              <div className="bg-white shadow-sm rounded-sm p-4 sticky top-20">
                <h3 className="text-gray-500 font-bold text-sm uppercase border-b border-gray-200 pb-3 mb-3">
                  Price Details
                </h3>
                
                <div className="flex justify-between mb-3 text-sm">
                  <span className="text-gray-700">Price ({cart?.length} items)</span>
                  <span className="text-gray-900">{totalPrice()}</span>
                </div>
                <div className="flex justify-between mb-3 text-sm">
                  <span className="text-gray-700">Delivery Charges</span>
                  <span className="text-green-600">FREE</span>
                </div>
                
                <div className="flex justify-between py-4 border-t border-dashed border-gray-300 font-bold text-lg mb-4">
                  <span>Total Amount</span>
                  <span>{totalPrice()}</span>
                </div>

                {/* Payment Options (Only show if logged in & address exists) */}
                {auth?.token && cart?.length > 0 && selectedAddress && (
                  <div className="mt-2">
                    <h4 className="font-bold text-xs text-gray-500 uppercase mb-3">Payment Options</h4>
                    
                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded mb-2 cursor-pointer hover:bg-gray-50">
                      <input 
                        type="radio" name="payment" value="online" 
                        checked={paymentMethod === "online"} 
                        onChange={(e) => setPaymentMethod(e.target.value)} 
                      />
                      <span className="text-sm font-medium">Online Payment</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded mb-4 cursor-pointer hover:bg-gray-50">
                      <input 
                        type="radio" name="payment" value="cod" 
                        checked={paymentMethod === "cod"} 
                        onChange={(e) => setPaymentMethod(e.target.value)} 
                      />
                      <span className="text-sm font-medium">Cash on Delivery</span>
                    </label>

                    {paymentMethod === "online" && clientToken ? (
                      <div className="mb-4">
                        <DropIn
                          options={{
                            authorization: clientToken,
                            paypal: { flow: "vault" },
                          }}
                          onInstance={(instance) => setInstance(instance)}
                        />
                        <button
                          className="w-full bg-[#fb641b] text-white py-3 text-sm font-bold uppercase rounded shadow-sm hover:shadow-md mt-2 disabled:opacity-50"
                          onClick={handlePayment}
                          disabled={loading || !instance}
                        >
                          {loading ? "Processing..." : `Pay ${totalPrice()}`}
                        </button>
                      </div>
                    ) : (
                       paymentMethod === "cod" && (
                        <button
                          className="w-full bg-[#fb641b] text-white py-3 text-sm font-bold uppercase rounded shadow-sm hover:shadow-md disabled:opacity-50"
                          onClick={handleCOD}
                          disabled={loading}
                        >
                          {loading ? "Processing..." : "Place Order"}
                        </button>
                       )
                    )}
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

export default CartPage;