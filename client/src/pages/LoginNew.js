import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { withRouter, useNavigate } from 'react-router-dom'
import { message } from "antd";
import axios from 'axios';
import Layout from '../components/Layout/Layout';
function LoginNew() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({

    password: '',

  });
  const [name, setName] = useState(localStorage.getItem("userName"));
  const [errors, setErrors] = useState({}); // To store validation errors

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData);

    // Optional: Basic validation on change (can be improved)
    // setErrors((prevErrors) => ({
    //   ...prevErrors,
    //   [name]: value.length === 0 ? `${name} is required` : '',
    // }));
    // setName({name:"Tanumoy Dos"});
  };

  const handleSubmit = async(event) => {
    event.preventDefault();

    let newErrors = {};
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    setErrors(newErrors);
    const res = await axios.post("/api/v1/auth/vpassword", {
      headers:{
      Authorization : "Bearer "+localStorage.getItem("OldUserToken"),
    },formData});
    if(res.data.success)
    {
      localStorage.removeItem("OldUserToken");
      localStorage.setItem("LoginToken", res.data.logintoken);
      message.success(res.data.message);

      navigate("/");
    }
    else{
      message.error(res.data.message);
    }
  };
  const handleClick = () => {
    navigate('/login');
  };

  const handleReset = async(event) => {
    
    const res = await axios.post("/api/v1/auth/resetOtp", {
        headers:{
        Authorization : "Bearer "+localStorage.getItem("OldUserToken"),
      }});
    //   console.log("HiAll");
    // console.log(res);
      if(res.data.success)
      {
        localStorage.clear();
        localStorage.setItem("OTPReference", res.data.reference);
        localStorage.setItem("Email", res.data.email);
        localStorage.setItem("ResetToken", res.data.otptoken);
        message.success(res.data.message);
        navigate("/forgot-password");
      }
      else{
        message.error(res.data.message);
      }
  };

  return (
    <Layout>
      <h1 class="centered-heading">
           <b>Welcome {name} to Medicure</b>
      </h1>
    <div className="form-container" style={{ minHeight: "90vh" }}>

        <form onSubmit={handleSubmit} >
          <h4 className="title">Let's Login</h4>
        <div className="mb-4">
        <input
         className="form-control"
          type="password"
          name="password"
          id="password"
          placeholder="Enter Your Password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>
    
               <button
                 type="submit"
                 onSubmit={"/login"}
                className="btn btn-primary ms-1">
                 Login
               </button>
             
                     
                      {/* Not a member?{' '} */}
            <button className="btn btn-primary ms-1" onClick={handleReset}>
                    Forgot password?
            </button>
        <button
          type="button"
          className="btn btn-primary ms-1"
          onClick={handleClick}
        >
          Back
        </button>

    </form>
    

  
  </div>
   </Layout>  
  );
}
export default LoginNew;