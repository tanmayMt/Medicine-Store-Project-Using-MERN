import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { withRouter, useNavigate } from 'react-router-dom'
import { message } from "antd";
import axios from 'axios';
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
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="/ecommerce.png"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
           Welcome {name} to Medicure
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">

        <div className="form-group">
        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
        <input
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          type="password"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>
      <div>
               <button
                 type="submit"
                 onSubmit={"/login"}
                 className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
               >
                 Login
               </button>
             </div>
             <div><button
          type="button"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={handleClick}
        >
          Back
        </button></div>
    </form>
    <p className="mt-10 text-center text-sm text-gray-500">
            {/* Not a member?{' '} */}
            <button className="font-semibold text-indigo-600 hover:text-indigo-500" onClick={handleReset}>
                    Forgot password?
            </button>
    </p>
  </div>
 </div>
    
  );
}
export default LoginNew;