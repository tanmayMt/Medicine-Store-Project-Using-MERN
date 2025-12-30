import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  FiLayout, 
  FiShoppingCart, 
  FiPackage, 
  FiUsers, 
  FiFileText, 
  FiPercent, 
  FiLink, 
  FiHelpCircle, 
  FiSettings,
  FiMenu,
  FiX
} from "react-icons/fi";

const AdminMenu = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
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
        className={`h-screen bg-gray-800 text-white w-64 fixed left-0 top-0 overflow-y-auto z-40 transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <FiShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">EzMart</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4">
          <NavLink
            to="/dashboard/admin"
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
      </div>
    </>
  );
};

export default AdminMenu;
