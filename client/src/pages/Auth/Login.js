import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [auth, setAuth] = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/login`, {
        email,
        password,
      });
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate(location.state || "/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Please Register");
    }
  };

  return (
    <Layout title="Login - Medicine Store">
      <div className="flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8" style={{ minHeight: "calc(100vh - 200px)" }}>
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-2" style={{ color: "#FF6B35" }}>
              Welcome Back
            </h2>
            <p className="text-lg" style={{ color: "#7B2CBF" }}>
              Sign in to your account to continue
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-2xl p-8 space-y-6 border-2" style={{ borderColor: "#E5E7EB" }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdEmail className="h-5 w-5" style={{ color: "#9CA3AF" }} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:ring-2 focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
                    style={{ borderColor: "#D1D5DB" }}
                    onFocus={(e) => e.target.style.borderColor = "#FF6B35"}
                    onBlur={(e) => e.target.style.borderColor = "#D1D5DB"}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdLock className="h-5 w-5" style={{ color: "#9CA3AF" }} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border-2 rounded-lg focus:ring-2 focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
                    style={{ borderColor: "#D1D5DB" }}
                    onFocus={(e) => e.target.style.borderColor = "#FF6B35"}
                    onBlur={(e) => e.target.style.borderColor = "#D1D5DB"}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center transition-colors"
                    style={{ color: "#9CA3AF" }}
                    onMouseEnter={(e) => e.target.style.color = "#4B5563"}
                    onMouseLeave={(e) => e.target.style.color = "#9CA3AF"}
                  >
                    {showPassword ? (
                      <MdVisibilityOff className="h-5 w-5" />
                    ) : (
                      <MdVisibility className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm font-medium transition-colors"
                  style={{ color: "#7B2CBF" }}
                  onMouseEnter={(e) => e.target.style.color = "#5A189A"}
                  onMouseLeave={(e) => e.target.style.color = "#7B2CBF"}
                >
                  Forgot your password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-lg text-base font-bold text-white shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
                style={{ 
                  background: "linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)",
                  boxShadow: "0 4px 15px rgba(255, 107, 53, 0.4)"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "linear-gradient(135deg, #E55A2B 0%, #E0841A 100%)";
                  e.target.style.boxShadow = "0 6px 20px rgba(255, 107, 53, 0.6)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)";
                  e.target.style.boxShadow = "0 4px 15px rgba(255, 107, 53, 0.4)";
                }}
              >
                LOGIN
              </button>
            </form>

            {/* Register Link */}
            <div className="text-center pt-4 border-t" style={{ borderColor: "#E5E7EB" }}>
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold transition-colors"
                  style={{ color: "#7B2CBF" }}
                  onMouseEnter={(e) => e.target.style.color = "#5A189A"}
                  onMouseLeave={(e) => e.target.style.color = "#7B2CBF"}
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;