import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
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
      <div 
        className="flex items-center justify-center px-4 sm:px-6 lg:px-8" 
        style={{ 
          minHeight: "calc(100vh - 200px)",
          background: "linear-gradient(to bottom, #87CEEB 0%, #FFB6C1 100%)",
          paddingTop: "80px",
          paddingBottom: "80px"
        }}
      >
        <div className="max-w-2xl w-full">
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
              REGISTER FORM
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Input */}
              <div>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full py-2 px-0 bg-transparent border-0 border-b-2 border-gray-300 focus:border-gray-900 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400"
                  placeholder="Enter Your Name"
                  required
                  autoFocus
                />
              </div>

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

              {/* Phone Input */}
              <div>
                <input
                  type="text"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full py-2 px-0 bg-transparent border-0 border-b-2 border-gray-300 focus:border-gray-900 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400"
                  placeholder="Enter Your Phone"
                  required
                />
              </div>

              {/* Address Input */}
              <div>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="block w-full py-2 px-0 bg-transparent border-0 border-b-2 border-gray-300 focus:border-gray-900 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400"
                  placeholder="Enter Your Address"
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
                  placeholder="What is Your Favorite sports"
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
                  REGISTER
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;