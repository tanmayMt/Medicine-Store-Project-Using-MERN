import axios from 'axios';
import React, { useState } from 'react';
import { withRouter, useNavigate } from 'react-router-dom'
import { message } from "antd";
import Layout from '../components/Layout/Layout';
import toast from 'react-hot-toast';
function SignupPage() {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '', // Pre-populated email (optional)
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({}); // To store validation errors

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    // Optional: Basic validation on change (can be improved)
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value.length === 0 ? `${name} is required` : '',
    }));
  };

  const handleSubmit = async(event) => {
    event.preventDefault();

    // More robust validation before submitting (consider using a library)
    let newErrors = {};
    // if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    //   newErrors.email = 'Invalid email address';
    // }
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    if (formData.phone.length < 10) {
        toast.error("Phone number should be of 10 digits");
      newErrors.phone = 'Phone number should be of 10 digits';
    }
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log(formData);
      // Handle form submission logic here (e.g., send data to backend)
      const res = await axios.post("/api/v1/auth/register", {
        headers:{
        Authorization : "Bearer "+localStorage.getItem("VerifiedEmailToken"),
      },formData});
      if(res.data.success)
      {
        localStorage.removeItem("VerifiedEmailToken");
        localStorage.removeItem("VerifiedEmail");
        localStorage.setItem("LoginToken", res.data.logintoken);
        message.success(res.data.message)
        navigate("/")
      }
      else{
        message.error(res.data.message)
        setFormData({
          email: '', // Pre-populated email (optional)
          name: '',
          phone: '',
          password: '',
          confirmPassword: '',
        });
      }
      // Clear form after successful submission
    }
  };
  const handleClick = () => {
    navigate('/login');
  };

  return (
    <Layout title="Create New Account">
    <div className="form-container" style={{ minHeight: "90vh" }}>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            // className="mx-auto h-10 w-auto"
            // src="/ecommerce.png"
            // alt="Your Company"
          />

        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h4 className="title">
            Create a New Account
          </h4>
      {/* Pre-populated email (optional) */}
      <div className="mt-2" >

        <input 
          className="form-control"          type="email"
          name="email"
          id="email"
          value={localStorage.getItem("VerifiedEmail")}
          disabled
        />
        <br></br>

        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div>
        {/* <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Name:</label> */}
        <input
        className="form-control"
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Enter Your Name"
        /><br></br>
        {errors.name && <span className="error" color='red'>{errors.name}</span>}
      </div>

      <div className="mb-3">
        {/* <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">Phone Number:</label> */}
        <input
          className="form-control"
          type="tel" // Consider using a library for phone number formatting
          name="phone"
          id="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone Your Number"
        />
        {errors.phone && <span className="error" color= 'red'>{errors.error}</span>}
      </div>

      <div className="mb-3">
        {/* Password: */}
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

      <div className="mb-3">
        {/* Confirm Password: */}
        <input
          className="form-control"
          type="password"
          name="confirmPassword"
           placeholder="Confirm Your Password"
          id="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && (
          <span className="error">{errors.confirmPassword}</span>
        )}
      </div>
      <div>
        <div>
                         <button
                className="btn btn-primary ms-1"
                 type="submit"
                 onSubmit={"/login"}
                 
               >
                 Register
               </button><br></br>
        </div><br></br>
        <div>
                       <button
          type="button"
           className="btn btn-primary ms-1"
          //disabled={isResendDisabled}
          onClick={handleClick}
        >
          Back
        </button>
        </div>
        </div>


               

             

    </form>
    {/* <p className="mt-10 text-center text-sm text-gray-500">
            Already a Member?{' '}
            <Link
              to="/login"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Log In
            </Link>
    </p> */}
    
  </div>
 </div>
    </Layout>
  );
}

export default SignupPage;