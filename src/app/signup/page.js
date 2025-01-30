"use client";

import React, { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Eye, EyeOff } from "lucide-react";

const Alert = ({ message }) => (
  <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-4 rounded-md shadow-md">
    {message}
  </div>
);

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    phone_number: "",
    first_name: "",
    last_name: "",
    country_code: "+91",
    signupMethod: "email",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phone_number: value }));
  };

  const handleTabChange = (method) => {
    setFormData((prev) => ({
      ...prev,
      signupMethod: method,
      email: "",
      phone_number: "",
    }));
  };

  const validateForm = () => {
    if (!formData.password || formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (formData.signupMethod === "email" && !formData.email.includes("@")) {
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

    const cleanedFormData = {
      ...formData,
      email: formData.signupMethod === "email" ? formData.email : null,
      phone_number: formData.signupMethod === "phone_number" ? formData.phone_number : null,
      country_code: formData.signupMethod === "phone_number" ? formData.country_code : null,
    };

    try {
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

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev); // ✅ Fix: Toggle function
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Signup</h2>

        {error && <Alert message={error} />}

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
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
            />
          </div>

          {formData.signupMethod === "email" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              />
            </div>
          )}

          {formData.signupMethod === "phone_number" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
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
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center"
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center"
              >
                {showConfirmPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            {loading ? "Signing Up..." : "Signup"}
          </button>
          <p className='mt-4 text-center text-sm'>Already have an account? <a href='/login' className='text-blue-500 hover:underline'>Login here</a></p>
        </form>
      </div>
    </div>
  );
}
