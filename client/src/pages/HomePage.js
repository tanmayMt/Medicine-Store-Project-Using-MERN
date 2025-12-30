import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "./../components/Layout/Layout";
import { AiOutlineReload } from "react-icons/ai";

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
      <div className="w-100">
        <img
          src="/images/banner.png"
          className="banner-img"
          alt="bannerimage"
          style={{ width: "100%", height: "250px", objectFit: "cover" }}
        />
      </div>

      {/* CHANGED: px-6 to px-2 to move content to the edges */}
      <div className="w-full px-2 home-page mt-4">
        {/* CHANGED: gap-6 to gap-4 to pull columns closer */}
        <div className="flex flex-col md:flex-row gap-4">
          
          {/* Filters Sidebar */}
          <div className="w-full md:w-2/12">
            <div className="filters">
              <h4 className="text-center mb-4">Filter By Category</h4>
              <div className="flex flex-col mb-4 space-y-2">
                {categories?.map((c) => (
                  <label key={c._id} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      onChange={(e) => handleFilter(e.target.checked, c._id)}
                    />
                    <span className="ml-2 text-gray-700">{c.name}</span>
                  </label>
                ))}
              </div>

              <h4 className="text-center mb-4">Filter By Price</h4>
              <div className="flex flex-col space-y-2">
                {Prices?.map((p) => (
                  <label key={p._id} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      value={JSON.stringify(p.array)}
                      onChange={(e) => setRadio(JSON.parse(e.target.value))}
                    />
                    <span className="ml-2 text-gray-700">{p.name}</span>
                  </label>
                ))}
              </div>

              <div className="flex flex-col mt-4">
                <button
                  className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-full transition-colors"
                  onClick={() => window.location.reload()}
                >
                  RESET FILTERS
                </button>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="w-full md:w-10/12">
            <h1 className="all-products-title text-center">All Products</h1>

            {/* PRODUCT GRID START */}
            <div className="product-grid">
              {products?.map((p) => (
                <div className="product-card" key={p._id}>
                  {/* 1. Image */}
                  <div className="product-img-container">
                    <img
                      src={`${process.env.REACT_APP_API_BASE_URL}/api/v1/product/product-photo/${p._id}`}
                      alt={p.name}
                    />
                  </div>

                  {/* 2. Details */}
                  <div className="product-info">
                    <h5 className="product-title">{p.name}</h5>
                    <p className="product-desc">
                      {p.description.substring(0, 30)}...
                    </p>
                    <h5 className="product-price">
                      {p.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </h5>
                  </div>

                  {/* 3. Buttons */}
                  <div className="product-actions">
                    <button
                      className="btn-custom btn-details"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      Details
                    </button>
                    <button
                      className="btn-custom btn-cart"
                      onClick={() => {
                        setCart([...cart, p]);
                        localStorage.setItem(
                          "cart",
                          JSON.stringify([...cart, p])
                        );
                        toast.success("Item Added to cart");
                      }}
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* PRODUCT GRID END */}

            {/* Load More Button */}
            <div className="loadmore-container">
              {products && products.length < total && (
                <button
                  className="btn-loadmore"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page + 1);
                  }}
                >
                  {loading ? (
                    "Loading ..."
                  ) : (
                    <>
                      Load More <AiOutlineReload />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;