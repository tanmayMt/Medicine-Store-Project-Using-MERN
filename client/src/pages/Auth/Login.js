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
      <div className="form-container" style={{ minHeight: "90vh" }}>
        {/* <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          {/* <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Let's Continue with <u>{email}</u>
          </h2> */}
        {/* </div> */} 

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
            // onSubmit={handleSubmit}
            // noValidate
            // className="title"
          >
          <h4 className="title">
            Let's Continue with <u>{email}</u>
          </h4>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {/* Email address */}
              </label>
              <div className="mt-3">
                <input
                  onChange={handleChange}
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="What's your email" required
                />
              </div>
            </div>
            <div>
              <br></br>
              <button
                type="submit"
                onClick={handleSubmit}
                className="btn btn-primary"
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