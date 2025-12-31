import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { FiBox, FiUser, FiMapPin, FiLogOut, FiLayout } from "react-icons/fi"; // Feather icons match the design

const UserMenu = () => {
  const [auth, setAuth] = useAuth();

  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard/user", icon: <FiLayout /> },
    { name: "Profile", path: "/dashboard/user/profile", icon: <FiUser /> },
    { name: "Orders", path: "/dashboard/user/orders", icon: <FiBox /> },
    { name: "Delivery Address", path: "/dashboard/user/delivery-address", icon: <FiMapPin /> },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      {/* Welcome Section */}
      <div className="p-6 border-b border-gray-100 bg-gray-50">
        <h2 className="text-xl font-bold text-gray-800">Welcome,</h2>
        <p className="text-gray-600 truncate">{auth?.user?.name}</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col p-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/dashboard/user"} // Ensures exact match for home
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-4 text-sm font-medium transition-all duration-200 rounded-md
              ${
                isActive
                  ? "bg-gray-100 text-black font-semibold border-l-4 border-black"
                  : "text-gray-500 hover:bg-gray-50 hover:text-black"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}

        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-4 text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 rounded-md w-full text-left mt-2 border-t border-gray-100"
        >
          <span className="text-lg"><FiLogOut /></span>
          Sign out
        </button>
      </nav>
    </div>
  );
};

export default UserMenu;