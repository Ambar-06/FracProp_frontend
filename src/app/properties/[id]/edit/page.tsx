"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Navbar from "@/components/Navbar"
import {
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  Home,
  Building,
  DollarSign,
  MapPin,
  X,
  Image,
  Info,
  AlertCircle,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"

const steps = ["Property Details", "Specifications", "Valuation & Other Details", "Amenities", "Review & Submit"]

const EditProperty = () => {
  const { user } = useAuth()
  const { id } = useParams()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pin_code: "",
    description: "",
    type: "",
    number_of_floors: "",
    number_of_rooms: "",
    return_type: "",
    govt_allotted_property_id: "",
    built_area_in_sqft: "",
    area_in_sqft: "",
    latitude: "",
    longitude: "",
    valuation: "",
    has_loan: false,
    investment_lock_in_period_in_months: "",
    other_details: {
      construction_age_in_years: "",
      building_health: "",
    },
    amenities: {
      school: { available: false, distance_in_km: 0 },
      hospital: { available: false, distance_in_km: 0 },
      shopping_mall: { available: false, distance_in_km: 0 },
      park: { available: false, distance_in_km: 0 },
    },
    property_images: [],
    delete_images: [],
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [newImages, setNewImages] = useState([]) // For tracking newly uploaded images

  // Step icons
  const stepIcons = [
    <Home key="home" className="w-5 h-5" />,
    <Building key="building" className="w-5 h-5" />,
    <DollarSign key="dollar" className="w-5 h-5" />,
    <MapPin key="map" className="w-5 h-5" />,
    <CheckCircle key="check" className="w-5 h-5" />,
  ]

  useEffect(() => {
    if (id) {
      fetchPropertyData()
    }
  }, [id])

  const fetchPropertyData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}properties/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!res.ok) {
        throw new Error("Failed to fetch property data")
      }

      const data = await res.json()

      setFormData({
        ...data.data,
        delete_images: [], // Initialize delete_images in formData
        amenities: data.data.amenities || {
          school: { available: false, distance_in_km: 0 },
          hospital: { available: false, distance_in_km: 0 },
          shopping_mall: { available: false, distance_in_km: 0 },
          park: { available: false, distance_in_km: 0 },
        }
      })
    } catch (error) {
      console.error("Error fetching property:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    // Clear error for this field when user starts typing
    setFormErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }))

    // Check if the field is nested (e.g., "other_details.building_health")
    if (name.includes(".")) {
      const [parent, child] = name.split(".") // Split into parent and child keys
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent], // Preserve other fields in the parent object
          [child]: value, // Update the nested field
        },
      }))
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked, // Use the `checked` property for checkboxes
      }))
    } else {
      // Handle top-level fields
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const validateStep = () => {
    const errors = {}
    const requiredFields = {
      0: ["name", "address", "city", "state", "country", "pin_code", "description"],
      1: [
        "type",
        "number_of_floors",
        "number_of_rooms",
        "return_type",
        "govt_allotted_property_id",
        "built_area_in_sqft",
        "area_in_sqft",
        "latitude",
        "longitude",
      ],
      2: [
        "valuation",
        "investment_lock_in_period_in_months",
        "other_details.construction_age_in_years",
        "other_details.building_health",
      ],
      3: [],
    }

    if (requiredFields[step]) {
      requiredFields[step].forEach((field) => {
        if (field.includes(".")) {
          const [parent, child] = field.split(".")
          if (!formData[parent]?.[child]) {
            errors[field] = "This field is required"
          }
        } else if (!formData[field]) {
          errors[field] = "This field is required"
        }
      })
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const isStepValid = () => {
    const requiredFields = {
      0: ["name", "address", "city", "state", "country", "pin_code", "description"],
      1: [
        "type",
        "number_of_floors",
        "number_of_rooms",
        "return_type",
        "govt_allotted_property_id",
        "built_area_in_sqft",
        "area_in_sqft",
        "latitude",
        "longitude",
      ],
      2: [
        "valuation",
        "investment_lock_in_period_in_months",
        "other_details.construction_age_in_years",
        "other_details.building_health",
      ],
      3: ["amenities.school", "amenities.hospital", "amenities.park", "amenities.shopping_mall"],
    }
    if (requiredFields[step]) {
      return requiredFields[step].every((field) => {
        if (field === "has_loan") {
          return typeof formData.has_loan === "boolean"
        }
        if (field.includes(".")) {
          const [parent, child] = field.split(".")
          return formData[parent]?.[child] !== "" && formData[parent]?.[child] !== undefined
        }
        return formData[field] !== "" && formData[field] !== undefined
      })
    }
    return true
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      const formDataToSend = new FormData()

      // Append other form data
      Object.keys(formData).forEach((key) => {
        if (key === "property_images" && formData[key]) {
          const files = Array.isArray(formData[key]) ? formData[key] : [formData[key]]
          files.forEach((file) => {
            if (file instanceof File) {
              formDataToSend.append("property_images", file)
            }
          })
        } else if (key === "delete_images" && formData[key]) {
          // Send delete_images as a JSON-encoded list
          formDataToSend.append("delete_images", JSON.stringify(formData[key]))
        } else if (typeof formData[key] === "object") {
          formDataToSend.append(key, JSON.stringify(formData[key]))
        } else {
          formDataToSend.append(key, formData[key])
        }
      })

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}properties/${id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      })

      if (res.ok) {
        alert("Property updated successfully!")
        router.push("/properties")
      } else {
        const data = await res.json()
        alert(data.message || "Failed to update property.")
      }
    } catch (error) {
      console.error("Error updating property:", error)
      alert("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const nextStep = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1)
      window.scrollTo(0, 0)
    } else {
      const button = document.getElementById("next-button")
      if (button) {
        button.classList.add("animate-shake")
        setTimeout(() => button.classList.remove("animate-shake"), 500)
      }
    }
  }

  const prevStep = () => {
    setStep((prev) => prev - 1)
    window.scrollTo(0, 0)
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)

    // Create preview URLs for the new images
    const newPreviewImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))

    setNewImages((prev) => [...prev, ...newPreviewImages])

    setFormData((prev) => ({
      ...prev,
      property_images: [...prev.property_images, ...files],
    }))
  }

  const handleDeleteImage = (index) => {
    const imageToDelete = formData.property_images[index]

    // If the image is a URL (string), add it to the deleted_images array
    if (typeof imageToDelete === "string") {
      setFormData((prev) => ({
        ...prev,
        delete_images: [...prev.delete_images, imageToDelete], // Ensure delete_images is an array
      }))
    }

    // Remove the image from the property_images array
    const updatedImages = formData.property_images.filter((_, i) => i !== index)
    setFormData((prev) => ({
      ...prev,
      property_images: updatedImages,
    }))

    // Also remove from newImages if it's a newly added image
    if (newImages.length > 0) {
      setNewImages((prev) => prev.filter((_, i) => i !== index - (formData.property_images.length - newImages.length)))
    }
  }

  const renderFieldError = (fieldName) => {
    return formErrors[fieldName] ? (
      <p className="text-red-500 text-sm mt-1 flex items-center">
        <AlertCircle size={14} className="mr-1" /> {formErrors[fieldName]}
      </p>
    ) : null
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 relative">
              <div className="absolute top-0 right-0 bottom-0 left-0 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"></div>
            </div>
            <p className="text-gray-700 mt-4 text-lg font-medium">Loading property details...</p>
            <p className="text-gray-500 text-sm mt-2">Please wait while we fetch your property information</p>
          </div>
        </div>
      </div>
    )

  if (!formData)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center">
            <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Property Not Found</h2>
            <p className="text-gray-600 mb-6">
              We couldn't find the property you're looking for. It may have been removed or you don't have permission to
              view it.
            </p>
          </div>
          <button
            onClick={() => router.push("/properties")}
            className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-all"
          >
            Back to Properties
          </button>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-28 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Edit Property</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Update your property details to keep information accurate and up-to-date.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-12 relative">
          <div className="flex justify-between items-center">
            {steps.map((label, index) => (
              <div key={index} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                    index < step
                      ? "bg-green-500 text-white"
                      : index === step
                        ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white ring-4 ring-purple-100"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {stepIcons[index]}
                </div>
                <span className={`text-xs mt-2 font-medium ${index <= step ? "text-gray-900" : "text-gray-500"}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          {/* Progress lines */}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 -z-0"></div>
          <div
            className="absolute top-6 left-0 h-0.5 bg-green-500 transition-all duration-500 -z-0"
            style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>

        {/* Form Container */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl">
          {/* Step Content */}
          {step === 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-gray-700 font-medium block">
                    Property Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name"
                    placeholder="Enter property name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full border ${formErrors.name ? "border-red-300" : "border-gray-200"} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                    required
                  />
                  {renderFieldError("name")}
                </div>
                <div className="space-y-1">
                  <label className="text-gray-700 font-medium block">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="address"
                    placeholder="Enter full address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full border ${formErrors.address ? "border-red-300" : "border-gray-200"} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                    required
                  />
                  {renderFieldError("address")}
                </div>
                <div className="space-y-1">
                  <label className="text-gray-700 font-medium block">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="city"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full border ${formErrors.city ? "border-red-300" : "border-gray-200"} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${user?.is_staff && !user?.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`}
                    readOnly={user?.is_staff && !user?.is_admin}
                  />
                  {renderFieldError("city")}
                  {user?.is_staff && !user?.is_admin && (
                    <p className="text-amber-600 text-xs mt-1 flex items-center">
                      <Info size={12} className="mr-1" /> Only admins can edit this field
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-gray-700 font-medium block">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="state"
                    placeholder="Enter state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`w-full border ${formErrors.state ? "border-red-300" : "border-gray-200"} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${user?.is_staff && !user?.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`}
                    readOnly={user?.is_staff && !user?.is_admin}
                  />
                  {renderFieldError("state")}
                  {user?.is_staff && !user?.is_admin && (
                    <p className="text-amber-600 text-xs mt-1 flex items-center">
                      <Info size={12} className="mr-1" /> Only admins can edit this field
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-gray-700 font-medium block">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="country"
                    placeholder="Enter country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full border ${formErrors.country ? "border-red-300" : "border-gray-200"} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${user?.is_staff && !user?.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`}
                    readOnly={user?.is_staff && !user?.is_admin}
                  />
                  {renderFieldError("country")}
                  {user?.is_staff && !user?.is_admin && (
                    <p className="text-amber-600 text-xs mt-1 flex items-center">
                      <Info size={12} className="mr-1" /> Only admins can edit this field
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-gray-700 font-medium block">
                    Pin Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="pin_code"
                    placeholder="Enter pin code"
                    value={formData.pin_code}
                    onChange={handleChange}
                    className={`w-full border ${formErrors.pin_code ? "border-red-300" : "border-gray-200"} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${user?.is_staff && !user?.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`}
                    readOnly={user?.is_staff && !user?.is_admin}
                  />
                  {renderFieldError("pin_code")}
                  {user?.is_staff && !user?.is_admin && (
                    <p className="text-amber-600 text-xs mt-1 flex items-center">
                      <Info size={12} className="mr-1" /> Only admins can edit this field
                    </p>
                  )}
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-gray-700 font-medium block">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    placeholder="Provide a detailed description of your property"
                    value={formData.description}
                    onChange={handleChange}
                    className={`w-full border ${formErrors.description ? "border-red-300" : "border-gray-200"} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all min-h-[120px]`}
                    required
                  ></textarea>
                  {renderFieldError("description")}
                  <p className="text-gray-500 text-sm mt-1 flex items-center">
                    <Info size={14} className="mr-1" /> Include key features, unique selling points, and neighborhood
                    information
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Property Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-gray-700 font-medium block">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className={`w-full border ${formErrors.type ? "border-red-300" : "border-gray-200"} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all bg-white ${user?.is_staff && !user?.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`}
                    disabled={user?.is_staff && !user?.is_admin}
                  >
                    <option value="" disabled hidden>
                      Select property type
                    </option>
                    <option value="COMMERCIAL">Commercial</option>
                    <option value="RESIDENTIAL">Residential</option>
                    <option value="INDUSTRIAL">Industrial</option>
                    <option value="AGRICULTURAL">Agricultural</option>
                    <option value="OTHER">Other</option>
                  </select>
                  {renderFieldError("type")}
                  {user?.is_staff && !user?.is_admin && (
                    <p className="text-amber-600 text-xs mt-1 flex items-center">
                      <Info size={12} className="mr-1" /> Only admins can edit this field
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-gray-700 font-medium block">
                    Number of Floors <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="number_of_floors"
                    type="number"
                    min="1"
                    placeholder="Enter number of floors"
                    value={formData.number_of_floors}
                    onChange={handleChange}
                    className={`w-full border ${formErrors.number_of_floors ? "border-red-300" : "border-gray-200"} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${user?.is_staff && !user?.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`}
                    readOnly={user?.is_staff && !user?.is_admin}
                  />
                  {renderFieldError("number_of_floors")}
                  {user?.is_staff && !user?.is_admin && (
                    <p className="text-amber-600 text-xs mt-1 flex items-center">
                      <Info size={12} className="mr-1" /> Only admins can edit this field
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-gray-700 font-medium block">
                    Number of Rooms <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="number_of_rooms"
                    type="number"
                    min="1"
                    placeholder="Enter number of rooms"
                    value={formData.number_of_rooms}
                    onChange={handleChange}
                    className={`w-full border ${formErrors.number_of_rooms ? "border-red-300" : "border-gray-200"} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${user?.is_staff && !user?.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`}
                    readOnly={user?.is_staff && !user?.is_admin}
                  />
                  {renderFieldError("number_of_rooms")}
                  {user?.is_staff && !user?.is_admin && (
                    <p className="text-amber-600 text-xs mt-1 flex items-center">
                      <Info size={12} className="mr-1" /> Only admins can edit this field
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-gray-700 font-medium block">
                    Return Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="return_type"
                    value={formData.return_type}
                    onChange={handleChange}
                    className={`w-full border ${formErrors.return_type ? "border-red-300" : "border-gray-200"} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all bg-white ${user?.is_staff && !user?.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`}
                    disabled={user?.is_staff && !user?.is_admin}
                  >
                    <option value="" disabled hidden>
                      Select return type
                    </option>
                    <option value="RENT">Rent</option>
                    <option value="APPRECIATION">Appreciation</option>
                    <option value="OTHER">Other</option>
                  </select>
                  {renderFieldError("return_type")}
                  {user?.is_staff && !user?.is_admin && (
                    <p className="text-amber-600 text-xs mt-1 flex items-center">
                      <Info size={12} className="mr-1" /> Only admins can edit this field
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-gray-700 font-medium block">
                    Government Property ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="govt_allotted_property_id"
                    placeholder="Enter government property ID"
                    value={formData.govt_allotted_property_id}
                    onChange={handleChange}
                    className={`w-full border ${formErrors.govt_allotted_property_id ? "border-red-300" : "border-gray-200"} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${user?.is_staff && !user?.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`}
                    readOnly={user?.is_staff && !user?.is_admin}
                  />
                  {renderFieldError("govt_allotted_property_id")}
                  {user?.is_staff && !user?.is_admin && (
                    <p className="text-amber-600 text-xs mt-1 flex items-center">
                      <Info size={12} className="mr-1" /> Only admins can edit this field
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-gray-700 font-medium block">
                    Built Area in Sqft <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="built_area_in_sqft"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Enter built area in sqft"
                    value={formData.built_area_in_sqft}
                    onChange={handleChange}
                    className={`w-full border ${formErrors.built_area_in_sqft ? "border-red-300" : "border-gray-200"} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${user?.is_staff && !user?.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`}
                    readOnly={user?.is_staff && !user?.is_admin}
                  />
                  {renderFieldError("built_area_in_sqft")}
                  {user?.is_staff && !user?.is_admin && (
                    <p className="text-amber-600 text-xs mt-1 flex items-center">
                      <Info size={12} className="mr-1" /> Only admins can edit this field
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-gray-700 font-medium block">
                    Area in Sqft <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="area_in_sqft"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Enter total area in sqft"
                    value={formData.area_in_sqft}
                    onChange={handleChange}
                    className={`w-full border ${formErrors.area_in_sqft ? "border-red-300" : "border-gray-200"} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${user?.is_staff && !user?.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`}
                    readOnly={user?.is_staff && !user?.is_admin}
                  />
                  {renderFieldError("area_in_sqft")}
                  {user?.is_staff && !user?.is_admin && (
                    <p className="text-amber-600 text-xs mt-1 flex items-center">
                      <Info size={12} className="mr-1" /> Only admins can edit this field
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-gray-700 font-medium block">
                    Latitude <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="latitude"
                    type="number"
                    step="0.000001"
                    placeholder="Enter latitude coordinates"
                    value={formData.latitude}
                    onChange={handleChange}
                    className={`w-full border ${formErrors.latitude ? "border-red-300" : "border-gray-200"} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                  />
                  {renderFieldError("latitude")}
                </div>
                <div className="space-y-1">
                  <label className="text-gray-700 font-medium block">
                    Longitude <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="longitude"
                    type="number"
                    step="0.000001"
                    placeholder="Enter longitude coordinates"
                    value={formData.longitude}
                    onChange={handleChange}
                    className={`w-full border ${formErrors.longitude ? "border-red-300" : "border-gray-200"} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                  />
                  {renderFieldError("longitude")}
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-gray-700 font-medium block mb-2">Property Images</label>
                  <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center transition-all hover:border-purple-300 bg-gray-50 hover:bg-gray-100">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">Drag and drop files here, or click to browse</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Supported formats: JPG, PNG, GIF (Max size: 5MB per image)
                    </p>
                  </div>

                  {/* Display Uploaded Images */}
                  {formData.property_images && formData.property_images.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-gray-700 font-medium mb-3">Property Images</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {formData.property_images.map((image, index) => (
                          <div
                            key={index}
                            className="relative group rounded-lg overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition-all"
                          >
                            {typeof image === "string" ? (
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`property-image-${index}`}
                                className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            ) : image instanceof File || image instanceof Blob ? (
                              <img
                                src={URL.createObjectURL(image) || "/placeholder.svg"}
                                alt={`property-image-${index}`}
                                className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-40 flex items-center justify-center bg-gray-100">
                                <Image className="text-gray-400" size={32} />
                                <p className="text-center text-gray-500 ml-2">Invalid image</p>
                              </div>
                            )}
                            {/* Delete button with hover effect */}
                            {(user?.is_admin || typeof image !== "string") && (
                              <button
                                onClick={() => handleDeleteImage(index)}
                                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md hover:bg-red-700"
                                aria-label="Delete image"
                              >
                                <X size={14} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Valuation & Other Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-gray-700 font-medium block">
                    Property Valuation <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      name="valuation"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Enter property valuation"
                      value={formData.valuation}
                      onChange={handleChange}
                      className={`w-full border ${formErrors.valuation ? "border-red-300" : "border-gray-200"} p-3 pl-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${user?.is_staff && !user?.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      readOnly={user?.is_staff && !user?.is_admin}
                    />
                  </div>
                  {renderFieldError("valuation")}
                  {user?.is_staff && !user?.is_admin && (
                    <p className="text-amber-600 text-xs mt-1 flex items-center">
                      <Info size={12} className="mr-1" /> Only admins can edit this field
                    </p>
                  )}
                </div>
                <div className="space-y-1 flex items-center">
                  <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200 w-full cursor-pointer hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      name="has_loan"
                      checked={formData.has_loan || false}
                      onChange={handleChange}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <div>
                      <span className="text-gray-700 font-medium">Has Loan</span>
                      <p className="text-gray-500 text-xs mt-1">Check if the property has an existing loan</p>
                    </div>
                  </label>
                </div>
                <div className="space-y-1">
                  <label className="text-gray-700 font-medium block">
                    Lock-in Period for Investments (months) <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="investment_lock_in_period_in_months"
                    type="number"
                    min="0"
                    placeholder="Enter lock-in period in months"
                    value={formData.investment_lock_in_period_in_months}
                    onChange={handleChange}
                    className={`w-full border ${formErrors.investment_lock_in_period_in_months ? "border-red-300" : "border-gray-200"} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                  />
                  {renderFieldError("investment_lock_in_period_in_months")}
                </div>
                <div className="space-y-1">
                  <label className="text-gray-700 font-medium block">
                    Construction Age in Years <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="other_details.construction_age_in_years"
                    type="number"
                    min="0"
                    placeholder="Enter construction age in years"
                    value={formData.other_details.construction_age_in_years}
                    onChange={handleChange}
                    className={`w-full border ${formErrors["other_details.construction_age_in_years"] ? "border-red-300" : "border-gray-200"} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                  />
                  {renderFieldError("other_details.construction_age_in_years")}
                </div>
                <div className="space-y-1">
                  <label className="text-gray-700 font-medium block">
                    Building Health <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="other_details.building_health"
                    value={formData.other_details.building_health}
                    onChange={handleChange}
                    className={`w-full border ${formErrors["other_details.building_health"] ? "border-red-300" : "border-gray-200"} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all bg-white`}
                  >
                    <option value="" disabled hidden>
                      Select building health
                    </option>
                    <option value="EXCELLENT">Excellent</option>
                    <option value="GOOD">Good</option>
                    <option value="AVERAGE">Average</option>
                    <option value="BAD">Bad</option>
                  </select>
                  {renderFieldError("other_details.building_health")}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Nearby Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.amenities && Object.keys(formData.amenities).map((amenity) => (
                // {Object.keys(formData.amenities).map((amenity) => (
                  <div
                    key={amenity}
                    className="bg-gray-50 p-5 rounded-lg border border-gray-200 hover:border-purple-200 transition-all"
                  >
                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        name={`amenities.${amenity}.available`}
                        checked={formData.amenities[amenity].available}
                        onChange={(e) => {
                          const isChecked = e.target.checked
                          setFormData((prev) => ({
                            ...prev,
                            amenities: {
                              ...prev.amenities,
                              [amenity]: {
                                available: isChecked,
                                distance_in_km: isChecked ? prev.amenities[amenity].distance_in_km : 0,
                              },
                            },
                          }))
                        }}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 mr-3"
                      />
                      <span className="text-gray-700 font-medium capitalize text-lg">{amenity.replace("_", " ")}</span>
                    </div>
                    {formData.amenities[amenity].available && (
                      <div className="ml-8 mt-4">
                        <label className="flex flex-col">
                          <span className="text-gray-700 text-sm mb-2">Distance in kilometers</span>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            name={`amenities.${amenity}.distance_in_km`}
                            placeholder="Enter distance in km"
                            value={formData.amenities[amenity].distance_in_km}
                            onChange={(e) => {
                              const value = e.target.value
                              setFormData((prev) => ({
                                ...prev,
                                amenities: {
                                  ...prev.amenities,
                                  [amenity]: {
                                    ...prev.amenities[amenity],
                                    distance_in_km: value,
                                  },
                                },
                              }))
                            }}
                            className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Review Your Property Details</h2>
              <div className="bg-purple-50 p-4 rounded-lg mb-6 border border-purple-100">
                <p className="text-purple-700 flex items-center">
                  <Info className="mr-2" size={18} />
                  Please review all details carefully before submitting. Once updated, your property will be reviewed by
                  our team.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(formData).map(([key, value]) => {
                  // Skip property_images and delete_images in the review
                  if (key === "property_images" || key === "delete_images") return null

                  return (
                    <div
                      key={key}
                      className="bg-gray-50 p-5 rounded-lg border border-gray-200 hover:shadow-md transition-all"
                    >
                      <strong className="text-gray-800 capitalize block mb-3 text-lg border-b border-gray-200 pb-2">
                        {key.replace(/_/g, " ")}:
                      </strong>
                      {typeof value === "object" && value !== null ? (
                        <div className="pl-4 border-l-2 border-purple-200">
                          {Object.entries(value).map(([subKey, subValue]) => (
                            <div key={subKey} className="mb-3">
                              <strong className="text-gray-700 capitalize">{subKey.replace(/_/g, " ")}:</strong>
                              {typeof subValue === "object" && subValue !== null ? (
                                <div className="pl-4 border-l-2 border-purple-100 mt-2 mb-2">
                                  {Object.entries(subValue).map(([innerKey, innerValue]) => (
                                    <div key={innerKey} className="text-sm mb-1">
                                      <strong className="text-gray-600 capitalize">
                                        {innerKey.replace(/_/g, " ")}:
                                      </strong>{" "}
                                      <span className="text-gray-700">{String(innerValue)}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-gray-700 ml-2">{String(subValue)}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-700">{String(value)}</span>
                      )}
                    </div>
                  )
                })}

                {/* Image Preview in Review */}
                {formData.property_images && formData.property_images.length > 0 && (
                  <div className="md:col-span-2 bg-gray-50 p-5 rounded-lg border border-gray-200">
                    <strong className="text-gray-800 capitalize block mb-3 text-lg border-b border-gray-200 pb-2">
                      Property Images:
                    </strong>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {formData.property_images.map((image, index) => (
                        <div key={index} className="rounded-lg overflow-hidden shadow-md border border-gray-200">
                          {typeof image === "string" ? (
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`property-image-${index}`}
                              className="w-full h-32 object-cover"
                            />
                          ) : image instanceof File || image instanceof Blob ? (
                            <img
                              src={URL.createObjectURL(image) || "/placeholder.svg"}
                              alt={`property-image-${index}`}
                              className="w-full h-32 object-cover"
                            />
                          ) : (
                            <div className="w-full h-32 flex items-center justify-center bg-gray-100">
                              <Image className="text-gray-400" size={24} />
                              <p className="text-center text-gray-500 ml-2 text-sm">Invalid image</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-10">
            {step === 0 ? (
              <button className="px-6 py-3 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed opacity-70" disabled>
                Back
              </button>
            ) : (
              <button
                onClick={prevStep}
                className="px-6 py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center shadow-sm hover:shadow"
              >
                <ArrowLeft size={18} className="mr-2" /> Back
              </button>
            )}

            {step < steps.length - 1 ? (
              <button
                id="next-button"
                onClick={nextStep}
                className={`px-6 py-3 rounded-lg flex items-center ${
                  isStepValid()
                    ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } transition-all shadow-sm`}
              >
                Next <ArrowRight size={18} className="ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className={`px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:shadow-lg transition-all shadow-sm ${
                  submitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {submitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating Property...
                  </span>
                ) : (
                  "Update Property"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProperty

