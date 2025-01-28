'use client';

import React, { useState } from "react";
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

const Alert = ({ message }) => {
  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-4 rounded-md shadow-md">
      {message}
    </div>
  );
};

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    phone_number: "",
    first_name: "",
    last_name: "",
    country_code: "+91", // Default Indian country code
    signupMethod: "email", // Default signup method
  });
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      phone_number: value,
    }));
  };

  const handleTabChange = (method) => {
    setFormData((prev) => ({
      ...prev,
      signupMethod: method,
      email: "", // Clear email if switching to phone signup
      phone_number: "", // Clear phone number if switching to email signup
    }));
  };

  const validateForm = () => {
    if (!formData.password || formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (formData.signupMethod === "email" && !formData.email.includes('@')) {
      setError("Invalid email address");
      return false;
    }
    if (formData.signupMethod === "phone_number" && formData.phone_number.length < 10) {
      setError("Phone number should be at least 10 digits");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    setLoading(true);
    setError(null);
  
    // Prepare form data
    const cleanedFormData = {
      ...formData,
      email: formData.signupMethod === "email" ? formData.email : null,
      phone_number: formData.signupMethod === "phone_number" ? formData.phone_number : null,
      country_code: formData.signupMethod === "phone_number" ? formData.country_code : null,
    };
  
    try {
      console.log(process.env.NEXT_PUBLIC_BACKEND_BASE_URL, "))))))")
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}user/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedFormData),
      });

      const data = await response.json();
  
      if (response.ok) {
        console.log("User signed up successfully:", data);
      } else {
        // Handle error based on the response structure
        if (data?.data) {
          setError(data.data || "Something went wrong");
        } else if (data?.errors && data.errors.length > 0) {
          // Assuming the backend sends an error array with detailed messages
          const errorMessage = data.errors.map((error) => error.message).join(', ');
          setError(errorMessage || "Something went wrong");
        } else {
          setError(data.message || "Something went wrong");
        }
      }
    } catch (error) {
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Signup</h2>
        
        {/* Display error alert */}
        {error && <Alert message={error} />}
        
        {/* Tab navigation for email/phone signup */}
        <div className="mb-4 flex space-x-4 border-b">
          <button
            className={`py-2 px-4 ${formData.signupMethod === "email" ? "border-b-2 border-blue-500" : ""}`}
            onClick={() => handleTabChange("email")}
          >
            Email Signup
          </button>
          <button
            className={`py-2 px-4 ${formData.signupMethod === "phone_number" ? "border-b-2 border-blue-500" : ""}`}
            onClick={() => handleTabChange("phone_number")}
          >
            Phone Number Signup
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Common Fields */}
          <div className="mb-4">
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
            />
          </div>
          {/* Conditional Fields */}
          {formData.signupMethod === "email" && (
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              />
            </div>
          )}

          {formData.signupMethod === "phone_number" && (
            <div className="mb-4">
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <PhoneInput
                international
                defaultCountry="IN"
                value={formData.phone_number}
                onChange={handlePhoneChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              />
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="confirm_password"
              id="confirm_password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            {loading ? "Signing Up..." : "Signup"}
          </button>
        </form>
      </div>
    </div>
  );
}
