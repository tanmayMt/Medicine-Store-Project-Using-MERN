import React, { useState, useEffect } from 'react';
import { withRouter, useNavigate } from 'react-router-dom'
import axios from "axios";
import { message } from 'antd';
import Layout from '../components/Layout/Layout';
import toast from 'react-hot-toast';

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
      toast.error("Password must be at least 8 characters long, please try again")
      setIsSubmitting(false);
    }
    else{
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
    }
    setErrors(newErrors);
    

  };
  const handleClick = () => {
    window.history.back();
  };

  return (
    <Layout>
      <div className="form-container" style={{ minHeight: "90vh" }}>
          {/* <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          
          </h2> */}
        <form onSubmit={handleSubmit}className="space-y-6">
          <h4 className="title">Forgot Password</h4>
      
      <i>Please enter the OTP with Ref. Id: <u>{referenceId}</u> to reset the password. It is valid for 5 minutes</i>
      <div className="mb-3">
        <input
        className="form-control"
          type="text"
          name="otp"
          id="otp"
          placeholder="Enter OTP"
          value={otp1}
          onChange={handleInputChange}
          maxLength={6} // Set a reasonable OTP length limit
          minLength={4} // Allow for shorter OTPs if needed
          required
        />
      </div>
      
      {errorMessage && <p>{errorMessage}</p>}
      <div className="mb-3">
        <input
          className="form-control"
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      <button type="submit" disabled={isSubmitting}className="btn btn-primary ms-1">
        {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
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
          type="button"
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

export default ForgotPasswordNew;
