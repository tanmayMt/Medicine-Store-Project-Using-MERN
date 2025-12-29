import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox, Radio } from "antd";
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

      <div className="container-fluid home-page">
        <div className="row">
          {/* Filters Sidebar */}
          <div className="col-md-3">
            <div className="filters">
              <h4 className="text-center">Filter By Category</h4>
              <div className="d-flex flex-column mb-4">
                {categories?.map((c) => (
                  <Checkbox
                    key={c._id}
                    onChange={(e) => handleFilter(e.target.checked, c._id)}
                  >
                    {c.name}
                  </Checkbox>
                ))}
              </div>

              <h4 className="text-center">Filter By Price</h4>
              <div className="d-flex flex-column">
                <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                  {Prices?.map((p) => (
                    <div key={p._id}>
                      <Radio value={p.array}>{p.name}</Radio>
                    </div>
                  ))}
                </Radio.Group>
              </div>

              <div className="d-flex flex-column mt-4">
                <button
                  className="btn btn-danger w-100"
                  style={{ borderRadius: "20px" }}
                  onClick={() => window.location.reload()}
                >
                  RESET FILTERS
                </button>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="col-md-9">
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