import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import SearchInput from "../Form/SearchInput";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/cart";
import { Badge } from "antd";

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
      <nav className="fixed top-0 left-0 right-0 z-50 font-poppins text-[17px] leading-[26px] uppercase shadow-[0_8px_6px_-6px_gray] border-b border-gray-400 bg-white">
        <div className="w-full px-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between py-3">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Left Section: Cart Icon + Brand */}
            <div className="flex items-center gap-3">
              {/* Shopping Cart Icon - Light Gray with Blue Wheels */}
              <svg
                className="w-8 h-8"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Cart Body - Light Gray */}
                <path
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17"
                  stroke="#9CA3AF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Left Wheel - Blue */}
                <circle cx="9" cy="19" r="2" fill="#3B82F6" />
                {/* Right Wheel - Blue */}
                <circle cx="20" cy="19" r="2" fill="#3B82F6" />
              </svg>
              {/* Brand Name */}
              <Link
                to="/"
                className="font-bold text-[17px] leading-[26px] uppercase tracking-[3px] text-black hidden sm:block"
                style={{ fontFamily: "roboto, sans-serif" }}
              >
                MEDICURE
              </Link>
            </div>

            {/* Middle Section: Search Bar */}
            <div className="hidden lg:flex flex-1 justify-center max-w-md mx-8">
              <SearchInput />
            </div>

            {/* Right Section: Navigation Links */}
            <div className="hidden lg:flex items-center gap-1">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-4 py-2 font-light text-gray-600 hover:text-black transition-colors no-underline ${
                    isActive ? "text-black border-b-2 border-black" : ""
                  }`
                }
              >
                HOME
              </NavLink>

              {/* Categories Dropdown */}
              <div className="relative group">
                <button
                  type="button"
                  className="px-4 py-2 font-light text-gray-600 hover:text-black transition-colors flex items-center no-underline"
                  onMouseEnter={() => setCategoriesDropdownOpen(true)}
                  onMouseLeave={() => setCategoriesDropdownOpen(false)}
                >
                  CATEGORIES
                  <svg
                    className="ml-1 w-3 h-3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {categoriesDropdownOpen && (
                  <ul
                    className="absolute left-0 mt-0 w-48 bg-white shadow-lg rounded-md py-1 z-50"
                    onMouseEnter={() => setCategoriesDropdownOpen(true)}
                    onMouseLeave={() => setCategoriesDropdownOpen(false)}
                  >
                    <li>
                      <Link
                        className="block px-4 py-2 text-sm hover:bg-gray-100 no-underline"
                        to="/categories"
                        onClick={() => setCategoriesDropdownOpen(false)}
                      >
                        All Categories
                      </Link>
                    </li>
                    {categories?.map((c) => (
                      <li key={c._id}>
                        <Link
                          className="block px-4 py-2 text-sm hover:bg-gray-100 no-underline"
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

              {!auth?.user ? (
                <>
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `px-4 py-2 font-light text-gray-600 hover:text-black transition-colors no-underline ${
                        isActive ? "text-black border-b-2 border-black" : ""
                      }`
                    }
                  >
                    REGISTER
                  </NavLink>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `px-4 py-2 font-light text-gray-600 hover:text-black transition-colors no-underline ${
                        isActive ? "text-black border-b-2 border-black" : ""
                      }`
                    }
                  >
                    LOGIN
                  </NavLink>
                </>
              ) : (
                <>
                  {/* User Dropdown */}
                  <div className="relative group">
                    <button
                      type="button"
                      className="px-4 py-2 font-light text-gray-600 hover:text-black transition-colors flex items-center border-none no-underline"
                      onMouseEnter={() => setUserDropdownOpen(true)}
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      {auth?.user?.name?.toUpperCase()}
                      <svg
                        className="ml-1 w-3 h-3"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {userDropdownOpen && (
                      <ul
                        className="absolute right-0 mt-0 w-48 bg-white shadow-lg rounded-md py-1 z-50"
                        onMouseEnter={() => setUserDropdownOpen(true)}
                        onMouseLeave={() => setUserDropdownOpen(false)}
                      >
                        <li>
                          <NavLink
                            to={`/dashboard/${
                              auth?.user?.role === 1 ? "admin" : "user"
                            }`}
                            className="block px-4 py-2 text-sm hover:bg-gray-100 no-underline"
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
                            className="block px-4 py-2 text-sm hover:bg-gray-100 no-underline"
                          >
                            Logout
                          </NavLink>
                        </li>
                      </ul>
                    )}
                  </div>
                </>
              )}
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `px-4 py-2 font-light text-gray-600 hover:text-black transition-colors no-underline ${
                    isActive ? "text-black border-b-2 border-black" : ""
                  }`
                }
              >
                <Badge count={cart?.length} showZero offset={[10, -5]}>
                  CART
                </Badge>
              </NavLink>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3">
                {/* Mobile Search */}
                <div className="px-4">
                  <SearchInput />
                </div>
                
                {/* Mobile Navigation Links */}
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `px-4 py-2 font-light text-gray-600 hover:text-black transition-colors no-underline ${
                      isActive ? "text-black border-b-2 border-black" : ""
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  HOME
                </NavLink>
                
                <Link
                  to="/categories"
                  className="px-4 py-2 font-light text-gray-600 hover:text-black transition-colors no-underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  CATEGORIES
                </Link>
                {categories?.map((c) => (
                  <Link
                    key={c._id}
                    className="px-8 py-2 text-sm font-light text-gray-600 hover:bg-gray-100 no-underline"
                    to={`/category/${c.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {c.name}
                  </Link>
                ))}
                
                {!auth?.user ? (
                  <>
                    <NavLink
                      to="/register"
                      className={({ isActive }) =>
                        `px-4 py-2 font-light text-gray-600 hover:text-black transition-colors no-underline ${
                          isActive ? "text-black border-b-2 border-black" : ""
                        }`
                      }
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      REGISTER
                    </NavLink>
                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        `px-4 py-2 font-light text-gray-600 hover:text-black transition-colors no-underline ${
                          isActive ? "text-black border-b-2 border-black" : ""
                        }`
                      }
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      LOGIN
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink
                      to={`/dashboard/${
                        auth?.user?.role === 1 ? "admin" : "user"
                      }`}
                      className={({ isActive }) =>
                        `px-4 py-2 font-light text-gray-600 hover:text-black transition-colors no-underline ${
                          isActive ? "text-black border-b-2 border-black" : ""
                        }`
                      }
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </NavLink>
                    <NavLink
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      to="/login"
                      className="px-4 py-2 font-light text-gray-600 hover:text-black transition-colors no-underline"
                    >
                      Logout
                    </NavLink>
                  </>
                )}
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    `px-4 py-2 font-light text-gray-600 hover:text-black transition-colors no-underline ${
                      isActive ? "text-black border-b-2 border-black" : ""
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Badge count={cart?.length} showZero offset={[10, -5]}>
                    CART
                  </Badge>
                </NavLink>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;