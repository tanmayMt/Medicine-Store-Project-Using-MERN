import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const ForgotPasssword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [answer, setAnswer] = useState("");

  // New state for OTP flow
  const [resetMethod, setResetMethod] = useState("question"); // "question" or "otp"
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Enter email for OTP, 2: Enter OTP & new password

  const navigate = useNavigate();

  // Handle Security Question Reset
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

  // Handle Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/send-otp`, {
        email,
      });
      if (res && res.data.success) {
        toast.success(res.data.message);
        setStep(2);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  // Handle Reset with OTP
  const handleResetWithOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/reset-password-otp`, {
        email,
        otp,
        newPassword,
      });
      if (res && res.data.success) {
        toast.success(res.data.message);
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
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 font-poppins">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl relative overflow-hidden">

          {/* Decorative Top Bar */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 to-blue-600"></div>

          <div className="text-center">
            <h2 className="mt-2 text-3xl font-bold text-gray-900 font-playfair tracking-wide">
              Reset Password
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your details to reset your password
            </p>
          </div>

          {/* Reset Method Toggle */}
          <div className="flex justify-center mt-6 p-1 bg-gray-200 rounded-lg">
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${resetMethod === "question" ? "bg-white text-gray-900 shadow" : "text-gray-500 hover:text-gray-900"
                }`}
              onClick={() => { setResetMethod("question"); setStep(1); }}
            >
              Security Question
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${resetMethod === "otp" ? "bg-white text-gray-900 shadow" : "text-gray-500 hover:text-gray-900"
                }`}
              onClick={() => { setResetMethod("otp"); setStep(1); }}
            >
              Email OTP
            </button>
          </div>

          <form className="mt-8 space-y-5" onSubmit={
            resetMethod === "question" ? handleSubmit : (step === 1 ? handleSendOtp : handleResetWithOtp)
          }>

            {/* Common or Step 1: Email Input */}
            {(resetMethod === "question" || step === 1) && (
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm transition-all duration-200"
                  placeholder="Email Address"
                  required
                />
              </div>
            )}

            {/* Questions Flow Inputs */}
            {resetMethod === "question" && (
              <>
                <div>
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm transition-all duration-200"
                    placeholder="Security Answer (Favorite Sport)"
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm transition-all duration-200"
                    placeholder="New Password"
                    required
                  />
                </div>
              </>
            )}

            {/* OTP Flow Step 2 Inputs */}
            {resetMethod === "otp" && step === 2 && (
              <>
                <div>
                  <div className="text-sm text-gray-600 mb-4 text-center">
                    OTP sent to <span className="font-medium text-gray-900">{email}</span>
                    <button type="button" onClick={() => setStep(1)} className="ml-2 text-cyan-600 hover:text-cyan-700 underline">Change Email</button>
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm transition-all duration-200"
                    placeholder="Enter 6-digit OTP"
                    required
                  />
                </div>
                <div className="mt-4">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm transition-all duration-200"
                    placeholder="New Password"
                    required
                  />
                </div>
              </>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold uppercase rounded-lg text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {resetMethod === "question" ? "Reset Password" : (step === 1 ? "Send OTP" : "Verify & Reset Password")}
              </button>
            </div>

            {/* Back to Login Link */}
            <div className="text-center mt-4">
              <Link to="/login" className="font-medium text-sm text-gray-600 hover:text-cyan-600 transition-colors">
                &larr; Back to Login
              </Link>
            </div>

          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPasssword;