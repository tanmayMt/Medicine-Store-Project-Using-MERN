import React, { useState, useEffect } from 'react';
import { withRouter, useNavigate } from 'react-router-dom'
import axios from "axios";
import { message } from 'antd';

function ForgotPasswordNew() {
  const [referenceId, setReferenceId] = useState(localStorage.getItem("OTPReference"));
  const [otp1, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({

    password: '',

  });


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    //console.log(formData);

    // Optional: Basic validation on change (can be improved)
    // setErrors((prevErrors) => ({
    //   ...prevErrors,
    //   [name]: value.length === 0 ? `${name} is required` : '',
    // }));
    // setName({name:"Tanumoy Dos"});
  };
  const [errors, setErrors] = useState({}); // To store validation errors
  const handleResendOtp = async() => {

    const res = await axios.post("/api/v1/auth/resendotp", {
      headers:{
      Authorization : "Bearer "+localStorage.getItem("ResetToken"),
    }});
    if(res.data.success)
    {
      localStorage.clear();
      localStorage.setItem("OTPReference", res.data.reference);
      localStorage.setItem("Email", res.data.email);
      localStorage.setItem("ResetToken", res.data.otptoken);
      setReferenceId(localStorage.getItem("OTPReference"));
      message.success(res.data.message);
    }
    else{
      message.error(res.data.message);
    }
    // console.log("Hit");
    //     setIsResendDisabled(true);

    //     setTimeout(() => {
    //       setIsResendDisabled(false);
    //       console.log('OTP resent (simulated)'); // Replace with actual resend logic
    //     }, 30000); // Simulate resend cooldown
      };
  useEffect(() => {
    var referenceId = localStorage.getItem('OTPReference');  // make it as constant
    //storedReferenceId="";  //Please make it commend after getting ref.Id
    if (referenceId) {
      setReferenceId(referenceId);
    }
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    //console.log(name);
    //console.log(value);
    if (name === 'referenceId') {
      setReferenceId(value);
    } else if (name === 'otp') {
      setOtp(value);
      setErrorMessage(''); 
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true); 
    //For password
    let newErrors = {};
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    setErrors(newErrors);
    const res = await axios.post("/api/v1/auth/resetpassword", {
      headers:{
      Authorization : "Bearer "+localStorage.getItem("ResetToken"),
    },password: formData.password,otp: otp1});
    if(res.data.success)
    {
      localStorage.clear();
      localStorage.setItem("LoginToken", res.data.logintoken);
      //console.log(res.data.logintoken);
      message.success(res.data.message);
      navigate("/");
    }
    else{
      message.error(res.data.message);
    }
    setIsSubmitting(false);

  };
  const handleClick = () => {
    window.history.back();
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
          Forgot Password
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit}className="space-y-6">

      <div >
      <i>Please enter the OTP with Ref. Id: {referenceId} to reset the password. It is valid for 5 minutes</i>
        <label htmlFor="otp" className="block text-sm font-medium leading-6 text-gray-900">OTP 
        </label>
        <input
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          type="text"
          name="otp"
          id="otp"
          value={otp1}
          onChange={handleInputChange}
          maxLength={6} // Set a reasonable OTP length limit
          minLength={4} // Allow for shorter OTPs if needed
          required
        />
      </div>
      
      {errorMessage && <p>{errorMessage}</p>}

      <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
        <input
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          type="password"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
        />

      <button type="submit" disabled={isSubmitting}className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
      </button>
      <button
          type="button"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          disabled={isResendDisabled}
          onClick={handleResendOtp}
        >
          Resend OTP
        </button>


        <button
          type="button"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          disabled={isResendDisabled}
          onClick={handleClick}
        >
          Back
        </button>
    </form>
        </div>

    </div>

  );
}

export default ForgotPasswordNew;
