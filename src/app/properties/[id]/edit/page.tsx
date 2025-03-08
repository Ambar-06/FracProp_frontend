"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Navbar from "@/components/Navbar"
import { CheckCircle, ArrowRight, ArrowLeft, Upload, Home, Building, DollarSign, MapPin, X, Image } from "lucide-react"
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
  const [property_images, setPropertyImages] = useState([]) // Stores newly uploaded File objects
  const [delete_images, setDeletedImages] = useState([])

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
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}properties/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.data, "data")
          setFormData({
            ...data.data,
            delete_images: [], // Initialize delete_images in formData
          })
          setLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching property:", error)
          setLoading(false)
        })
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

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
    if (isStepValid()) {
      setStep((prev) => prev + 1)
    } else {
      const button = document.getElementById("next-button")
      if (button) {
        button.classList.add("animate-shake")
        setTimeout(() => button.classList.remove("animate-shake"), 500)
      }
    }
  }

  const prevStep = () => setStep((prev) => prev - 1)

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setFormData((prev) => ({
      ...prev,
      property_images: [...prev.property_images, ...files],
    }))
  }

  const handleDeleteImage = (index) => {
    const imageToDelete = formData.property_images[index]

    // If the image is a URL (string), add it to the deleted_images array
    if (typeof imageToDelete === "string") {
      setDeletedImages((prev) => [...prev, imageToDelete])
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
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-purple-600 animate-spin mb-4"></div>
          <p className="text-gray-700">Loading property details...</p>
        </div>
      </div>
    )

  if (!formData)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <p className="text-red-500 text-center">Property not found</p>
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
        <div className="mb-12">
          <div className="flex justify-between items-center">
            {steps.map((label, index) => (
              <div key={index} className="flex flex-col items-center relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index < step
                      ? "bg-green-500 text-white"
                      : index === step
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {stepIcons[index]}
                </div>
                <span className={`text-xs mt-2 font-medium ${index <= step ? "text-gray-900" : "text-gray-500"}`}>
                  {label}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-5 left-10 w-[calc(100%-20px)] h-0.5 ${
                      index < step ? "bg-green-500" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          {/* Step Content */}
          {step === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex flex-col">
                <span className="text-gray-700 font-medium mb-1">
                  Property Name <span className="text-red-500">*</span>
                </span>
                <input
                  name="name"
                  placeholder="Property Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </label>
              <label className="flex flex-col">
                <span className="text-gray-700 font-medium mb-1">
                  Address <span className="text-red-500">*</span>
                </span>
                <input
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </label>
              <label className="flex flex-col">
                <span className="text-gray-700 font-medium mb-1">
                  City <span className="text-red-500">*</span>
                </span>
                <input
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className={`border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${user?.is_staff && !user?.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  readOnly={user?.is_staff && !user?.is_admin}
                />
              </label>
              <label className="flex flex-col">
                <span className="text-gray-700 font-medium mb-1">
                  State <span className="text-red-500">*</span>
                </span>
                <input
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  className={`border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${user?.is_staff && !user?.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  readOnly={user?.is_staff && !user?.is_admin}
                />
              </label>
              <label className="flex flex-col">
                <span className="text-gray-700 font-medium mb-1">
                  Country <span className="text-red-500">*</span>
                </span>
                <input
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleChange}
                  className={`border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${user?.is_staff && !user?.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  readOnly={user?.is_staff && !user?.is_admin}
                />
              </label>
              <label className="flex flex-col">
                <span className="text-gray-700 font-medium mb-1">
                  Pin Code <span className="text-red-500">*</span>
                </span>
                <input
                  name="pin_code"
                  placeholder="Pin Code"
                  value={formData.pin_code}
                  onChange={handleChange}
                  className={`border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${user?.is_staff && !user?.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  readOnly={user?.is_staff && !user?.is_admin}
                />
              </label>
              <label className="flex flex-col md:col-span-2">
                <span className="text-gray-700 font-medium mb-1">
                  Description <span className="text-red-500">*</span>
                </span>
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                  className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px]"
                  required
                ></textarea>
              </label>
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex flex-col">
                <span className="text-gray-700 font-medium mb-1">
                  Type <span className="text-red-500">*</span>
                </span>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${user?.is_staff && !user?.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  disabled={user?.is_staff && !user?.is_admin}
                >
                  <option value="" disabled hidden>
                    Select an Option
                  </option>
                  <option value="COMMERCIAL">Commercial</option>
                  <option value="RESIDENTIAL">Residential</option>
                  <option value="INDUSTRIAL">Industrial</option>
                  <option value="AGRICULTURAL">Agricultural</option>
                  <option value="OTHER">Other</option>
                </select>
              </label>
              <label className="flex flex-col">
                <span className="text-gray-700 font-medium mb-1">
                  Number of Floors <span className="text-red-500">*</span>
                </span>
                <input
                  name="number_of_floors"
                  placeholder="Number of Floors"
                  value={formData.number_of_floors}
                  onChange={handleChange}
                  className={`border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${user?.is_staff && !user?.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  readOnly={user?.is_staff && !user?.is_admin}
                />
              </label>
              <label className="flex flex-col">
                <span className="text-gray-700 font-medium mb-1">
                  Number of Rooms <span className="text-red-500">*</span>
                </span>
                <input
                  name="number_of_rooms"
                  placeholder="Number of Rooms"
                  value={formData.number_of_rooms}
                  onChange={handleChange}
                  className={`border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${user?.is_staff && !user?.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  readOnly={user?.is_staff && !user?.is_admin}
                />
              </label>
              <label className="flex flex-col">
                <span className="text-gray-700 font-medium mb-1">
                  Return Type <span className="text-red-500">*</span>
                </span>
                <select
                  name="return_type"
                  value={formData.return_type}
                  onChange={handleChange}
                  className={`border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${user?.is_staff && !user?.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  disabled={user?.is_staff && !user?.is_admin}
                >
                  <option value="" disabled hidden>
                    Select an Option
                  </option>
                  <option value="RENT">Rent</option>
                  <option value="APPRECIATION">Appreciation</option>
                  <option value="OTHER">Other</option>
                </select>
              </label>
              <label className="flex flex-col">
                <span className="text-gray-700 font-medium mb-1">
                  Government Property ID <span className="text-red-500">*</span>
                </span>
                <input
                  name="govt_allotted_property_id"
                  placeholder="Government Property ID"
                  value={formData.govt_allotted_property_id}
                  onChange={handleChange}
                  className={`border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${user?.is_staff && !user?.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  readOnly={user?.is_staff && !user?.is_admin}
                />
              </label>
              <label className="flex flex-col">
                <span className="text-gray-700 font-medium mb-1">
                  Built Area in Sqft <span className="text-red-500">*</span>
                </span>
                <input
                  name="built_area_in_sqft"
                  type="number"
                  step="0.01"
                  placeholder="Built Area in Sqft"
                  value={formData.built_area_in_sqft}
                  onChange={handleChange}
                  className={`border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${user?.is_staff && !user?.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  readOnly={user?.is_staff && !user?.is_admin}
                />
              </label>
              <label className="flex flex-col">
                <span className="text-gray-700 font-medium mb-1">
                  Area in Sqft <span className="text-red-500">*</span>
                </span>
                <input
                  name="area_in_sqft"
                  type="number"
                  step="0.01"
                  placeholder="Area in Sqft"
                  value={formData.area_in_sqft}
                  onChange={handleChange}
                  className={`border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${user?.is_staff && !user?.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  readOnly={user?.is_staff && !user?.is_admin}
                />
              </label>
              <label className="flex flex-col">
                <span className="text-gray-700 font-medium mb-1">
                  Latitude <span className="text-red-500">*</span>
                </span>
                <input
                  name="latitude"
                  type="number"
                  step="0.000001"
                  placeholder="Latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-gray-700 font-medium mb-1">
                  Longitude <span className="text-red-500">*</span>
                </span>
                <input
                  name="longitude"
                  type="number"
                  step="0.000001"
                  placeholder="Longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </label>
              <label className="flex flex-col md:col-span-2">
                <span className="text-gray-700 font-medium mb-1">Upload Images</span>
                <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Drag and drop files here, or click to browse</p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                </div>
              </label>

              {/* Display Uploaded Images */}
              {formData.property_images && formData.property_images.length > 0 && (
                <div className="md:col-span-2 mt-4">
                  <h3 className="text-gray-700 font-medium mb-3">Property Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.property_images.map((image, index) => (
                      <div
                        key={index}
                        className="relative group rounded-lg overflow-hidden shadow-md border border-gray-200"
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
                        {user?.is_admin && (
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
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex flex-col">
                <span className="text-gray-700 font-medium mb-1">
                  Property Valuation <span className="text-red-500">*</span>
                </span>
                <input
                  name="valuation"
                  type="number"
                  step="0.01"
                  placeholder="Property Valuation"
                  value={formData.valuation}
                  onChange={handleChange}
                  className={`border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${user?.is_staff && !user?.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  readOnly={user?.is_staff && !user?.is_admin}
                />
              </label>
              <label className="flex items-center space-x-2 p-3">
                <input
                  type="checkbox"
                  name="has_loan"
                  checked={formData.has_loan || false}
                  onChange={handleChange}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-gray-700 font-medium">Has Loan</span>
              </label>
              <label className="flex flex-col">
                <span className="text-gray-700 font-medium mb-1">
                  Lock-in Period for Investments (months) <span className="text-red-500">*</span>
                </span>
                <input
                  name="investment_lock_in_period_in_months"
                  type="number"
                  placeholder="Lock-in Period for Investments"
                  value={formData.investment_lock_in_period_in_months}
                  onChange={handleChange}
                  className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-gray-700 font-medium mb-1">
                  Construction Age in Years <span className="text-red-500">*</span>
                </span>
                <input
                  name="other_details.construction_age_in_years"
                  type="number"
                  placeholder="Construction Age in Years"
                  value={formData.other_details.construction_age_in_years}
                  onChange={handleChange}
                  className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-gray-700 font-medium mb-1">
                  Building Health <span className="text-red-500">*</span>
                </span>
                <select
                  name="other_details.building_health"
                  value={formData.other_details.building_health}
                  onChange={handleChange}
                  className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="" disabled hidden>
                    Select an Option
                  </option>
                  <option value="EXCELLENT">Excellent</option>
                  <option value="GOOD">Good</option>
                  <option value="AVERAGE">Average</option>
                  <option value="BAD">Bad</option>
                </select>
              </label>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(formData.amenities).map((amenity) => (
                <div key={amenity} className="bg-gray-50 p-4 rounded-lg">
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
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 mr-2"
                    />
                    <span className="text-gray-700 font-medium capitalize">{amenity.replace("_", " ")}</span>
                  </div>
                  {formData.amenities[amenity].available && (
                    <div className="ml-6">
                      <label className="flex flex-col">
                        <span className="text-gray-700 text-sm mb-1">Distance in km</span>
                        <input
                          type="number"
                          name={`amenities.${amenity}.distance_in_km`}
                          placeholder="Distance in km"
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
                          className="border border-gray-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Review Your Property Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(formData).map(([key, value]) => {
                  // Skip property_images and delete_images in the review
                  if (key === "property_images" || key === "delete_images") return null

                  return (
                    <div key={key} className="bg-gray-50 p-4 rounded-lg">
                      <strong className="text-gray-700 capitalize block mb-2">{key.replace(/_/g, " ")}:</strong>
                      {typeof value === "object" && value !== null ? (
                        <div className="pl-4 border-l-2 border-purple-200">
                          {Object.entries(value).map(([subKey, subValue]) => (
                            <div key={subKey} className="mb-2">
                              <strong className="text-gray-600 capitalize">{subKey.replace(/_/g, " ")}:</strong>
                              {typeof subValue === "object" && subValue !== null ? (
                                <div className="pl-4 border-l-2 border-purple-100 mt-1">
                                  {Object.entries(subValue).map(([innerKey, innerValue]) => (
                                    <div key={innerKey} className="text-sm">
                                      <strong className="text-gray-500 capitalize">
                                        {innerKey.replace(/_/g, " ")}:
                                      </strong>{" "}
                                      <span className="text-gray-700">{String(innerValue)}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-gray-700 ml-1">{String(subValue)}</span>
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
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step === 0 ? (
              <button className="px-6 py-2 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed" disabled>
                Back
              </button>
            ) : (
              <button
                onClick={prevStep}
                className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center"
              >
                <ArrowLeft size={16} className="mr-2" /> Back
              </button>
            )}

            {step < steps.length - 1 ? (
              <button
                id="next-button"
                onClick={nextStep}
                className={`px-6 py-2 rounded-lg flex items-center ${
                  isStepValid()
                    ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } transition-all`}
              >
                Next <ArrowRight size={16} className="ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className={`px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:shadow-lg transition-all ${
                  submitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {submitting ? "Submitting..." : "Update Property"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProperty

