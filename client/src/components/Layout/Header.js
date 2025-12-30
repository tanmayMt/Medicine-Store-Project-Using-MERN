import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import SearchInput from "../Form/SearchInput";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/cart";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const categories = useCategory();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
  };

  // Reusable nav item classes
  const navItemClasses = ({ isActive }) =>
    `px-4 py-2 rounded-full text-base font-semibold transition-all duration-200 flex items-center ${
      isActive
        ? "bg-green-500 text-white shadow-md"
        : "text-gray-700 hover:bg-green-500 hover:text-white"
    }`;

  const dropdownButtonClasses = 
    "flex items-center px-4 py-2 rounded-full text-base font-semibold text-gray-700 hover:bg-green-500 hover:text-white transition-all duration-200 focus:outline-none";

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 shadow-sm font-sans"
        style={{
          background: "linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 50%, #ffffff 100%)",
        }}
      >
        <div className="w-full px-6 lg:px-8">
          <div className="flex items-center justify-between h-[70px]">
            {/* ================= LEFT: BRANDING ================= */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <svg
                  className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 4v16M6 12h6M18 4v16"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 8l2 2 4-4"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    transform="rotate(-15 16 10)"
                  />
                  <circle
                    cx="16"
                    cy="10"
                    r="3"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                </svg>
              </div>
              <span
                className="text-xl font-bold text-blue-600 uppercase tracking-wide"
                style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "1px" }}
              >
                MEDICURE
              </span>
            </Link>

            {/* ================= CENTER: SEARCH BAR ================= */}
            <div className="hidden lg:flex items-center justify-center flex-1 max-w-md mx-8">
              <div className="w-full">
                <SearchInput />
              </div>
            </div>

            {/* ================= RIGHT: NAVIGATION ================= */}
            <div className="hidden lg:flex items-center gap-3">
              
              {/* Navigation Links Group */}
              <div className="flex items-center gap-1 ml-2">
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
                    <svg
                      className="w-4 h-4 ml-1" 
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button>

                  {categoriesDropdownOpen && (
                    <div className="absolute top-full right-0 mt-1 w-56 bg-white border border-gray-100 shadow-xl py-2 z-50 rounded-md">
                      <Link
                        to="/categories"
                        className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-green-600"
                        onClick={() => setCategoriesDropdownOpen(false)}
                      >
                        All Categories
                      </Link>
                      {categories?.map((c) => (
                        <Link
                          key={c._id}
                          to={`/category/${c.slug}`}
                          className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-green-600"
                          onClick={() => setCategoriesDropdownOpen(false)}
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <NavLink to="/cart" className={navItemClasses}>
                  Cart
                  {cart?.length > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full">
                      {cart.length}
                    </span>
                  )}
                </NavLink>
              </div>

              {/* User Icon / Auth Links */}
              {!auth?.user ? (
                <>
                  <div className="w-px h-6 bg-gray-300 mx-2"></div>
                  <NavLink
                    to="/login"
                    className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-200"
                    title="Login"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </NavLink>
                </>
              ) : (
                <>
                  <div className="w-px h-6 bg-gray-300 mx-2"></div>
                  <div
                    className="relative"
                    onMouseEnter={() => setUserDropdownOpen(true)}
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <button className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition-all duration-200 focus:outline-none">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </button>
                    {userDropdownOpen && (
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl py-2 z-50 rounded-md">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">
                            {auth?.user?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {auth?.user?.email}
                          </p>
                        </div>
                        <NavLink
                          to={`/dashboard/${
                            auth?.user?.role === 1 ? "admin" : "user"
                          }`}
                          className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-green-600"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          Dashboard
                        </NavLink>
                        <button
                          onClick={() => {
                            handleLogout();
                            setUserDropdownOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-green-600"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden bg-white border-t border-gray-200 shadow-lg p-6 flex flex-col gap-4"
            style={{
              background: "linear-gradient(180deg, #ffffff 0%, #f0f9ff 100%)",
            }}
          >
            <div className="w-full mb-4">
              <SearchInput />
            </div>
            {/* Removed 'Shop Now' button from Mobile Menu as well */}
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-gray-800 hover:text-green-600"
            >
              Home
            </NavLink>
            <NavLink
              to="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-gray-800 hover:text-green-600"
            >
              Categories
            </NavLink>
            {!auth?.user ? (
              <>
                <NavLink
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-semibold text-gray-800 hover:text-green-600"
                >
                  Register
                </NavLink>
                <NavLink
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-semibold text-gray-800 hover:text-green-600"
                >
                  Login
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-semibold text-gray-800 hover:text-green-600"
                >
                  Dashboard
                </NavLink>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-base font-semibold text-gray-800 hover:text-green-600 text-left"
                >
                  Logout
                </button>
              </>
            )}
            <NavLink
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-gray-800 hover:text-green-600"
            >
              Cart {cart?.length > 0 && `(${cart.length})`}
            </NavLink>
          </div>
        )}
      </nav>
      {/* Spacer div to push content down below fixed header */}
      <div className="h-[70px]"></div>
    </>
  );
};

export default Header;