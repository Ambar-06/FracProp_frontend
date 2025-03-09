"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
import PhoneInput, { parsePhoneNumber, getCountryCallingCode } from "react-phone-number-input"
import "react-phone-number-input/style.css"
import { User, Mail, Phone, Check, AlertCircle } from "lucide-react"

const Profile = () => {
  const [profileData, setProfileData] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({ phone_number: "", country_code: "" })
  const [successMessage, setSuccessMessage] = useState("")

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
            phone_number: fullPhoneNumber,
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
      phone_number: profileData.country_code + profileData.phone_number,
      country_code: getCountryFromCode(profileData.country_code),
    })
    setSuccessMessage("")
    setError(null)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone_number: value })
  }

  const handleVerifyEmail = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}user/verify-email`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })

      if (res.ok) {
        setSuccessMessage("Verification email sent! Please check your inbox.")
      } else {
        setError("Failed to send verification email. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
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
    </div>
  )
}

export default Profile

