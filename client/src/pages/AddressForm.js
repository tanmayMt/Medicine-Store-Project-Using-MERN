import { Layout } from 'antd';
import React, { useState } from 'react';

const AddressForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
  });
  const [errors, setErrors] = useState({}); // To store validation errors

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

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
  };

  return (
    <Layout>
            <form onSubmit={handleSubmit} className="address-form">
      <h2>Address Form</h2>
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <p className="error-message">{errors.name}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="addressLine1">Address Line 1:</label>
        <input
          type="text"
          id="addressLine1"
          name="addressLine1"
          value={formData.addressLine1}
          onChange={handleChange}
          className={errors.addressLine1 ? 'error' : ''}
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
      <button type="submit">Submit</button>
    </form>
    </Layout>

  );
};

export default AddressForm;

