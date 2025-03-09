"use client"

import { useState } from "react"
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input"
import "react-phone-number-input/style.css"
import { useAuth } from "@/context/AuthContext"
import { Mail, User, Lock, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

const Alert = ({ message }) => (
  <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-4 rounded-lg shadow-md z-50 animate-fade-in-down">
    {message}
  </div>
)

export default function Signup() {
  const { login } = useAuth()
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
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone_number: value })
  }

  const handleTabChange = (method) => {
    setFormData({
      ...formData,
      signupMethod: method,
      email: "",
      phone_number: "",
    })
  }

  const validateForm = () => {
    if (!formData.password || formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      return false
    }
    if (formData.signupMethod === "email" && !formData.email.includes("@")) {
      setError("Invalid email address")
      return false
    }
    if (formData.signupMethod === "phone_number" && (!formData.phone_number || formData.phone_number.length < 10)) {
      setError("Phone number should be at least 10 digits")
      return false
    }
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setError(null)

    const cleanedFormData = { ...formData }

    if (formData.signupMethod === "phone_number") {
      const phoneNumber = parsePhoneNumber(formData.phone_number)

      if (!phoneNumber) {
        setError("Invalid phone number.")
        setLoading(false)
        return
      }

      cleanedFormData.phone_number = phoneNumber.nationalNumber
      cleanedFormData.country_code = `+${phoneNumber.countryCallingCode}`
      cleanedFormData.email = null
    } else {
      cleanedFormData.phone_number = null
      cleanedFormData.country_code = null
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}user/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedFormData),
      })

      const data = await response.json()

      if (response.ok) {
        console.log("User signed up successfully:", data)
        login(data.data)
      } else {
        if (data?.data) {
          setError(data.data || "Something went wrong")
        } else if (data?.errors?.length > 0) {
          const errorMessage = data.errors.map((error) => error.message).join(", ")
          setError(errorMessage || "Something went wrong")
        } else {
          setError(data.message || "Something went wrong")
        }
      }
    } catch (error) {
      setError("Network error. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev)
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev)

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-sm rounded-xl mx-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create Your Account</h2>

        {error && <Alert message={error} />}

        <div className="mb-6 flex space-x-2 border-b">
          <button
            className={`py-3 px-4 text-sm font-medium ${
              formData.signupMethod === "email"
                ? "border-b-2 border-purple-600 text-purple-700"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => handleTabChange("email")}
          >
            Email Signup
          </button>
          <button
            className={`py-3 px-4 text-sm font-medium ${
              formData.signupMethod === "phone_number"
                ? "border-b-2 border-purple-600 text-purple-700"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => handleTabChange("phone_number")}
          >
            Phone Signup
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter first name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter last name"
              />
            </div>
          </div>

          {formData.signupMethod === "email" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <PhoneInput
                  international
                  defaultCountry="IN"
                  value={formData.phone_number}
                  onChange={handlePhoneChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Choose a username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters long</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the{" "}
              <a href="#" className="text-purple-600 hover:text-purple-500">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-purple-600 hover:text-purple-500">
                Privacy Policy
              </a>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-70"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-purple-600 hover:text-purple-500">
              Sign in here
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

