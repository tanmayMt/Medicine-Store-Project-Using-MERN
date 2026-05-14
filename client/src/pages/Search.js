import React from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/search";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import { getStock, addToCartWithStock } from "../utils/cartStock";

const Search = () => {
  const [values] = useSearch();
  const navigate = useNavigate();
  const [cart, setCart] = useCart();

  const handleAdd = (p, e) => {
    e.stopPropagation();
    const { cart: next, ok, message } = addToCartWithStock(cart, p, 1);
    if (!ok) {
      toast.error(message || "Could not add to cart");
      return;
    }
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
    toast.success("Item added to cart");
  };

  return (
    <Layout title={"Search results"}>
      <div className="container">
        <div className="text-center">
          <h1>Search Resuts</h1>
          <h6>
            {values?.results.length < 1
              ? "No Products Found"
              : `Found ${values?.results.length}`}
          </h6>
          <div className="d-flex flex-wrap mt-4">
            {values?.results.map((p) => (
              <div className="card m-2" style={{ width: "18rem" }} key={p._id}>
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL}/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">{p.description.substring(0, 30)}...</p>
                  <p className="card-text"> $ {p.price}</p>
                  <p className="card-text text-muted small">
                    {getStock(p) > 0 ? `${getStock(p)} in stock` : "Out of stock"}
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary ms-1"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    More Details
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary ms-1"
                    disabled={getStock(p) <= 0}
                    onClick={(e) => handleAdd(p, e)}
                  >
                    {getStock(p) <= 0 ? "OUT OF STOCK" : "ADD TO CART"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
