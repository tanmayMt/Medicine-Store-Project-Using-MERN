// import { Layout } from 'antd';

import { useNavigate } from "react-router-dom";

import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import axios from "axios";

const AddressForm = () => {
 //context
  const [auth, setAuth] = useAuth();
  //state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  //get user data
  useEffect(() => {
    const { email, name, phone, address } = auth?.user;
    setName(name);
    setPhone(phone);
    setEmail(email);
    setAddress(address);
  }, [auth?.user]);

  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!formData.name) {
      validationErrors.name = 'Please enter your name.';
    }
    if (!formData.addressLine1) {
      validationErrors.addressLine1 = 'Please enter your address.';
    }
    // Add more validation checks as needed (e.g., postal code format)

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Form is valid, submit data (replace with your logic)
      console.log('Form submitted:', formData);
    }
    try {
      const { data } = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/profile`, {
        name,
        email,
        password,
        phone,
        address,
      });
      if (data?.errro) {
        toast.error(data?.error);
      } else {
        setAuth({ ...auth, user: data?.updatedUser });
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success("Profile Updated Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };


  const [formData, setFormData] = useState({
    name: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
  });
  const [errors, setErrors] = useState({}); // To store validation errors
  const navigate = useNavigate();
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };


  return (
    <Layout>
      <form onSubmit={handleSubmit} className="address-form">
        {/* <div className="col-md-3">
            <UserMenu />
          </div> */}
      <h2>Address Form</h2>

      <div className="form-group">
        <label htmlFor="addressLine1">Address Line 1:</label>
        {/* <input
          type="text"
          id="addressLine1"
          name="addressLine1"
          // value={formData.addressLine1}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={errors.addressLine1 ? 'error' : ''}
        /> */}
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Enter Your Address"
                  />
        {errors.addressLine1 && (
          <p className="error-message">{errors.addressLine1}</p>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="addressLine2">Address Line 2 (Optional):</label>
        <input
          type="text"
          id="addressLine2"
          name="addressLine2"
          value={formData.addressLine2}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="city">City:</label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="state">State:</label>
        <input
          type="text"
          id="state"
          name="state"
          value={formData.state}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="postalCode">Postal Code:</label>
        <input
          type="text"
          id="postalCode"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
        />
      </div>
      <button
       type="submit"
        onClick={() => navigate("/dashboard/user")}
      >Submit</button>
    </form>
    </Layout>

  );
};

export default AddressForm;

