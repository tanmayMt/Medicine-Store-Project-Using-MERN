import React, { useState, useEffect, useRef } from "react";
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

  // UPDATE 1: Changed Green to Blue to match the "Take a Test" button style
  // Used 'text-gray-600' for better contrast on white background
  const navItemClasses = ({ isActive }) =>
    `px-4 py-2 rounded-full text-base font-semibold transition-all duration-200 flex items-center ${
      isActive
        ? "bg-blue-700 text-white shadow-md" 
        : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
    }`;

  const dropdownButtonClasses =
    "flex items-center px-4 py-2 rounded-full text-base font-semibold text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 focus:outline-none";

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 shadow-sm font-sans bg-white border-b border-gray-100" 
        // UPDATE 2: Removed gradient style to match the clean white background of the image
      >
        <div className="w-full px-6 lg:px-8">
          <div className="flex items-center justify-between h-[70px]">
            
            {/* ================= LEFT: BRANDING ================= */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative transform group-hover:scale-105 transition-transform duration-200">
                {/* SVG updated with Blue color to match theme */}
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
                className="text-2xl font-black text-gray-800" // Darker text for white bg
                style={{ 
                    fontFamily: "'Inter', sans-serif",
                }}
              >
                Medicure
              </span>
            </Link>

            {/* ================= CENTER: SEARCH BAR ================= */}
            {/* Search Input Container matches the clean look */}
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
                        className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                        onClick={() => setCategoriesDropdownOpen(false)}
                      >
                        All Categories
                      </Link>
                      {categories?.map((c) => (
                        <Link
                          key={c._id}
                          to={`/category/${c.slug}`}
                          className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
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
                    <span className="ml-2 bg-blue-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full">
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
                    className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
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
                    ref={userDropdownRef}
                    className="relative"
                    onMouseEnter={() => setUserDropdownOpen(true)}
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <button 
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 border-2 border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 focus:outline-none"
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
                    </button>
                    {userDropdownOpen && (
                      <div 
                        className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl py-2 z-50 rounded-md"
                        onMouseEnter={() => setUserDropdownOpen(true)}
                        onMouseLeave={() => setUserDropdownOpen(false)}
                      >
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
                          className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          Dashboard
                        </NavLink>
                        <button
                          onClick={() => {
                            handleLogout();
                            setUserDropdownOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
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
          >
            <div className="w-full mb-4">
              <SearchInput />
            </div>
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-gray-800 hover:text-blue-600"
            >
              Home
            </NavLink>
            <NavLink
              to="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-gray-800 hover:text-blue-600"
            >
              Categories
            </NavLink>
            {/* ... rest of mobile menu logic updated with blue hover ... */}
            {!auth?.user ? (
              <>
                <NavLink
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-semibold text-gray-800 hover:text-blue-600"
                >
                  Register
                </NavLink>
                <NavLink
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-semibold text-gray-800 hover:text-blue-600"
                >
                  Login
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-semibold text-gray-800 hover:text-blue-600"
                >
                  Dashboard
                </NavLink>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-base font-semibold text-gray-800 hover:text-blue-600 text-left"
                >
                  Logout
                </button>
              </>
            )}
            <NavLink
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-gray-800 hover:text-blue-600"
            >
              Cart {cart?.length > 0 && `(${cart.length})`}
            </NavLink>
          </div>
        )}
      </nav>
      {/* Spacer div */}
      <div className="h-[70px]"></div>
    </>
  );
};

export default Header;