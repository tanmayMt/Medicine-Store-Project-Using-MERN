import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
// Category product styles should be provided via Tailwind utilities or global components in `index.css`.
import axios from "axios";
const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    if (params?.slug) getPrductsByCat();
  }, [params?.slug]);
  const getPrductsByCat = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/product/product-category/${params.slug}`
      );
      setProducts(data?.products);
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto mt-3 px-4">
        <h4 className="text-center mb-2">Category - {category?.name}</h4>
        <h6 className="text-center mb-4">{products?.length} result found </h6>
        <div className="flex flex-col">
          <div className="flex flex-wrap justify-center gap-4">
            {products?.map((p) => (
              <div
                className="bg-white border border-gray-200 rounded-lg shadow-sm m-2 w-72"
                key={p._id}
              >
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL}/api/v1/product/product-photo/${p._id}`}
                  className="w-full h-48 object-cover rounded-t-lg"
                  alt={p.name}
                />
                <div className="p-4">
                  <h5 className="font-bold text-lg mb-2">{p.name}</h5>
                  <p className="text-gray-600 mb-2">
                    {p.description.substring(0, 30)}...
                  </p>
                  <p className="font-semibold text-blue-600 mb-3">{p.price}</p>
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded transition-colors"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      More Details
                    </button>
                    <button className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded transition-colors">
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryProduct;
