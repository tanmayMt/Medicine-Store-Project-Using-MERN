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

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 font-poppins text-[15px] uppercase shadow-md border-b border-gray-200 bg-white">
        <div className="w-full px-4 lg:px-6">
          {/* CHANGED: Reduced vertical padding from py-4 to py-2 to decrease height */}
          <div className="flex items-center justify-between py-2">
            
            {/* ================= LEFT SIDE: Mobile Button + Brand ================= */}
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

              {/* Brand Logo & Icon */}
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="19" r="2" fill="#3B82F6" />
                  <circle cx="20" cy="19" r="2" fill="#3B82F6" />
                </svg>
                <Link
                  to="/"
                  className="font-bold text-xl tracking-[1px] text-black"
                  style={{ fontFamily: "roboto, sans-serif" }}
                >
                  MEDICURE
                </Link>
              </div>
            </div>

            {/* ================= RIGHT SIDE: Search + Navigation ================= */}
            <div className="hidden lg:flex items-center gap-8">
              
              {/* Search Bar */}
              <div className="w-[350px]">
                <SearchInput />
              </div>

              {/* Navigation Links Group */}
              <div className="flex items-center gap-6 font-medium text-gray-700">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `hover:text-black transition-colors ${isActive ? "text-black font-bold" : ""}`
                  }
                >
                  HOME
                </NavLink>

                {/* Categories Dropdown */}
                <div className="relative group">
                  <button
                    className="flex items-center hover:text-black transition-colors"
                    onMouseEnter={() => setCategoriesDropdownOpen(true)}
                    onMouseLeave={() => setCategoriesDropdownOpen(false)}
                  >
                    CATEGORIES
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {categoriesDropdownOpen && (
                    <ul
                      className="absolute right-0 mt-0 w-48 bg-white shadow-xl border border-gray-100 py-2 z-50 normal-case"
                      onMouseEnter={() => setCategoriesDropdownOpen(true)}
                      onMouseLeave={() => setCategoriesDropdownOpen(false)}
                    >
                      <li>
                        <Link
                          className="block px-4 py-2 hover:bg-gray-50 hover:text-blue-600"
                          to="/categories"
                          onClick={() => setCategoriesDropdownOpen(false)}
                        >
                          All Categories
                        </Link>
                      </li>
                      {categories?.map((c) => (
                        <li key={c._id}>
                          <Link
                            className="block px-4 py-2 hover:bg-gray-50 hover:text-blue-600"
                            to={`/category/${c.slug}`}
                            onClick={() => setCategoriesDropdownOpen(false)}
                          >
                            {c.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Auth Links */}
                {!auth?.user ? (
                  <>
                    <NavLink
                      to="/register"
                      className={({ isActive }) =>
                        `hover:text-black transition-colors ${isActive ? "text-black font-bold" : ""}`
                      }
                    >
                      REGISTER
                    </NavLink>
                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        `hover:text-black transition-colors ${isActive ? "text-black font-bold" : ""}`
                      }
                    >
                      LOGIN
                    </NavLink>
                  </>
                ) : (
                  <div className="relative group">
                    <button
                      className="flex items-center hover:text-black transition-colors uppercase"
                      onMouseEnter={() => setUserDropdownOpen(true)}
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      {auth?.user?.name}
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {userDropdownOpen && (
                      <ul
                        className="absolute right-0 mt-0 w-48 bg-white shadow-xl border border-gray-100 py-2 z-50 normal-case"
                        onMouseEnter={() => setUserDropdownOpen(true)}
                        onMouseLeave={() => setUserDropdownOpen(false)}
                      >
                        <li>
                          <NavLink
                            to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}
                            className="block px-4 py-2 hover:bg-gray-50"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            Dashboard
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            onClick={() => {
                              handleLogout();
                              setUserDropdownOpen(false);
                            }}
                            to="/login"
                            className="block px-4 py-2 hover:bg-gray-50"
                          >
                            Logout
                          </NavLink>
                        </li>
                      </ul>
                    )}
                  </div>
                )}

                {/* Cart Link */}
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    `relative hover:text-black transition-colors ${isActive ? "text-black font-bold" : ""}`
                  }
                >
                  CART
                  {cart?.length > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </NavLink>
              </div>
            </div>

          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 py-4 px-6 shadow-inner h-screen">
            <div className="flex flex-col space-y-6">
              <div className="w-full mt-2">
                <SearchInput />
              </div>
              <NavLink to="/" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>HOME</NavLink>
              <NavLink to="/categories" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>CATEGORIES</NavLink>
              {!auth?.user ? (
                <>
                  <NavLink to="/register" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>REGISTER</NavLink>
                  <NavLink to="/login" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>LOGIN</NavLink>
                </>
              ) : (
                <>
                  <NavLink to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`} className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>DASHBOARD</NavLink>
                  <NavLink className="text-lg font-medium" onClick={() => { handleLogout(); setMobileMenuOpen(false); }} to="/login">LOGOUT</NavLink>
                </>
              )}
              <NavLink to="/cart" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                CART ({cart?.length})
              </NavLink>
            </div>
          </div>
        )}
      </nav>
      {/* Spacer updated to match new lower height */}
      <div className="h-[60px]"></div>
    </>
  );
};

export default Header;