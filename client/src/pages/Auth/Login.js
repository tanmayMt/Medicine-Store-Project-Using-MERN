import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";
import { useAuth } from "../../context/auth";
import { message } from "antd";
import validator from "validator";

const Login = () => {
  localStorage.clear();
  const navigate = useNavigate();
    const [email,setName]=useState("");
    function handleChange(event) {
        setName(event.target.value);
    }
    const handleSubmit = async(event)=>{
      let em = email.toString();
      event.preventDefault();
      if (validator.isEmail(em)) {
        const res1 = await axios.post("/api/v1/auth/check", {email: em});
        if(res1.data.success)
        {
          if(res1.data.type=="Newuser")
          {
            localStorage.setItem("NewUserToken", res1.data.token1);
            const res = await axios.post("/api/v1/auth/sendOtp", {
              headers:{
              Authorization : "Bearer "+localStorage.getItem("NewUserToken"),
            },});
            if(res.data.success)
            {
              localStorage.removeItem("NewUserToken");
              localStorage.setItem("ValidationToken", res.data.otptoken);
              localStorage.setItem("Email", res.data.email);
              localStorage.setItem("OTPReference", res.data.reference);
              navigate("/validateOtp");
            }
            else{
              message.error(res.data.message);
            }
          }
          if(res1.data.type=="Olduser"){
            localStorage.setItem("OldUserToken", res1.data.token);
            localStorage.setItem("userName", res1.data.username);
            navigate("/password");
          }
        }
        else{
          message.error(res1.data.message);
        }
           } else {
            message.error("Please enter a valid email.");
           }
      // props.history.push('/login'); // Use props.history for redirection
    }
  return (
    <Layout title="Login Medicure">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Let's Continue with <u>{email}</u>
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
            // onSubmit={handleSubmit}
            // noValidate
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  onChange={handleChange}
                  id="email"
                  name="email"
                  type="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="What's your email" required
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                onClick={handleSubmit}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
    </div>
    </Layout>
  );
};

export default Login;