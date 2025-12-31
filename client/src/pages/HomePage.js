import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "./../components/Layout/Layout";
import { AiOutlineReload } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/category/get-category`
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  // Get products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // Get Total Count
  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/product/product-count`
      );
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  // Load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Filter by category
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  // Get filtered product
  const filterProduct = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/product/product-filters`,
        {
          checked,
          radio,
        }
      );
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title={"All Products - Best Offers"}>
      {/* Banner Section */}
      <div className="w-full">
        <img
          src="/images/banner.png"
          className="w-full h-64 object-cover"
          alt="bannerimage"
        />
      </div>

      {/* Main Container - Dark Background */}
      <div className="w-full min-h-screen bg-[#111827] pt-6 pb-12">
        <div className="w-full px-2">
          <div className="flex flex-col md:flex-row gap-4">
            
            {/* Filters Sidebar */}
            <div className="w-full md:w-2/12 bg-[#1f2937] p-4 rounded-3xl shadow-lg h-fit border border-gray-700">
              <h4 className="text-md font-bold mb-3 border-b border-gray-600 pb-2 text-gray-200">Category</h4>
              <div className="flex flex-col space-y-2 mb-6">
                {categories?.map((c) => (
                  <label key={c._id} className="flex items-center space-x-2 cursor-pointer hover:text-blue-400 transition-colors">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-600 bg-gray-700 focus:ring-blue-500"
                      onChange={(e) => handleFilter(e.target.checked, c._id)}
                    />
                    <span className="text-gray-300 text-sm">{c.name}</span>
                  </label>
                ))}
              </div>

              <h4 className="text-md font-bold mb-3 border-b border-gray-600 pb-2 text-gray-200">Price</h4>
              <div className="flex flex-col space-y-2">
                {Prices?.map((p) => (
                  <label key={p._id} className="flex items-center space-x-2 cursor-pointer hover:text-blue-400 transition-colors">
                    <input
                      type="radio"
                      name="price"
                      className="form-radio h-4 w-4 text-blue-600 border-gray-600 bg-gray-700 focus:ring-blue-500"
                      value={JSON.stringify(p.array)}
                      onChange={(e) => setRadio(JSON.parse(e.target.value))}
                    />
                    <span className="text-gray-300 text-sm">{p.name}</span>
                  </label>
                ))}
              </div>

              <button
                className="mt-6 w-full bg-red-600 text-white py-1.5 px-4 rounded-xl hover:bg-red-700 transition-all duration-300 text-xs font-semibold uppercase tracking-wide shadow-md"
                onClick={() => window.location.reload()}
              >
                Reset Filters
              </button>
            </div>

            {/* Products Grid */}
            <div className="w-full md:w-10/12">
              <h1 className="text-2xl font-bold text-center mb-6 text-gray-100 tracking-tight">All Products - Best Offers</h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products?.map((p) => (
                  <div 
                    className="bg-[#1e293b] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer border border-gray-700/50 flex flex-col"
                    key={p._id}
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    {/* Image Section - Balanced Height (h-48) */}
                    <div className="relative h-48 w-full bg-gray-900 p-2">
                      <img
                        src={`${process.env.REACT_APP_API_BASE_URL}/api/v1/product/product-photo/${p._id}`}
                        alt={p.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Content Section */}
                    <div className="p-4 flex flex-col flex-grow">
                      {/* Metadata Row */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-red-500 p-1 rounded-full">
                           <FiShoppingCart className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Medicure • Ready to Ship</span>
                      </div>

                      {/* Title */}
                      <h5 className="text-white font-bold text-sm leading-snug mb-1 line-clamp-2">
                        {p.name}
                      </h5>
                      
                      {/* Description */}
                      <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-4">
                        {p.description.substring(0, 50)}...
                      </p>

                      {/* Stacked Layout: Price then Button */}
                      <div className="mt-auto">
                        
                        {/* Price Block - Prominent Green */}
                        <div className="mb-3">
                           <span className="text-2xl font-bold text-green-500 tracking-tight">
                              ₹ {p.price.toLocaleString("en-US")}
                           </span>
                        </div>

                        {/* Button Block - Full Width Blue */}
                        <button
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-3 rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg uppercase tracking-wide"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCart([...cart, p]);
                            localStorage.setItem(
                              "cart",
                              JSON.stringify([...cart, p])
                            );
                            toast.success("Item Added to cart");
                          }}
                        >
                          ADD TO CART
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 mb-10 text-center">
                {products && products.length < total && (
                  <button
                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 flex items-center gap-2 mx-auto text-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(page + 1);
                    }}
                  >
                    {loading ? (
                      "Loading..."
                    ) : (
                      <>
                        Load More <AiOutlineReload className="animate-spin-slow" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;