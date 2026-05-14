import React, { useState, useEffect, useMemo, useCallback } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import {
  FiShoppingCart,
  FiTag,
  FiRefreshCw,
  FiStar,
  FiChevronRight,
  FiZap,
  FiMinus,
  FiPlus,
  FiShield,
} from "react-icons/fi";
import { getStock, addToCartWithStock, getCartLineQty } from "../utils/cartStock";

const apiBase = process.env.REACT_APP_API_BASE_URL;

function productPhotoUrl(productId) {
  return `${apiBase}/api/v1/product/product-photo/${productId}`;
}

/** Build ordered gallery URLs: main product photo first, then any extra string URLs on the product (future / optional). */
function buildGallerySources(product) {
  if (!product?._id) return [];
  const primary = productPhotoUrl(product._id);
  const raw = Array.isArray(product.images) ? product.images : [];
  const extras = raw
    .map((x) => (typeof x === "string" ? x : x?.url))
    .filter(Boolean);
  const merged = [primary, ...extras.filter((u) => u !== primary)];
  return [...new Set(merged)];
}

function TrustBadgeCard({ icon: Icon, title, description, accent }) {
  return (
    <div
      className={`flex gap-4 rounded-2xl border border-slate-200/90 bg-gradient-to-br ${accent} p-5 shadow-md shadow-slate-900/[0.04] ring-1 ring-slate-900/[0.02] sm:p-6`}
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200/80">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <div className="min-w-0 py-0.5">
        <h3 className="text-sm font-semibold text-slate-900 sm:text-base">{title}</h3>
        <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">{description}</p>
      </div>
    </div>
  );
}

function SimilarProductCard({ product: p, onSelect }) {
  const stock = getStock(p);
  const strike = p.price * 1.1;

  return (
    <button
      type="button"
      className="group flex h-full w-full min-w-0 flex-col rounded-2xl border border-slate-200/90 bg-white p-4 text-left shadow-md shadow-slate-900/[0.04] ring-1 ring-slate-900/[0.02] transition-all duration-300 hover:-translate-y-1 hover:border-sky-200/80 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 sm:p-5"
      onClick={() => onSelect(p)}
    >
      <div className="relative mb-4 flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-slate-50 to-white p-3 ring-1 ring-slate-100 sm:aspect-square sm:p-4">
        <img
          src={productPhotoUrl(p._id)}
          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.05]"
          alt={p.name}
          loading="lazy"
          decoding="async"
        />
      </div>
      <h3 className="line-clamp-2 min-h-[2.75rem] text-sm font-semibold leading-snug text-slate-900 sm:min-h-[3rem] sm:text-base">
        {p.name}
      </h3>
      <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-1.5 pt-3">
        <span className="text-xs text-slate-400 line-through tabular-nums sm:text-sm">
          {strike.toLocaleString("en-US", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}
        </span>
        <span className="text-lg font-bold tabular-nums text-slate-900 sm:text-xl">
          {p.price.toLocaleString("en-US", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}
        </span>
        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-100 sm:text-[11px]">
          10% Off
        </span>
      </div>
      <p
        className={`mt-3 text-xs font-medium sm:text-sm ${stock > 0 ? "text-emerald-700" : "text-rose-600"}`}
      >
        {stock > 0 ? `${stock} in stock` : "Out of stock"}
      </p>
    </button>
  );
}

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (params?.slug) getProduct();
    // eslint-disable-next-line
  }, [params?.slug]);

  const stock = getStock(product);

  const gallerySources = useMemo(() => buildGallerySources(product), [product]);

  useEffect(() => {
    setActiveImage(0);
  }, [product?._id]);

  useEffect(() => {
    setQty(1);
  }, [product?._id]);

  useEffect(() => {
    if (stock <= 0) return;
    setQty((q) => Math.min(Math.max(1, q), stock));
  }, [stock]);

  const getProduct = async () => {
    try {
      const { data } = await axios.get(`${apiBase}/api/v1/product/get-product/${params.slug}`);
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(`${apiBase}/api/v1/product/related-product/${pid}/${cid}`);
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

  const existingLine = cart.find((l) => String(l._id) === String(product._id));
  const existingQty = existingLine ? getCartLineQty(existingLine) : 0;

  const listPrice = product?.price != null ? product.price * 1.2 : 0;

  const mainImageSrc = gallerySources[activeImage] ?? gallerySources[0];

  const openSimilar = useCallback(
    (p) => {
      navigate(`/product/${p.slug}`);
      window.scrollTo(0, 0);
    },
    [navigate]
  );

  return (
    <Layout title={product?.name ? `${product.name} — Medicure` : "Product — Medicure"}>
      <div className="min-h-0 overflow-x-hidden bg-gradient-to-b from-slate-50 via-white to-emerald-50/20 font-sans text-slate-800">
        <div className="mx-auto w-full max-w-screen-2xl px-4 pb-12 pt-4 sm:px-5 sm:pb-14 sm:pt-6 md:px-6 lg:px-8 lg:pb-16 xl:px-10 2xl:px-12">
          {/* Breadcrumb */}
          <nav className="mb-7 flex flex-wrap items-center gap-1 text-sm text-slate-500 lg:mb-9" aria-label="Breadcrumb">
            <button
              type="button"
              className="rounded-md px-1 py-0.5 text-slate-600 transition hover:bg-slate-100 hover:text-sky-800"
              onClick={() => navigate("/")}
            >
              Home
            </button>
            <FiChevronRight className="h-4 w-4 shrink-0 text-slate-300" aria-hidden />
            {product?.category?.slug ? (
              <>
                <button
                  type="button"
                  className="max-w-[10rem] truncate rounded-md px-1 py-0.5 text-left text-slate-600 transition hover:bg-slate-100 hover:text-sky-800 sm:max-w-xs"
                  onClick={() => navigate(`/category/${product.category.slug}`)}
                >
                  {product.category.name}
                </button>
                <FiChevronRight className="h-4 w-4 shrink-0 text-slate-300" aria-hidden />
              </>
            ) : null}
            <span className="max-w-[min(100%,14rem)] truncate font-medium text-slate-900 sm:max-w-none">
              {product.name}
            </span>
          </nav>

          {/* Single unified product card: gallery + details */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-lg shadow-slate-900/[0.06] ring-1 ring-slate-900/[0.03]">
            <div className="grid grid-cols-1 items-stretch lg:grid-cols-12">
              {/* Image column */}
              <div className="flex min-h-0 flex-col border-b border-slate-100 p-6 sm:p-7 lg:col-span-5 lg:border-b-0 lg:border-r lg:border-slate-200/80 lg:p-8">
                <div className="flex flex-1 flex-col items-center justify-center lg:items-center lg:justify-center">
                  <div className="relative aspect-square w-full max-w-[min(100%,18.5rem)] overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-100 sm:max-w-[min(100%,21rem)] lg:max-w-[min(100%,24rem)]">
                    {mainImageSrc ? (
                      <img
                        src={mainImageSrc}
                        className="h-full w-full object-contain p-3 sm:p-4"
                        alt={product.name}
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center p-6 text-sm text-slate-400">
                        Loading image…
                      </span>
                    )}
                  </div>
                  {gallerySources.length > 1 ? (
                    <div className="mt-5 flex w-full max-w-[min(100%,24rem)] flex-wrap justify-center gap-2.5 lg:justify-start">
                      {gallerySources.map((src, i) => (
                        <button
                          key={src}
                          type="button"
                          onClick={() => setActiveImage(i)}
                          className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 bg-white p-1 transition sm:h-16 sm:w-16 ${
                            activeImage === i
                              ? "border-sky-600 ring-2 ring-sky-200"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                          aria-label={`View image ${i + 1}`}
                        >
                          <img src={src} alt="" className="h-full w-full object-contain" />
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Details column — aligned with image column height on desktop */}
              <div className="flex h-full min-h-0 flex-col p-6 sm:p-7 lg:col-span-7 lg:p-8">
                <div className="flex min-h-0 flex-1 flex-col space-y-6">
                  <header>
                    <h1 className="font-playfair text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl lg:text-[1.875rem] lg:leading-snug xl:text-[2rem]">
                      {product.name}
                    </h1>
                    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-600 sm:text-[15px]">
                      <div className="flex items-center gap-0.5 text-amber-500" aria-hidden>
                        {[...Array(4)].map((_, i) => (
                          <FiStar key={i} className="h-4 w-4 fill-current text-amber-500" />
                        ))}
                        <FiStar className="h-4 w-4 text-amber-200" />
                      </div>
                      <span className="font-semibold tabular-nums text-slate-800">4.4/5</span>
                      <span className="hidden text-slate-300 sm:inline" aria-hidden>
                        |
                      </span>
                      <span className="text-slate-500">8211 ratings & 1327 reviews</span>
                    </div>
                  </header>

                  <div className="border-b border-slate-100 pb-6">
                    <div className="flex flex-wrap items-end gap-3">
                      <div className="flex flex-wrap items-baseline gap-3">
                        <span className="text-xl text-slate-400 line-through tabular-nums sm:text-2xl">
                          {listPrice > 0
                            ? listPrice.toLocaleString("en-US", { style: "currency", currency: "INR" })
                            : ""}
                        </span>
                        <span className="text-3xl font-bold tabular-nums text-slate-900 sm:text-[2.125rem]">
                          {product?.price != null
                            ? product.price.toLocaleString("en-US", { style: "currency", currency: "INR" })
                            : ""}
                        </span>
                      </div>
                      {product?.price != null ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-emerald-800 ring-1 ring-emerald-100">
                          13% off
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-xs text-slate-500 sm:text-sm">Inclusive of all taxes</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                    <span
                      className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold ring-1 sm:text-sm ${
                        stock > 0
                          ? "bg-emerald-50 text-emerald-800 ring-emerald-100"
                          : "bg-rose-50 text-rose-700 ring-rose-100"
                      }`}
                    >
                      {stock > 0 ? `In stock · ${stock} available` : "Out of stock"}
                    </span>
                    {existingQty > 0 && stock > 0 ? (
                      <span className="text-xs text-slate-500">({existingQty} in your cart)</span>
                    ) : null}
                    {product?.category?.name ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-100 bg-sky-50/90 px-3 py-1 text-xs font-semibold text-sky-900">
                        <FiTag className="h-3.5 w-3.5 shrink-0" aria-hidden />
                        {product.category.name}
                      </span>
                    ) : null}
                  </div>

                  <div>
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Description</h2>
                    <p className="mt-2 max-w-prose text-sm leading-relaxed text-slate-600 sm:text-base sm:leading-7">
                      {product.description}
                    </p>
                  </div>

                  {stock > 0 ? (
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Quantity</p>
                      <div className="inline-flex items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50/80 shadow-inner ring-1 ring-slate-900/[0.03]">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          className="flex h-12 w-12 items-center justify-center text-slate-700 transition hover:bg-white hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-35 sm:h-[3.25rem] sm:w-[3.25rem]"
                          onClick={() => bumpQty(-1)}
                          disabled={qty <= 1}
                        >
                          <FiMinus className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" />
                        </button>
                        <span className="min-w-[3.5rem] select-none px-5 text-center text-lg font-bold tabular-nums text-slate-900 sm:min-w-[4rem] sm:px-6 sm:text-xl">
                          {qty}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          className="flex h-12 w-12 items-center justify-center text-slate-700 transition hover:bg-white hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-35 sm:h-[3.25rem] sm:w-[3.25rem]"
                          onClick={() => bumpQty(1)}
                          disabled={qty >= stock}
                        >
                          <FiPlus className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" />
                        </button>
                      </div>
                    </div>
                  ) : null}

                  <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                    {stock > 0 ? (
                      <>
                        <button
                          type="button"
                          className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-base font-semibold text-white shadow-md shadow-slate-900/20 transition hover:bg-slate-800 hover:shadow-lg active:scale-[0.99] sm:h-14 sm:flex-1 sm:text-[17px]"
                          onClick={handleAddToCart}
                        >
                          <FiShoppingCart className="h-5 w-5 transition group-hover:-translate-y-px sm:h-6 sm:w-6" />
                          Add to cart
                        </button>
                        <button
                          type="button"
                          className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 text-base font-semibold text-white shadow-md shadow-emerald-900/25 transition hover:from-emerald-500 hover:to-teal-500 hover:shadow-lg active:scale-[0.99] sm:h-14 sm:flex-1 sm:text-[17px]"
                          onClick={handleBuyNow}
                        >
                          <FiZap className="h-5 w-5 transition group-hover:-translate-y-px sm:h-6 sm:w-6" />
                          Buy now
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="flex h-12 w-full cursor-not-allowed items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-base font-semibold text-slate-500 sm:h-14"
                      >
                        Out of stock
                      </button>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 sm:gap-4">
                    <TrustBadgeCard
                      icon={FiShield}
                      title="100% Genuine Products"
                      description="The real deal, guaranteed."
                      accent="from-white to-emerald-50/40"
                    />
                    <TrustBadgeCard
                      icon={FiRefreshCw}
                      title="Easy Return Policy"
                      description="Returns within 5 days of delivery."
                      accent="from-white to-sky-50/50"
                    />
                  </div>

                  <p className="mt-auto pt-2 text-xs text-slate-400 sm:text-sm">
                    Sold by: <span className="font-medium text-slate-600">Medicure</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Similar products — full content width */}
          <section
            className="mt-14 border-t border-slate-200/90 pt-12 lg:mt-16 lg:pt-14 xl:mt-20 xl:pt-16"
            aria-labelledby="similar-heading"
          >
            <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between lg:mb-11">
              <div className="max-w-3xl">
                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-sky-700 sm:text-xs">
                  You may also like
                </span>
                <h2 id="similar-heading" className="font-playfair text-3xl font-bold text-slate-900 sm:text-4xl">
                  Similar products
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                  Carefully selected items from the same category.
                </p>
              </div>
            </div>

            {relatedProducts.length < 1 ? (
              <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center text-sm text-slate-500 sm:text-base">
                No similar products found.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:gap-6 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {relatedProducts.map((p) => (
                  <SimilarProductCard key={p._id} product={p} onSelect={openSimilar} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
