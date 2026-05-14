import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import {
  FiShoppingCart,
  FiTag,
  FiCheckCircle,
  FiRefreshCw,
  FiStar,
  FiChevronRight,
  FiZap,
  FiMinus,
  FiPlus,
} from "react-icons/fi";
import {
  getStock,
  addToCartWithStock,
  getCartLineQty,
} from "../utils/cartStock";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (params?.slug) getProduct();
    // eslint-disable-next-line
  }, [params?.slug]);

  const stock = getStock(product);

  useEffect(() => {
    setQty(1);
  }, [product?._id]);

  useEffect(() => {
    if (stock <= 0) return;
    setQty((q) => Math.min(Math.max(1, q), stock));
  }, [stock]);

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

  const bumpQty = (delta) => {
    if (stock <= 0) return;
    setQty((q) => {
      const next = q + delta;
      return Math.min(Math.max(1, next), stock);
    });
  };

  const handleAddToCart = () => {
    if (stock <= 0) {
      toast.error("This item is out of stock");
      return;
    }
    const { cart: next, ok, message } = addToCartWithStock(cart, product, qty);
    if (!ok) {
      toast.error(message || "Could not add to cart");
      return;
    }
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
    toast.success("Item added to cart");
  };

  const handleBuyNow = () => {
    if (stock <= 0) {
      toast.error("This item is out of stock");
      return;
    }
    const { cart: next, ok, message } = addToCartWithStock(cart, product, qty);
    if (!ok) {
      toast.error(message || "Could not add to cart");
      return;
    }
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
    navigate("/cart");
  };

  const existingInCart = cart.find((l) => String(l._id) === String(product._id));
  const existingQty = existingInCart ? getCartLineQty(existingInCart) : 0;

  return (
    <Layout>
      <div className="bg-white min-h-screen font-sans text-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center text-sm text-gray-500">
            <span className="hover:text-pink-600 cursor-pointer" onClick={() => navigate("/")}>
              Home
            </span>
            <FiChevronRight className="mx-2" />
            <span
              className="hover:text-pink-600 cursor-pointer"
              onClick={() => navigate(`/category/${product?.category?.slug}`)}
            >
              {product?.category?.name}
            </span>
            <FiChevronRight className="mx-2" />
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="flex justify-center items-start">
              <div className="border border-gray-200 rounded-sm p-4 w-full max-w-[500px] hover:shadow-lg transition-shadow duration-300">
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL}/api/v1/product/product-photo/${product._id}`}
                  className="w-full h-auto object-contain max-h-[500px]"
                  alt={product.name}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold text-gray-900 leading-snug mb-2">{product.name}</h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-gray-900">
                  {[...Array(4)].map((_, i) => (
                    <FiStar key={i} className="fill-gray-900 w-4 h-4" />
                  ))}
                  <FiStar className="w-4 h-4" />
                </div>
                <span className="text-sm text-gray-500">4.4/5</span>
                <span className="text-sm text-gray-400">|</span>
                <span className="text-sm text-gray-500">8211 ratings & 1327 reviews</span>
              </div>

              <div className="mb-1">
                <span className="text-gray-400 line-through text-lg mr-2">
                  {(product?.price * 1.2)?.toLocaleString("en-US", { style: "currency", currency: "INR" })}
                </span>
                <span className="text-2xl font-bold text-gray-900 mr-2">
                  {product?.price?.toLocaleString("en-US", { style: "currency", currency: "INR" })}
                </span>
                <span className="text-green-600 font-bold text-lg">13% Off</span>
              </div>
              <p className="text-gray-400 text-xs mb-4">inclusive of all taxes</p>

              <p className={`text-sm font-semibold mb-6 ${stock > 0 ? "text-green-700" : "text-red-600"}`}>
                {stock > 0 ? (
                  <>
                    In stock: <span className="text-gray-900">{stock}</span> available
                    {existingQty > 0 && (
                      <span className="text-gray-600 font-normal ml-2">({existingQty} in your cart)</span>
                    )}
                  </>
                ) : (
                  "Out of stock"
                )}
              </p>

              <div className="mb-8">
                <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
              </div>

              <div className="mb-8">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 text-xs uppercase font-bold tracking-wider rounded-sm border border-gray-200">
                  <FiTag /> {product?.category?.name}
                </span>
              </div>

              {stock > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-2">Quantity</p>
                  <div className="inline-flex items-center border border-gray-300 rounded-md overflow-hidden">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      className="px-3 py-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-40"
                      onClick={() => bumpQty(-1)}
                      disabled={qty <= 1}
                    >
                      <FiMinus className="w-4 h-4" />
                    </button>
                    <span className="px-6 py-2 min-w-[3rem] text-center font-semibold tabular-nums">{qty}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      className="px-3 py-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-40"
                      onClick={() => bumpQty(1)}
                      disabled={qty >= stock}
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                {stock > 0 ? (
                  <>
                    <button
                      type="button"
                      className="flex-1 bg-[#E80071] hover:bg-[#c2005f] text-white text-lg font-bold py-3.5 px-6 rounded-sm shadow-md transition-transform transform active:scale-95 flex items-center justify-center gap-2"
                      onClick={handleAddToCart}
                    >
                      <FiShoppingCart className="w-5 h-5" /> Add to Cart
                    </button>
                    <button
                      type="button"
                      className="flex-1 bg-[#ff6f00] hover:bg-[#e65100] text-white text-lg font-bold py-3.5 px-6 rounded-sm shadow-md transition-transform transform active:scale-95 flex items-center justify-center gap-2"
                      onClick={handleBuyNow}
                    >
                      <FiZap className="w-5 h-5" /> Buy Now
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="flex-1 bg-gray-300 text-gray-600 text-lg font-bold py-3.5 px-6 rounded-sm cursor-not-allowed"
                  >
                    Out of Stock
                  </button>
                )}
              </div>

              <div className="bg-gray-50 border-t border-gray-100 p-4 flex gap-8">
                <div className="flex gap-3">
                  <div className="mt-1">
                    <FiCheckCircle className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-gray-700">100% Genuine Products</h5>
                    <p className="text-xs text-gray-500 mt-1">The real deal, guaranteed.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="mt-1">
                    <FiRefreshCw className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-gray-700">Easy Return Policy</h5>
                    <p className="text-xs text-gray-500 mt-1">Returns within 5 days of delivery.</p>
                  </div>
                </div>
              </div>

              <div className="mt-2 text-xs text-gray-400">
                Sold by: <span className="text-gray-600 font-medium">Meadicure</span>
              </div>
            </div>
          </div>

          <div className="mt-20 border-t border-gray-200 pt-10">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Similar Products</h3>

            {relatedProducts.length < 1 ? (
              <p className="text-gray-500">No similar products found.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {relatedProducts?.map((p) => (
                  <div
                    className="group border border-gray-200 rounded-sm bg-white p-3 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    key={p._id}
                    onClick={() => {
                      navigate(`/product/${p.slug}`);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <div className="relative h-40 mb-3 flex items-center justify-center overflow-hidden">
                      <img
                        src={`${process.env.REACT_APP_API_BASE_URL}/api/v1/product/product-photo/${p._id}`}
                        className="h-full w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                        alt={p.name}
                      />
                    </div>

                    <h5 className="text-sm font-medium text-gray-800 line-clamp-2 h-10 mb-1 leading-tight">{p.name}</h5>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-400 line-through">
                        {(p.price * 1.1).toLocaleString("en-US", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0,
                        })}
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {p.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0,
                        })}
                      </span>
                      <span className="text-xs text-green-600 font-bold">10% Off</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {getStock(p) > 0 ? `${getStock(p)} in stock` : "Out of stock"}
                    </p>
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
