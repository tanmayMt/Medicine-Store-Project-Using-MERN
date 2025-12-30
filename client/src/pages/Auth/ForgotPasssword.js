import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ForgotPasssword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [answer, setAnswer] = useState("");

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
              RESET PASSWORD
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

              {/* Security Question Input */}
              <div>
                <input
                  type="text"
                  id="answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="block w-full py-2 px-0 bg-transparent border-0 border-b-2 border-gray-300 focus:border-gray-900 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400"
                  placeholder="Enter Your favorite Sport Name"
                  required
                />
              </div>

              {/* New Password Input */}
              <div>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full py-2 px-0 bg-transparent border-0 border-b-2 border-gray-300 focus:border-gray-900 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400"
                  placeholder="Enter Your Password"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3 px-6 text-white font-bold uppercase"
                  style={{ 
                    backgroundColor: "#000000"
                  }}
                >
                  RESET
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPasssword;
