import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { 
  FiLayout, 
  FiShoppingCart, 
  FiPackage, 
  FiLayers, // Imported for Category icon
  FiUsers, 
  FiFileText, 
  FiPercent, 
  FiLink, 
  FiHelpCircle, 
  FiSettings,
  FiMenu,
  FiX,
  FiLogOut
} from "react-icons/fi";

const AdminMenu = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg shadow-lg"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`h-screen bg-gray-800 text-white w-64 fixed left-0 top-0 overflow-y-auto z-40 transition-transform duration-300 flex flex-col ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <div className="relative transform transition-transform duration-200">
              {/* Custom SVG: Shopping Cart with Medical Cross */}
              <svg
                className="w-8 h-8" 
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 3H5L5.4 5M5.4 5H21L17 13H7M5.4 5L7 13M7 13L4.707 15.293C4.077 15.923 4.523 17 5.414 17H17"
                  stroke="#e5e7eb" 
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="9" cy="21" r="1.5" fill="#ea580c" />
                <circle cx="20" cy="21" r="1.5" fill="#ea580c" />
                <path 
                  d="M11 9H15M13 7V11" 
                  stroke="#ea580c" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span 
              className="text-xl font-black text-white"
              style={{ 
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Medicure
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 flex-1">
          <NavLink
            to="/dashboard/admin"
            end
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-orange-500 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`
            }
          >
            <FiLayout className="w-5 h-5" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/dashboard/admin/orders"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-orange-500 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`
            }
          >
            <FiShoppingCart className="w-5 h-5" />
            <span>Orders</span>
          </NavLink>

          <NavLink
            to="/dashboard/admin/products"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-orange-500 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`
            }
          >
            <FiPackage className="w-5 h-5" />
            <span>Products</span>
          </NavLink>

          {/* ADDED: Create Category Link */}
          <NavLink
            to="/dashboard/admin/create-category"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-orange-500 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`
            }
          >
            <FiLayers className="w-5 h-5" />
            <span>Create Category</span>
          </NavLink>

          <NavLink
            to="/dashboard/admin/users"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-orange-500 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`
            }
          >
            <FiUsers className="w-5 h-5" />
            <span>Customers</span>
          </NavLink>

          <NavLink
            to="/dashboard/admin/reports"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-orange-500 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`
            }
          >
            <FiFileText className="w-5 h-5" />
            <span>Reports</span>
          </NavLink>

          <NavLink
            to="/dashboard/admin/discounts"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-orange-500 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`
            }
          >
            <FiPercent className="w-5 h-5" />
            <span>Discounts</span>
          </NavLink>

          <NavLink
            to="/dashboard/admin/integrations"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-orange-500 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`
            }
          >
            <FiLink className="w-5 h-5" />
            <span>Integrations</span>
          </NavLink>

          <NavLink
            to="/dashboard/admin/help"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-orange-500 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`
            }
          >
            <FiHelpCircle className="w-5 h-5" />
            <span>Help</span>
          </NavLink>

          <NavLink
            to="/dashboard/admin/settings"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-orange-500 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`
            }
          >
            <FiSettings className="w-5 h-5" />
            <span>Settings</span>
          </NavLink>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500 hover:text-white transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminMenu;