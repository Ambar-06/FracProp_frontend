'use client';

import React, { useState } from "react";
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const Alert = ({ message }) => (
  <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-4 rounded-md shadow-md">
    {message}
  </div>
);

const Login = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
    country_code: "+91",
    password: "",
    loginMethod: "email",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone_number: value });
  };

  const handleTabChange = (method) => {
    setFormData({
      ...formData,
      loginMethod: method,
      username: "",
      email: "",
      phone_number: "",
    });
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let payload = { password: formData.password };

    if (formData.loginMethod === "phone_number") {
      const phoneNumber = parsePhoneNumber(formData.phone_number);

      if (!phoneNumber) {
        setError("Invalid phone number.");
        setLoading(false);
        return;
      }

      payload.phone_number = phoneNumber.nationalNumber;  // Send only number
      payload.country_code = `+${phoneNumber.countryCallingCode}`;  // Keep +91 in country_code
    } else {
      payload[formData.loginMethod] = formData[formData.loginMethod];
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}user/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.data || "Login failed");
      }

      login(data.data);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <Alert message={error} />}

        <div className="mb-4 flex space-x-4 border-b">
          <button
            className={`py-2 px-4 ${formData.loginMethod === "email" ? "border-b-2 border-blue-500" : ""}`}
            onClick={() => handleTabChange("email")}
          >
            Email Login
          </button>
          <button
            className={`py-2 px-4 ${formData.loginMethod === "phone_number" ? "border-b-2 border-blue-500" : ""}`}
            onClick={() => handleTabChange("phone_number")}
          >
            Phone Login
          </button>
          <button
            className={`py-2 px-4 ${formData.loginMethod === "username" ? "border-b-2 border-blue-500" : ""}`}
            onClick={() => handleTabChange("username")}
          >
            Username Login
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {formData.loginMethod === "phone_number" ? (
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
          ) : (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">{formData.loginMethod.charAt(0).toUpperCase() + formData.loginMethod.slice(1)}</label>
              <input
                type="text"
                name={formData.loginMethod}
                value={formData[formData.loginMethod]}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              />
            </div>
          )}

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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign up here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
