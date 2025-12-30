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
  MdPerson, 
  MdPhone, 
  MdLocationOn,
  MdSportsSoccer
} from "react-icons/md";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/register`, {
        name,
        email,
        password,
        phone,
        address,
        answer,
      });
      if (res && res.data.success) {
        toast.success("User Register Successfully");
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
    <Layout title="Register - Medicine Store">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ minHeight: "calc(100vh - 200px)" }}>
        <div className="max-w-2xl w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-2" style={{ color: "#FF6B35" }}>
              Create Your Account
            </h2>
            <p className="text-lg" style={{ color: "#7B2CBF" }}>
              Join us today and get started
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-2xl p-8 space-y-6 border-2" style={{ borderColor: "#E5E7EB" }}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name Input */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdPerson className="h-5 w-5" style={{ color: "#9CA3AF" }} />
                    </div>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:ring-2 focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
                      style={{ borderColor: "#D1D5DB" }}
                      onFocus={(e) => e.target.style.borderColor = "#FF6B35"}
                      onBlur={(e) => e.target.style.borderColor = "#D1D5DB"}
                      placeholder="Enter your name"
                      required
                      autoFocus
                    />
                  </div>
                </div>

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

                {/* Phone Input */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdPhone className="h-5 w-5" style={{ color: "#9CA3AF" }} />
                    </div>
                    <input
                      type="text"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:ring-2 focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
                      style={{ borderColor: "#D1D5DB" }}
                      onFocus={(e) => e.target.style.borderColor = "#FF6B35"}
                      onBlur={(e) => e.target.style.borderColor = "#D1D5DB"}
                      placeholder="Enter your phone"
                      required
                    />
                  </div>
                </div>

                {/* Address Input */}
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                      <MdLocationOn className="h-5 w-5" style={{ color: "#9CA3AF" }} />
                    </div>
                    <input
                      type="text"
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:ring-2 focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
                      style={{ borderColor: "#D1D5DB" }}
                      onFocus={(e) => e.target.style.borderColor = "#FF6B35"}
                      onBlur={(e) => e.target.style.borderColor = "#D1D5DB"}
                      placeholder="Enter your address"
                      required
                    />
                  </div>
                </div>

                {/* Security Question Input */}
                <div className="md:col-span-2">
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
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-lg text-base font-bold text-white shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 mt-6"
                style={{ 
                  background: "linear-gradient(135deg, #7B2CBF 0%, #9D4EDD 100%)",
                  boxShadow: "0 4px 15px rgba(123, 44, 191, 0.4)"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "linear-gradient(135deg, #6A1B9A 0%, #8B3DD9 100%)";
                  e.target.style.boxShadow = "0 6px 20px rgba(123, 44, 191, 0.6)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "linear-gradient(135deg, #7B2CBF 0%, #9D4EDD 100%)";
                  e.target.style.boxShadow = "0 4px 15px rgba(123, 44, 191, 0.4)";
                }}
              >
                REGISTER
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center pt-4 border-t" style={{ borderColor: "#E5E7EB" }}>
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
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

export default Register;