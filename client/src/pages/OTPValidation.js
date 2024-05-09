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
    <div className="form-container" style={{ minHeight: "90vh" }}>
        
        <form onSubmit={handleSubmit}className="space-y-6">
                    <h2 className="title">
          OTP Verification
          </h2>
        <i>Please enter the otp received on {localStorage.getItem("Email")} with OTP ref. Id: <u>{referenceId}</u>. The OTP is valid for 5 minutes</i><br></br>
      <div className="mb-4">
        <input
        className="form-control"
          type="text"
          name="otp"
          id="otp"
          placeholder="Enter OTP"
          value={otp1}
          onChange={handleInputChange}
          // minLength={6} // Allow for shorter OTPs if needed
          required
        />
      </div>
      
      {errorMessage && <p>{errorMessage}</p>}
      <button className="btn btn-primary ms-1" disabled={isSubmitting}>
        {isSubmitting ? 'Validating...' : 'Validate OTP'}
      </button>
      <button
          type="button"
          className="btn btn-primary ms-1"
          disabled={isResendDisabled}
          onClick={handleResendOtp}
        >
          Resend OTP
        </button>


        <button
          className="btn btn-primary ms-1"
          disabled={isResendDisabled}
          onClick={handleClick}
        >
          Back
        </button>
    </form>

    </div>
    </Layout>
  );
}

export default OTPValidation;
