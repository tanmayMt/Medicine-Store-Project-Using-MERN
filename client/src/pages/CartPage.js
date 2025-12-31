import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import toast from "react-hot-toast";
// FIXED: Added FiShoppingCart and FiPhone to the import list
import { FiMapPin, FiTruck, FiShield, FiCreditCard, FiTrash2, FiPlus, FiShoppingCart, FiPhone } from "react-icons/fi";

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
    <Layout title={"Cart - Medicure Checkout"}>
      <div className="bg-gray-50 min-h-screen py-8 font-sans text-gray-800">
        <div className="container mx-auto px-4 max-w-6xl">
          
          <h1 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            <FiShoppingCart className="w-6 h-6 text-blue-600" /> 
            Checkout
          </h1>

          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* LEFT COLUMN: Cart Items & Address */}
            <div className="w-full lg:w-2/3 flex flex-col gap-6">
              
              {/* 1. Address Section */}
              <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-100">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                   <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
                     <div className="bg-blue-100 p-1.5 rounded-full text-blue-600"><FiMapPin size={18}/></div>
                     Delivery Address
                   </h3>
                   {auth?.token && (
                     <button 
                       className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1 transition-colors"
                       onClick={() => navigate("/dashboard/user/delivery-address")}
                     >
                       <FiPlus size={16} /> Add New
                     </button>
                   )}
                </div>
                
                <div className="p-6">
                  {loadingAddresses ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : !auth?.token ? (
                     <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">Please log in to manage your delivery addresses.</p>
                        <button
                          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm font-medium"
                          onClick={() => navigate("/login", { state: "/cart" })}
                        >
                          Log In Now
                        </button>
                     </div>
                  ) : addresses.length > 0 ? (
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <label 
                          key={address._id} 
                          className={`flex items-start gap-4 border rounded-lg p-4 cursor-pointer transition-all duration-200 ${selectedAddress === address._id ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                          <div className="mt-1">
                            <input 
                              type="radio" 
                              name="deliveryAddress"
                              checked={selectedAddress === address._id}
                              onChange={() => setSelectedAddress(address._id)}
                              className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300" 
                            />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1 flex-wrap">
                              <span className="font-bold text-gray-900">{address.name}</span>
                              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-medium uppercase tracking-wide">
                                {address.addressType}
                              </span>
                              {address.isDefault && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium uppercase tracking-wide">Default</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed mb-1">
                              {address.address}, {address.locality}, {address.city}, {address.state} - <span className="font-semibold text-gray-800">{address.pincode}</span>
                            </p>
                            <p className="text-sm text-gray-700 font-medium flex items-center gap-2">
                               <FiPhone size={14} className="text-gray-400"/> {address.phone}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                      <p className="text-gray-500 mb-3">No delivery address found.</p>
                      <button
                        className="text-blue-600 font-medium hover:text-blue-800 underline"
                        onClick={() => navigate("/dashboard/user/delivery-address")}
                      >
                        Add your first address
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Cart Items */}
              <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-100">
                 <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
                      <div className="bg-orange-100 p-1.5 rounded-full text-orange-600"><FiShoppingCart size={18}/></div>
                      Your Cart <span className="text-gray-500 font-normal text-base">({cart?.length} items)</span>
                    </h3>
                 </div>

                 <div className="divide-y divide-gray-100">
                   {cart?.length > 0 ? (
                     cart.map((p) => (
                      <div key={p._id} className="p-6 flex gap-6 hover:bg-gray-50/50 transition-colors">
                        <div className="w-24 h-24 flex-shrink-0 bg-white border border-gray-200 rounded-md p-2">
                          <img
                            src={`${process.env.REACT_APP_API_BASE_URL}/api/v1/product/product-photo/${p._id}`}
                            className="w-full h-full object-contain"
                            alt={p.name}
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-800 text-lg hover:text-blue-600 cursor-pointer transition-colors line-clamp-1">{p.name}</h4>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{p.description}</p>
                          </div>
                          
                          <div className="flex justify-between items-end mt-4">
                             <div className="flex items-baseline gap-2">
                                <span className="text-xl font-bold text-gray-900">
                                  {p.price.toLocaleString("en-US", { style: "currency", currency: "INR" })}
                                </span>
                                <span className="text-sm text-gray-400 line-through">₹{(p.price * 1.2).toFixed(2)}</span>
                                <span className="text-xs font-bold text-green-600">20% OFF</span>
                             </div>
                             
                             <button
                               className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 transition-colors group"
                               onClick={() => removeCartItem(p._id)}
                             >
                               <FiTrash2 className="group-hover:scale-110 transition-transform"/> Remove
                             </button>
                          </div>
                        </div>
                      </div>
                     ))
                   ) : (
                      <div className="p-12 text-center">
                         <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <FiShoppingCart size={32} />
                         </div>
                         <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                         <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
                         <button 
                           onClick={() => navigate("/")}
                           className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow"
                         >
                           Start Shopping
                         </button>
                      </div>
                   )}
                 </div>
              </div>

            </div>
            
            {/* RIGHT COLUMN: Price Details & Payment */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white shadow rounded-lg p-6 border border-gray-100 sticky top-24">
                <h3 className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-6 pb-2 border-b border-gray-100">
                  Order Summary
                </h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Price ({cart?.length} items)</span>
                    <span className="font-medium text-gray-900">{totalPrice()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Discount</span>
                    <span className="text-green-600 font-medium">- ₹0</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Charges</span>
                    <span className="text-green-600 font-medium flex items-center gap-1"><FiTruck size={14}/> FREE</span>
                  </div>
                </div>
                
                <div className="flex justify-between py-4 border-t border-dashed border-gray-200 mb-6">
                  <span className="text-lg font-bold text-gray-900">Total Amount</span>
                  <span className="text-xl font-bold text-gray-900">{totalPrice()}</span>
                </div>

                {/* Trust Badge */}
                <div className="bg-green-50 text-green-700 text-xs px-3 py-2 rounded mb-6 flex items-center gap-2 border border-green-100">
                   <FiShield size={14}/> Safe and Secure Payments. 100% Authentic products.
                </div>

                {/* Payment Options */}
                {auth?.token && cart?.length > 0 && selectedAddress ? (
                  <div>
                    <h4 className="font-bold text-sm text-gray-800 mb-3 flex items-center gap-2">
                       <FiCreditCard className="text-gray-500"/> Payment Method
                    </h4>
                    
                    <div className="space-y-3 mb-6">
                      <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${paymentMethod === "online" ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500" : "border-gray-200 hover:border-gray-300"}`}>
                        <input 
                          type="radio" name="payment" value="online" 
                          checked={paymentMethod === "online"} 
                          onChange={(e) => setPaymentMethod(e.target.value)} 
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="font-medium text-gray-700">Pay Online (Card/Wallet/UPI)</span>
                      </label>

                      <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${paymentMethod === "cod" ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500" : "border-gray-200 hover:border-gray-300"}`}>
                        <input 
                          type="radio" name="payment" value="cod" 
                          checked={paymentMethod === "cod"} 
                          onChange={(e) => setPaymentMethod(e.target.value)} 
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="font-medium text-gray-700">Cash on Delivery</span>
                      </label>
                    </div>

                    {paymentMethod === "online" && clientToken ? (
                      <div className="animate-fade-in">
                        <DropIn
                          options={{
                            authorization: clientToken,
                            paypal: { flow: "vault" },
                          }}
                          onInstance={(instance) => setInstance(instance)}
                        />
                        <button
                          className="w-full bg-orange-600 text-white py-3.5 text-base font-bold uppercase rounded-lg shadow hover:bg-orange-700 hover:shadow-lg transition-all transform active:scale-[0.98] mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                          onClick={handlePayment}
                          disabled={loading || !instance}
                        >
                          {loading ? (
                             <span className="flex items-center justify-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span> Processing...</span>
                          ) : `Pay ${totalPrice()}`}
                        </button>
                      </div>
                    ) : (
                       paymentMethod === "cod" && (
                        <button
                          className="w-full bg-orange-600 text-white py-3.5 text-base font-bold uppercase rounded-lg shadow hover:bg-orange-700 hover:shadow-lg transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                          onClick={handleCOD}
                          disabled={loading}
                        >
                          {loading ? (
                             <span className="flex items-center justify-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span> Placing Order...</span>
                          ) : "Place Order"}
                        </button>
                       )
                    )}
                  </div>
                ) : (
                   <div className="text-sm text-gray-500 italic text-center mt-4">
                      {!auth?.token ? "Login to proceed" : cart?.length === 0 ? "Add items to proceed" : "Select address to checkout"}
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