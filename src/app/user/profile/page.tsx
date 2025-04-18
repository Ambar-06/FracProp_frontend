"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
import PhoneInput, { parsePhoneNumber, getCountryCallingCode } from "react-phone-number-input"
import "react-phone-number-input/style.css"
import { User, Mail, Phone, Check, AlertCircle, X } from "lucide-react"

const Profile = () => {
  const [profileData, setProfileData] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({ phone_number: undefined, country_code: "" }) // Initialize phone_number as undefined
  const [successMessage, setSuccessMessage] = useState("")
  // Add these new state variables
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otp, setOtp] = useState("")
  const [otpError, setOtpError] = useState("")
  const [otpLoading, setOtpLoading] = useState(false)

  // Function to convert country calling code (+91) to ISO Alpha-2 code (IN)
  const getCountryFromCode = (code) => {
    try {
      return Object.keys(getCountryCallingCode).find((country) => `+${getCountryCallingCode(country)}` === code) || "IN" // Default to "IN" if conversion fails
    } catch (error) {
      return "IN" // Fallback
    }
  }

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}user/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 408) {
          localStorage.removeItem("token")
          window.location.href = "/login"
          throw new Error("Unauthorized")
        }
        return res.json()
      })
      .then((data) => {
        if (data.success) {
          setProfileData(data.data)

          // Format phone number correctly
          const fullPhoneNumber = data.data.country_code + data.data.phone_number

          setFormData({
            ...data.data,
            phone_number: fullPhoneNumber || undefined, // Ensure phone_number is undefined if empty
            country_code: getCountryFromCode(data.data.country_code), // Convert country code
          })
        } else {
          setError("Failed to fetch profile data.")
        }
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load profile data.")
        setLoading(false)
      })
  }, [])

  const handleEdit = () => setIsEditing(true)
  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      ...profileData,
      phone_number: profileData.country_code + profileData.phone_number || undefined, // Ensure phone_number is undefined if empty
      country_code: getCountryFromCode(profileData.country_code),
    })
    setSuccessMessage("")
    setError(null)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone_number: value || undefined }) // Ensure phone_number is undefined if empty
  }

  const handleVerifyEmail = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccessMessage("")

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}user/send-email-otp`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setSuccessMessage("OTP sent to your email. Please check your inbox.")
        setShowOtpModal(true)
      } else {
        setError(data.message || "Failed to send verification email. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Add this new function to handle OTP verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault()

    if (!otp || otp.length < 4) {
      setOtpError("Please enter a valid OTP")
      return
    }

    try {
      setOtpLoading(true)
      setOtpError("")

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}user/verify-email`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setSuccessMessage("Email verified successfully!")
        setShowOtpModal(false)
        setOtp("")

        // Update the profile data to reflect verified status
        setProfileData({
          ...profileData,
          is_email_verified: true,
        })

        setFormData({
          ...formData,
          is_email_verified: true,
        })
      } else {
        setOtpError(data.message || "Invalid OTP. Please try again.")
      }
    } catch (err) {
      setOtpError("An error occurred. Please try again.")
    } finally {
      setOtpLoading(false)
    }
  }

  // Add this function to close the OTP modal
  const closeOtpModal = () => {
    setShowOtpModal(false)
    setOtp("")
    setOtpError("")
  }

  const handleVerifyPhone = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}user/verify-phone`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })

      if (res.ok) {
        setSuccessMessage("Verification OTP sent! Please check your phone.")
      } else {
        setError("Failed to send verification OTP. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccessMessage("")

      const { phone_number, email, first_name, last_name } = formData

      // Validate phone number
      if (!phone_number) {
        setError("Please enter a valid phone number.")
        setLoading(false)
        return
      }

      const phoneNumber = parsePhoneNumber(phone_number)

      if (!phoneNumber) {
        setError("Invalid phone number.")
        setLoading(false)
        return
      }

      const country_code = `+${phoneNumber.countryCallingCode}`
      const phone = phoneNumber.nationalNumber

      const updatedData = { phone_number: phone, country_code, email, first_name, last_name }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}user/profile`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccessMessage("Profile updated successfully!")
        setIsEditing(false)
        setProfileData(data.data)
      } else {
        setError(data.errors ? data.errors.map((e) => e.message).join(", ") : data.data || "Failed to update profile.")
      }
    } catch (err) {
      setError("An error occurred while updating profile.")
    } finally {
      setLoading(false)
    }
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-purple-600 animate-spin mb-4"></div>
          <p className="text-gray-700">Loading profile data...</p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-28 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Your Profile</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Manage your personal information and account settings</p>
        </div>

        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center text-white text-xl font-bold mr-4">
                {formData?.first_name?.charAt(0) || <User size={24} />}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {formData?.first_name} {formData?.last_name}
                </h2>
                <p className="text-gray-500 text-sm">{formData?.username}</p>
              </div>
            </div>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
              >
                Edit Profile
              </button>
            ) : null}
          </div>

          {error && (
            <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="text-red-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start">
              <Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
              <p className="text-green-600 text-sm">{successMessage}</p>
            </div>
          )}

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData?.first_name || ""}
                    readOnly={!isEditing}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg focus:outline-none ${
                      !isEditing
                        ? "bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200"
                        : "border-gray-300 focus:ring-2 focus:ring-purple-500"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData?.last_name || ""}
                    readOnly={!isEditing}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg focus:outline-none ${
                      !isEditing
                        ? "bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200"
                        : "border-gray-300 focus:ring-2 focus:ring-purple-500"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData?.username || ""}
                    readOnly={true}
                    className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="flex items-center">
                    <div className="relative flex-grow">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="email"
                        name="email"
                        value={formData?.email || ""}
                        readOnly={!isEditing}
                        onChange={handleChange}
                        className={`w-full pl-10 p-3 border rounded-lg focus:outline-none ${
                          !isEditing
                            ? "bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200"
                            : "border-gray-300 focus:ring-2 focus:ring-purple-500"
                        }`}
                      />
                    </div>
                    {formData?.email && (
                      <div className="ml-2">
                        {formData?.is_email_verified ? (
                          <div className="flex items-center text-green-500 bg-green-50 px-2 py-1 rounded-md">
                            <Check size={14} className="mr-1" />
                            <span className="text-xs">Verified</span>
                          </div>
                        ) : (
                          <button
                            onClick={handleVerifyEmail}
                            type="button"
                            className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition-colors"
                          >
                            Verify
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <div className="flex items-center">
                    <div className="relative flex-grow">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <PhoneInput
                        international
                        defaultCountry={formData?.country_code}
                        value={formData?.phone_number}
                        onChange={handlePhoneChange}
                        disabled={!isEditing}
                        placeholder="Enter phone number" // Add a placeholder
                        className={`w-full pl-10 p-3 border rounded-lg focus:outline-none ${
                          !isEditing
                            ? "bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200"
                            : "border-gray-300 focus:ring-2 focus:ring-purple-500"
                        }`}
                      />
                    </div>
                    {formData?.phone_number && (
                      <div className="ml-2">
                        {formData?.is_phone_verified ? (
                          <div className="flex items-center text-green-500 bg-green-50 px-2 py-1 rounded-md">
                            <Check size={14} className="mr-1" />
                            <span className="text-xs">Verified</span>
                          </div>
                        ) : (
                          <button
                            onClick={handleVerifyPhone}
                            type="button"
                            className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition-colors"
                          >
                            Verify
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${formData?.is_active ? "bg-green-500" : "bg-red-500"}`}
                    ></div>
                    <span className="text-gray-700">{formData?.is_active ? "Active" : "Inactive"}</span>
                  </div>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end mt-8 space-x-4">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <button onClick={closeOtpModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-4">Verify Your Email</h3>
            <p className="text-gray-600 mb-6">Please enter the verification code sent to your email address.</p>

            {otpError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{otpError}</div>
            )}

            <form onSubmit={handleVerifyOtp}>
              <div className="mb-4">
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  maxLength={6}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeOtpModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={otpLoading}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {otpLoading ? "Verifying..." : "Verify"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile