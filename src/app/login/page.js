"use client"

import { useState } from "react"
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input"
import "react-phone-number-input/style.css"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Mail, User, Phone, Lock, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

const Alert = ({ message }) => (
  <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-4 rounded-lg shadow-md z-50 animate-fade-in-down">
    {message}
  </div>
)

const Login = () => {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
    country_code: "+91",
    password: "",
    loginMethod: "email",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone_number: value })
  }

  const handleTabChange = (method) => {
    setFormData({
      ...formData,
      loginMethod: method,
      username: "",
      email: "",
      phone_number: "",
    })
  }

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const payload = { password: formData.password }

    if (formData.loginMethod === "phone_number") {
      const phoneNumber = parsePhoneNumber(formData.phone_number)

      if (!phoneNumber) {
        setError("Invalid phone number.")
        setLoading(false)
        return
      }

      payload.phone_number = phoneNumber.nationalNumber // Send only number
      payload.country_code = `+${phoneNumber.countryCallingCode}` // Keep +91 in country_code
    } else {
      payload[formData.loginMethod] = formData[formData.loginMethod]
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}user/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || data.data || "Login failed")
      }

      login(data.data)
      router.push("/dashboard")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-sm rounded-xl mx-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Welcome Back</h2>
        {error && <Alert message={error} />}

        <div className="mb-6 flex space-x-2 border-b">
          <button
            className={`py-3 px-4 text-sm font-medium ${
              formData.loginMethod === "email"
                ? "border-b-2 border-purple-600 text-purple-700"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => handleTabChange("email")}
          >
            Email
          </button>
          <button
            className={`py-3 px-4 text-sm font-medium ${
              formData.loginMethod === "phone_number"
                ? "border-b-2 border-purple-600 text-purple-700"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => handleTabChange("phone_number")}
          >
            Phone
          </button>
          <button
            className={`py-3 px-4 text-sm font-medium ${
              formData.loginMethod === "username"
                ? "border-b-2 border-purple-600 text-purple-700"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => handleTabChange("username")}
          >
            Username
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {formData.loginMethod === "phone_number" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <PhoneInput
                  international
                  defaultCountry="IN"
                  value={formData.phone_number}
                  onChange={handlePhoneChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          ) : formData.loginMethod === "email" ? (
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
                  placeholder="Enter your username"
                />
              </div>
            </div>
          )}

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
                placeholder="Enter your password"
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
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-70"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Logging in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-purple-600 hover:text-purple-500">
              Sign up here
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login

