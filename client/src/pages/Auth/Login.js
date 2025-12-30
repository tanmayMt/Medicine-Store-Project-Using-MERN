import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      <div 
        className="flex items-center justify-center px-4 sm:px-6 lg:px-8" 
        style={{ 
          minHeight: "calc(100vh - 200px)",
          background: "linear-gradient(to bottom, #87CEEB 0%, #FFB6C1 100%)",
          paddingTop: "80px",
          paddingBottom: "80px"
        }}
      >
        <div className="max-w-md w-full">
          {/* Form Card */}
          <div 
            className="bg-white p-8 rounded-lg"
            style={{ 
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
            }}
          >
            <h2 
              className="text-2xl font-bold mb-6 text-center uppercase"
              style={{ 
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700
              }}
            >
              LOGIN FORM
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full py-2 px-0 bg-transparent border-0 border-b-2 border-gray-300 focus:border-gray-900 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400"
                  placeholder="Enter Your Email"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full py-2 px-0 bg-transparent border-0 border-b-2 border-gray-300 focus:border-gray-900 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400"
                  placeholder="Enter Your Password"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="space-y-3 pt-4">
                <button
                  type="submit"
                  className="w-full py-3 px-6 text-white font-bold uppercase"
                  style={{ 
                    backgroundColor: "#000000"
                  }}
                >
                  LOGIN
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="w-full py-3 px-6 text-white font-bold uppercase"
                  style={{ 
                    backgroundColor: "#000000"
                  }}
                >
                  Forgot Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;