import React from "react";
import { Link } from "react-router-dom";
import {
  FiPackage,
  FiHeart,
  FiActivity,
  FiDroplet,
  FiThermometer,
  FiShield,
  FiLayers,
  FiArrowRight,
} from "react-icons/fi";
import useCategory from "../hooks/useCategory";
import Layout from "../components/Layout/Layout";

const CATEGORY_ICONS = [
  FiPackage,
  FiHeart,
  FiActivity,
  FiDroplet,
  FiThermometer,
  FiShield,
  FiLayers,
];

const ACCENT_STYLES = [
  "from-sky-500 to-blue-600 ring-sky-200/60",
  "from-teal-500 to-cyan-600 ring-teal-200/60",
  "from-indigo-500 to-violet-600 ring-indigo-200/60",
  "from-emerald-500 to-teal-600 ring-emerald-200/60",
  "from-blue-600 to-slate-700 ring-blue-200/50",
  "from-cyan-500 to-sky-600 ring-cyan-200/60",
  "from-slate-600 to-slate-800 ring-slate-300/50",
];

const Categories = () => {
  const categories = useCategory();
  const list = Array.isArray(categories) ? categories : [];

  return (
    <Layout title="Shop by category - Medicure">
      <div className="relative min-h-0 bg-gradient-to-b from-slate-50 via-white to-sky-50/40">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-sky-100/30 to-transparent"
          aria-hidden
        />

        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-10 sm:px-6 sm:pb-16 sm:pt-12 lg:px-8 lg:pb-20 lg:pt-14">
          <header className="mx-auto mb-10 max-w-2xl text-center lg:mb-12">
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-700/90">
              Browse our catalogue
            </p>
            <h1 className="mt-2 font-playfair text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Shop by Category
            </h1>
            <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">
              Find trusted medicines and wellness products organised the way you shop — pick a
              category to explore curated ranges and fast checkout.
            </p>
          </header>

          {list.length === 0 ? (
            <div className="mx-auto max-w-md rounded-2xl border border-slate-200/80 bg-white/90 px-6 py-12 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <FiLayers className="h-7 w-7" aria-hidden />
              </div>
              <p className="text-sm font-medium text-slate-800">No categories yet</p>
              <p className="mt-2 text-sm text-slate-500">Please check back soon.</p>
            </div>
          ) : (
            <ul className="grid list-none grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-5">
              {list.map((c, index) => {
                const Icon = CATEGORY_ICONS[index % CATEGORY_ICONS.length];
                const accent = ACCENT_STYLES[index % ACCENT_STYLES.length];
                return (
                  <li key={c._id}>
                    <Link
                      to={`/category/${c.slug}`}
                      className="group block h-full rounded-2xl border border-slate-200/90 bg-white/95 p-5 shadow-sm shadow-slate-900/[0.04] ring-1 ring-slate-900/[0.02] transition duration-300 hover:-translate-y-0.5 hover:border-sky-200/90 hover:bg-white hover:shadow-lg hover:shadow-sky-900/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                      aria-label={`Browse ${c.name} category`}
                    >
                      <div className="flex items-start gap-4">
                        <span
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-white shadow-md ring-2 ring-inset transition duration-300 group-hover:scale-105 group-hover:shadow-lg`}
                          aria-hidden
                        >
                          <Icon className="h-6 w-6" strokeWidth={2} />
                        </span>
                        <div className="min-w-0 flex-1 pt-0.5">
                          <h2 className="text-lg font-semibold leading-snug text-slate-900 transition group-hover:text-sky-900">
                            {c.name}
                          </h2>
                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500 sm:text-sm">
                            View products in {c.name}
                          </p>
                          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-sky-700 opacity-90 transition group-hover:gap-2 group-hover:opacity-100">
                            Shop now
                            <FiArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
