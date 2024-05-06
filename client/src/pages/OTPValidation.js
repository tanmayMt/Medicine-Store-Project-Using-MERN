import React, { useState, useEffect } from 'react';
import axios from "axios";
import { message } from "antd";
import { withRouter, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout/Layout';

function OTPValidation() {
  const [referenceId, setReferenceId] = useState(localStorage.getItem("OTPReference"));
  const [otp1, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const navigate = useNavigate();
  const handleResendOtp = async() => {
    //setIsResendDisabled(true);
    const res = await axios.post("/api/v1/auth/resendotp", {
      headers:{
      Authorization : "Bearer "+localStorage.getItem("ValidationToken"),
    }});

    if(res.data.success)
    {
      localStorage.clear();
      localStorage.setItem("ValidationToken", res.data.otptoken);
      localStorage.setItem("OTPReference", res.data.reference);
      localStorage.setItem("Email", res.data.email);
      setReferenceId(localStorage.getItem("OTPReference"));
      message.success(res.data.message);
    }
    else{
      message.error(res.data.message);
    }
    
    // setTimeout(() => {
    //   //setIsResendDisabled(false);
    //   console.log('OTP resent (simulated)'); // Replace with actual resend logic
    // }, 30000); // Simulate resend cooldown
  };
  // useEffect(() => {
  //   var storedReferenceId = localStorage.getItem('OTPReference');  // make it as constant
  //   storedReferenceId="null";  //Please make it commend after getting ref.Id
  //   if (storedReferenceId) {
  //     setReferenceId(storedReferenceId);
  //   }
  // }, []);

  // const handleInputChange = (event) => {
  //   const  otp  = event.target.value;
  //   if (name === 'referenceId') {
  //     setReferenceId(value);
  //   } else if (name === 'otp') {
  //     setOtp(value);
  //     setErrorMessage(''); 
  //   }
  // };

  const handleInputChange = (event) => {
    const OneTP = event.target.value;
    setOtp(OneTP)
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true); 

    try {
      // API call to validate OTP
      let otp2 = otp1.toString().trim();
      const res = await axios.post("/api/v1/auth/validateEmail", {
        headers:{
        Authorization : "Bearer "+localStorage.getItem("ValidationToken"),
      }, otp: otp2 });
          // if (response.ok) {
          //   // Handle successful validation (e.g., redirect to next page)
          //   console.log('OTP validated successfully!');
          // } else {
          //   const errorData = await response.json();
          //   setErrorMessage(errorData.message || 'OTP validation failed.'); 
          // }
    if(res.data.success){
      localStorage.removeItem("ValidationToken");
      localStorage.removeItem("OTPReference");
      localStorage.removeItem("Email");
      localStorage.setItem("VerifiedEmailToken", res.data.verifiedtoken);
      localStorage.setItem("VerifiedEmail", res.data.Email);
      message.success(res.data.message);
      navigate('/signup');
    }
    else{
      message.error(res.data.message);
    }
    } catch (error) {
      console.error('Error validating OTP:', error);
      setErrorMessage('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false); // Reset submission state
    }
  };
  const handleClick = () => {
    navigate('/login');
  };

  return (
    <Layout>
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
              <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="/ecommerce.png"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          OTP Verification
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit}className="space-y-6">
        <i>Please enter the otp received on {localStorage.getItem("Email")} with OTP ref. Id: {referenceId}. The OTP is valid for 5 minutes</i>
      <div >
        <label htmlFor="otp" className="block text-sm font-medium leading-6 text-gray-900">OTP 
        </label>
        <input
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          type="text"
          name="otp"
          id="otp"
          value={otp1}
          onChange={handleInputChange}
          // minLength={6} // Allow for shorter OTPs if needed
          required
        />
      </div>
      
      {errorMessage && <p>{errorMessage}</p>}
      <button type="submit" disabled={isSubmitting}className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        {isSubmitting ? 'Validating...' : 'Validate OTP'}
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
    </Layout>
  );
}

export default OTPValidation;
