import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import { FiShoppingCart, FiTag, FiInfo, FiPlus } from "react-icons/fi"; // Added new icons

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Initial details
  useEffect(() => {
    if (params?.slug) getProduct();
    // eslint-disable-next-line
  }, [params?.slug]);

  // Get Product
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  // Get Similar Product
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle Add to Cart
  const handleAddToCart = (item) => {
    setCart([...cart, item]);
    localStorage.setItem("cart", JSON.stringify([...cart, item]));
    toast.success("Item Added to cart");
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* --- Main Product Section --- */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-16 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2">
              
              {/* Product Image */}
              <div className="p-10 bg-gray-50 flex items-center justify-center border-r border-gray-100">
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL}/api/v1/product/product-photo/${product._id}`}
                  className="max-h-[450px] w-auto object-contain mix-blend-multiply hover:scale-105 transition-transform duration-500"
                  alt={product.name}
                />
              </div>

              {/* Product Info */}
              <div className="p-10 lg:p-14 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wide">
                    <FiTag className="w-3 h-3" /> {product?.category?.name}
                  </span>
                </div>

                <h1 className="text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                  {product.name}
                </h1>

                <p className="text-gray-600 text-lg leading-relaxed mb-10">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mb-10 pt-6 border-t border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1 uppercase tracking-wider">Price</p>
                    <h3 className="text-4xl font-bold text-gray-900">
                      {product?.price?.toLocaleString("en-US", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </h3>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    className="flex-1 bg-black text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 transform active:scale-[0.98]"
                    onClick={() => handleAddToCart(product)}
                  >
                    <FiShoppingCart className="w-5 h-5" /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* --- Similar Products Section --- */}
          <div>
            <div className="flex items-center justify-between mb-8">
               <h4 className="text-2xl font-bold text-gray-900">
                You Might Also Like
              </h4>
              <div className="h-1 flex-1 bg-gray-100 ml-6 rounded-full"></div>
            </div>
            
            {relatedProducts.length < 1 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 font-medium">No similar products found at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts?.map((p) => (
                  <div 
                    className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full relative" 
                    key={p._id}
                  >
                    {/* Image Area */}
                    <div className="h-56 p-6 bg-gray-50 flex items-center justify-center relative overflow-hidden">
                      <img
                        src={`${process.env.REACT_APP_API_BASE_URL}/api/v1/product/product-photo/${p._id}`}
                        className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply"
                        alt={p.name}
                      />
                      
                      {/* Floating Action Button (Quick Add) */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(p); }}
                        className="absolute bottom-4 right-4 bg-white text-black p-3 rounded-full shadow-md opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-black hover:text-white"
                        title="Quick Add"
                      >
                        <FiPlus className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {/* Content Area */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="mb-1">
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Product</span>
                      </div>
                      <h5 
                        className="font-bold text-lg text-gray-900 mb-2 leading-snug cursor-pointer hover:text-blue-600 transition-colors line-clamp-2"
                        onClick={() => { navigate(`/product/${p.slug}`); window.scrollTo(0, 0); }}
                      >
                        {p.name}
                      </h5>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
                        {p.description.substring(0, 60)}...
                      </p>
                      
                      <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-50">
                        <div>
                           <span className="block text-xs text-gray-400 font-medium">Price</span>
                           <span className="text-xl font-bold text-gray-900">
                            {p.price.toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                            })}
                          </span>
                        </div>
                        
                        <button
                          className="text-sm font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
                          onClick={() => {
                            navigate(`/product/${p.slug}`);
                            window.scrollTo(0, 0);
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;