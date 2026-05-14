import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import SearchInput from "../Form/SearchInput";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/cart";
import { cartTotalUnits } from "../../utils/cartStock";
import { FiUser, FiMenu, FiX, FiChevronDown, FiLogOut } from "react-icons/fi";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const categories = useCategory();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    if (userDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userDropdownOpen]);

  // Helper to get user initials
  const getUserInitial = () => {
    if (auth?.user?.name) {
      return auth.user.name.charAt(0).toUpperCase();
    }
    return "U";
  };

  // Nav Item Styles (Dark text for light gradient bg)
  const navItemClasses = ({ isActive }) =>
    `px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center whitespace-nowrap ${
      isActive
        ? "bg-sky-600 text-white shadow-md shadow-sky-900/15"
        : "text-slate-700 hover:bg-white/90 hover:text-sky-800 hover:shadow-sm"
    }`;

  const dropdownButtonClasses =
    "flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-white/90 hover:text-sky-800 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40";

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/70 bg-gradient-to-r from-sky-50/90 via-white/85 to-cyan-50/90 backdrop-blur-md shadow-sm shadow-slate-900/[0.04] font-sans"
        aria-label="Main navigation"
      >
        <div className="w-full px-4 lg:px-6">
          <div className="flex h-[72px] w-full items-center justify-between gap-3 lg:gap-4">
            {/* LEFT: BRANDING — flush to content padding */}
            <Link to="/" className="flex shrink-0 items-center gap-2 group">
              <div className="relative transform group-hover:scale-105 transition-transform duration-200">
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 3H5L5.4 5M5.4 5H21L17 13H7M5.4 5L7 13M7 13L4.707 15.293C4.077 15.923 4.523 17 5.414 17H17"
                    stroke="#1e293b"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="9" cy="21" r="1.5" fill="#1d4ed8" />
                  <circle cx="20" cy="21" r="1.5" fill="#1d4ed8" />
                  <path
                    d="M11 9H15M13 7V11"
                    stroke="#1d4ed8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <span
                className="text-2xl font-black text-slate-800"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Medicure
              </span>
            </Link>

            {/* CENTER: SEARCH — grows so bar uses full width; inner max-width keeps field readable */}
            <div className="hidden min-w-0 flex-1 justify-center px-2 sm:px-3 lg:flex">
              <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
                <SearchInput />
              </div>
            </div>

            {/* RIGHT: NAV + AUTH — flush to content padding */}
            <div className="hidden shrink-0 items-center gap-1 lg:flex">
              <div className="flex items-center gap-1">
                <NavLink to="/" className={navItemClasses}>
                  Home
                </NavLink>

                {/* Categories Dropdown */}
                <div
                  className="relative group"
                  onMouseEnter={() => setCategoriesDropdownOpen(true)}
                  onMouseLeave={() => setCategoriesDropdownOpen(false)}
                >
                  <button className={dropdownButtonClasses}>
                    Categories
                    <FiChevronDown className="w-4 h-4 ml-1" />
                  </button>

                  {categoriesDropdownOpen && (
                    <div className="absolute top-full right-0 pt-1 z-50">
                      <div className="w-56 rounded-xl border border-slate-100 bg-white/95 py-2 shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5 backdrop-blur-sm">
                        <Link
                          to="/categories"
                          className="block px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-sky-50 hover:text-sky-800"
                          onClick={() => setCategoriesDropdownOpen(false)}
                        >
                          All Categories
                        </Link>
                        {categories?.map((c) => (
                          <Link
                            key={c._id}
                            to={`/category/${c.slug}`}
                            className="block px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-sky-50 hover:text-sky-800"
                            onClick={() => setCategoriesDropdownOpen(false)}
                          >
                            {c.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <NavLink to="/cart" className={navItemClasses}>
                  Cart
                  {cartTotalUnits(cart) > 0 && (
                    <span className="ml-1.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-sky-700 px-1 text-[10px] font-bold text-white">
                      {cartTotalUnits(cart)}
                    </span>
                  )}
                </NavLink>
              </div>

              {/* ================= USER AUTH SECTION ================= */}
              {!auth?.user ? (
                <>
                  <div className="mx-1.5 h-6 w-px shrink-0 bg-slate-200/90" aria-hidden />
                  <NavLink
                    to="/login"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-sky-600 text-sky-700 transition-all duration-200 hover:bg-sky-600 hover:text-white hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                    title="Login"
                  >
                    <FiUser className="w-5 h-5" />
                  </NavLink>
                </>
              ) : (
                <>
                  <div className="mx-1.5 h-6 w-px shrink-0 bg-slate-200/90" aria-hidden />
                  <div
                    ref={userDropdownRef}
                    className="relative"
                    onMouseEnter={() => setUserDropdownOpen(true)}
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-sky-200 bg-white text-base font-bold text-sky-700 shadow-sm transition-colors duration-200 hover:border-sky-300 hover:bg-sky-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40"
                    >
                      {getUserInitial()}
                    </button>

                    {/* Custom Dropdown */}
                    {userDropdownOpen && (
                      <div className="absolute top-full right-0 pt-3 z-50">
                        <div className="w-72 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5">
                          <div className="border-b border-slate-100 bg-gradient-to-br from-sky-50/80 to-white px-6 py-5">
                            <h4 className="text-base font-bold leading-tight text-slate-900">
                              {auth?.user?.name}
                            </h4>
                            <p className="mt-1 break-words text-sm text-slate-600">{auth?.user?.email}</p>
                          </div>

                          <div className="py-2">
                            <NavLink
                              to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}
                              className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-sky-50 hover:text-sky-900"
                              onClick={() => setUserDropdownOpen(false)}
                            >
                              <FiUser className="h-4 w-4 text-sky-600" />
                              Dashboard
                            </NavLink>

                            <div className="mx-6 my-1 h-px bg-slate-100" />

                            <button
                              type="button"
                              onClick={() => {
                                handleLogout();
                                setUserDropdownOpen(false);
                              }}
                              className="flex w-full items-center gap-3 px-6 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                            >
                              <FiLogOut className="h-4 w-4" />
                              Logout
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              className="shrink-0 rounded-lg p-2 text-slate-700 transition hover:bg-white/80 hover:text-sky-700 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/40 lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200/80 bg-white/95 shadow-inner backdrop-blur-md lg:hidden">
          <div className="w-full space-y-1 px-4 py-5 lg:px-6">
            <div className="w-full pb-2">
              <SearchInput />
            </div>
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-base font-semibold text-slate-800 hover:bg-sky-50 hover:text-sky-800"
            >
              Home
            </NavLink>
            <NavLink
              to="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-base font-semibold text-slate-800 hover:bg-sky-50 hover:text-sky-800"
            >
              Categories
            </NavLink>
            {!auth?.user ? (
              <>
                <NavLink
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-base font-semibold text-slate-800 hover:bg-sky-50 hover:text-sky-800"
                >
                  Register
                </NavLink>
                <NavLink
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-base font-semibold text-slate-800 hover:bg-sky-50 hover:text-sky-800"
                >
                  Login
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-base font-semibold text-slate-800 hover:bg-sky-50 hover:text-sky-800"
                >
                  Dashboard
                </NavLink>
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full rounded-lg px-3 py-2.5 text-left text-base font-semibold text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            )}
            <NavLink
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-base font-semibold text-slate-800 hover:bg-sky-50 hover:text-sky-800"
            >
              Cart {cartTotalUnits(cart) > 0 && `(${cartTotalUnits(cart)})`}
            </NavLink>
            </div>
          </div>
        )}
      </nav>
      <div className="h-[72px]" aria-hidden />
    </>
  );
};

export default Header;