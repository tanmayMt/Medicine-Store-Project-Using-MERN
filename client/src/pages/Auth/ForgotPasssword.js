import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { 
  MdEmail, 
  MdLock, 
  MdVisibility, 
  MdVisibilityOff,
  MdSportsSoccer
} from "react-icons/md";

const ForgotPasssword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [answer, setAnswer] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/forgot-password`, {
        email,
        newPassword,
        answer,
      });
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title="Forgot Password - Medicine Store">
      <div className="flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8" style={{ minHeight: "calc(100vh - 200px)" }}>
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-2" style={{ color: "#FF6B35" }}>
              Reset Password
            </h2>
            <p className="text-lg" style={{ color: "#7B2CBF" }}>
              Enter your details to reset your password
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

              {/* Security Question Input */}
              <div>
                <label htmlFor="answer" className="block text-sm font-semibold text-gray-700 mb-2">
                  Security Question: What is Your Favorite Sport?
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdSportsSoccer className="h-5 w-5" style={{ color: "#9CA3AF" }} />
                  </div>
                  <input
                    type="text"
                    id="answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:ring-2 focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
                    style={{ borderColor: "#D1D5DB" }}
                    onFocus={(e) => e.target.style.borderColor = "#FF6B35"}
                    onBlur={(e) => e.target.style.borderColor = "#D1D5DB"}
                    placeholder="Enter your favorite sport"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  This helps us verify your identity
                </p>
              </div>

              {/* New Password Input */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdLock className="h-5 w-5" style={{ color: "#9CA3AF" }} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border-2 rounded-lg focus:ring-2 focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
                    style={{ borderColor: "#D1D5DB" }}
                    onFocus={(e) => e.target.style.borderColor = "#FF6B35"}
                    onBlur={(e) => e.target.style.borderColor = "#D1D5DB"}
                    placeholder="Enter your new password"
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
                <p className="mt-1 text-xs text-gray-500">
                  Choose a strong password for better security
                </p>
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
                RESET PASSWORD
              </button>
            </form>

            {/* Back to Login Link */}
            <div className="text-center pt-4 border-t" style={{ borderColor: "#E5E7EB" }}>
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="font-semibold transition-colors"
                  style={{ color: "#7B2CBF" }}
                  onMouseEnter={(e) => e.target.style.color = "#5A189A"}
                  onMouseLeave={(e) => e.target.style.color = "#7B2CBF"}
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPasssword;
