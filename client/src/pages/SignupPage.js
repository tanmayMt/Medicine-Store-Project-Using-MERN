import axios from 'axios';
import React, { useState } from 'react';
import { withRouter, useNavigate } from 'react-router-dom'
import { message } from "antd";
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
    if (formData.phone.length <10) {
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
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="/ecommerce.png"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create a New Account
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
      {/* Pre-populated email (optional) */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
          Email Address
        </label>
        <div className="mt-2">
        <input
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          type="email"
          name="email"
          id="email"
          value={localStorage.getItem("VerifiedEmail")}
          disabled
        />
        </div>

        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Name:</label>
        <input
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <span className="error" color='red'>{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">Phone Number:</label>
        <input
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          type="tel" // Consider using a library for phone number formatting
          name="phone"
          id="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        {errors.phone && <span className="error">{errors.error}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password:</label>
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

      <div className="form-group">
        <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">Confirm Password:</label>
        <input
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && (
          <span className="error">{errors.confirmPassword}</span>
        )}
      </div>
      <div>
               <button
                 type="submit"
                 onSubmit={"/login"}
                 className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
               >
                 Register
               </button>
             </div>
             <div>
             <button
          type="button"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          //disabled={isResendDisabled}
          onClick={handleClick}
        >
          Back
        </button>
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
    
  );
}

export default SignupPage;