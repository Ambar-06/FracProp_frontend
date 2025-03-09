"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
import Image from "next/image"
import { ArrowLeft, ArrowRight, Building, ChevronDown, Heart, Search, SlidersHorizontal, Star } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"

const ExploreProperties = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [investmentAmount, setInvestmentAmount] = useState("")
  const [investing, setInvesting] = useState(false)
  const [investmentError, setInvestmentError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({})
  const [sortBy, setSortBy] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    fetchProperties(page, filters, sortBy)
  }, [page, filters, sortBy])

  const fetchProperties = (page, filters = {}, sortBy = "") => {
    setLoading(true)
    let url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}properties/?page=${page}&perPage=10`

    // Add filters to the URL
    if (filters.type) url += `&type=${filters.type}`
    if (sortBy) url += `&sortBy=${sortBy}`

    fetch(url, {
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
          setProperties(data.data)
          setTotalPages(data.meta.pagination.totalPages)
        } else {
          setError("Failed to fetch properties.")
        }
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load properties.")
        setLoading(false)
      })
  }

  const handleInvestNow = (property) => {
    setSelectedProperty(property)
    setInvestmentAmount("")
    setInvestmentError(null)
  }

  const handleCloseModal = () => {
    setSelectedProperty(null)
  }

  const handleInvestmentSubmit = async () => {
    if (!investmentAmount || isNaN(investmentAmount) || investmentAmount <= 0) {
      setInvestmentError("Please enter a valid investment amount.")
      return
    }

    setInvesting(true)
    setInvestmentError(null)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}properties/${selectedProperty.uuid}/invest/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: Number.parseFloat(investmentAmount) }),
        },
      )

      const data = await res.json()

      if (!res.ok) throw new Error(data.message || "Investment failed.")

      alert("Investment successful!")
      handleCloseModal()
    } catch (err) {
      setInvestmentError(err.message)
    } finally {
      setInvesting(false)
    }
  }

  const nextPage = () => {
    if (page < totalPages) setPage(page + 1)
  }

  const prevPage = () => {
    if (page > 1) setPage(page - 1)
  }

  const handleFilterChange = (filterType, value) => {
    setFilters({ ...filters, [filterType]: value })
  }

  const handleSortChange = (sortBy) => {
    setSortBy(sortBy)
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-purple-600 animate-spin mb-4"></div>
          <p className="text-gray-700">Loading properties...</p>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <p className="text-red-500 text-center">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen pb-20 bg-white">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-28 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Discover Properties
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our curated selection of high-quality properties and start building your real estate portfolio
            today.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl p-4 mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search properties..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-10 pr-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-lg transition-colors border border-gray-200"
            >
              <SlidersHorizontal size={18} />
              <span>Filters</span>
            </button>
            <div className="relative">
              <select
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-200 rounded-lg py-3 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Sort By</option>
                <option value="valuation_asc">Price: Low to High</option>
                <option value="valuation_desc">Price: High to Low</option>
                <option value="sold_percentage_asc">Availability: Most Available</option>
                <option value="sold_percentage_desc">Availability: Least Available</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Expanded Filters */}
          {isFilterOpen && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <select
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Types</option>
                  <option value="RESIDENTIAL">Residential</option>
                  <option value="COMMERCIAL">Commercial</option>
                  <option value="AGRICULTURAL">Agricultural</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <select className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="">Any Price</option>
                  <option value="0-500000">Under ₹5,00,000</option>
                  <option value="500000-1000000">₹5,00,000 - ₹10,00,000</option>
                  <option value="1000000-5000000">₹10,00,000 - ₹50,00,000</option>
                  <option value="5000000+">Above ₹50,00,000</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="">All Locations</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Hyderabad">Hyderabad</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.uuid} property={property} onInvestNow={handleInvestNow} />
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-12">
          <button
            onClick={prevPage}
            disabled={page === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              page === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-50 text-gray-700 hover:bg-gray-100"
            } transition-colors border border-gray-200`}
          >
            <ArrowLeft size={18} />
            <span>Previous</span>
          </button>
          <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
            <span className="text-gray-700">
              Page {page} of {totalPages}
            </span>
          </div>
          <button
            onClick={nextPage}
            disabled={page === totalPages}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              page === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
            } transition-colors border border-gray-200`}
          >
            <span>Next</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Investment Modal */}
      {selectedProperty && (
        <InvestmentModal
          selectedProperty={selectedProperty}
          investmentAmount={investmentAmount}
          setInvestmentAmount={setInvestmentAmount}
          investmentError={investmentError}
          investing={investing}
          handleCloseModal={handleCloseModal}
          handleInvestmentSubmit={handleInvestmentSubmit}
        />
      )}
    </div>
    );
};

// Filters Component
const Filters = ({ onFilterChange, onSortChange }) => {
    return (
        <div className="flex gap-4 mb-6">
            <select
                onChange={(e) => onFilterChange("type", e.target.value)}
                className="p-2 border border-gray-300 rounded"
            >
                <option value="">All Types</option>
                <option value="RESIDENTIAL">Residential</option>
                <option value="COMMERCIAL">Commercial</option>
                <option value="AGRICULTURAL">Agricultural</option>
            </select>
            <select
                onChange={(e) => onSortChange(e.target.value)}
                className="p-2 border border-gray-300 rounded"
            >
                <option value="">Sort By</option>
                <option value="valuation_asc">Valuation: Low to High</option>
                <option value="valuation_desc">Valuation: High to Low</option>
                <option value="sold_percentage_asc">Sold Percentage: Low to High</option>
                <option value="sold_percentage_desc">Sold Percentage: High to Low</option>
            </select>
        </div>
    );
};

// Property Card Component
const PropertyCard = ({ property, onInvestNow }) => {
  const { user } = useAuth()
  const [currentImage, setCurrentImage] = useState(0)
  const [isInWishlist, setIsInWishlist] = useState(property.favorite || false)
  const images = property.property_images?.length > 0 ? property.property_images : ["/default-property.jpg"]

  const nextImage = (e) => {
    e.stopPropagation()
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e) => {
    e.stopPropagation()
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  // Handle wishlist button click
  const handleWishlistClick = async (e) => {
    e.stopPropagation()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}user/wishlist/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user?.uuid,
          property_id: property.uuid,
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message || "Failed to update wishlist.")

      // Toggle wishlist status
      setIsInWishlist(!isInWishlist)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl group">
      <Link href={`/properties/${property.uuid}`}>
        <div className="relative w-full h-60">
          <Image
            src={images[currentImage] || "/placeholder.svg"}
            alt={property.name}
            width={400}
            height={240}
            className="object-cover w-full h-full"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                onClick={nextImage}
              >
                <ArrowRight size={16} />
              </button>
            </>
          )}
          {/* Heart Button */}
          <button
            onClick={handleWishlistClick}
            className="absolute top-3 right-3 bg-white bg-opacity-80 p-2 rounded-full text-gray-700 hover:bg-opacity-100 transition-all shadow-md"
          >
            <Heart className={`h-5 w-5 ${isInWishlist ? "fill-current text-red-500" : ""}`} />
          </button>

          {/* Property Type Badge */}
          <div className="absolute top-3 left-3 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            {property.type || "RESIDENTIAL"}
          </div>
        </div>
      </Link>

      <div className="p-5">
        <Link href={`/properties/${property.uuid}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-1 hover:text-purple-600 transition-colors">{property.name}</h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3 flex items-center">
          <Building size={14} className="mr-1" />
          {property.address}, {property.city}
        </p>

        {/* Rating */}
        {typeof property.avg_rating === "number" && property.avg_rating >= 0 && (
          <div className="flex items-center mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`${i < Math.round(property.avg_rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-gray-600 ml-2 text-sm">{property.avg_rating.toFixed(1)}</span>
          </div>
        )}

        {/* Sold Percentage */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Sold</span>
            <span className="text-gray-900 font-medium">{property.sold_percentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${property.sold_percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Investment History */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-gray-600">Investment</p>
              <p className="text-sm font-bold text-gray-900">
                ₹{property.user_investments?.total_investment?.toLocaleString() || 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Profit</p>
              <p className="text-sm font-bold text-green-600">
                ₹{property.user_investments?.total_profit?.toLocaleString() || 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Loss</p>
              <p className="text-sm font-bold text-red-600">
                ₹{property.user_investments?.total_loss?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onInvestNow(property)}
            className={`flex-1 ${
              property.sold_percentage === 100
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-blue-500 hover:shadow-lg text-white"
            } px-4 py-2 rounded-lg transition-all`}
            disabled={property.sold_percentage === 100}
          >
            Invest Now
          </button>
          {(user?.is_admin || user?.is_staff) && (
            <Link href={`/properties/${property.uuid}/edit`}>
              <button className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:shadow-lg text-white px-4 py-2 rounded-lg transition-all">
                Edit Property
              </button>
            </Link>
          )}
          <Link href={`/properties/${property.uuid}`} className="flex-1">
            <button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg transition-colors border border-gray-200">
              Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

// Investment Modal Component
const InvestmentModal = ({
  selectedProperty,
  investmentAmount,
  setInvestmentAmount,
  investmentError,
  investing,
  handleCloseModal,
  handleInvestmentSubmit,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 px-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full animate-float shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Invest in {selectedProperty.name}</h2>
        <p className="text-gray-600 text-sm mb-6">Enter the amount you want to invest in this property</p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Investment Amount (₹)</label>
          <input
            type="number"
            value={investmentAmount}
            onChange={(e) => {
              const value = Number(e.target.value)
              if (value <= (selectedProperty.buyable?.amount || 0)) {
                setInvestmentAmount(value)
              } else {
                setInvestmentAmount(selectedProperty.buyable?.amount)
              }
            }}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter amount (₹)"
            min="1"
            max={selectedProperty.buyable?.amount || ""}
          />
          {investmentError && <p className="text-red-500 text-sm mt-2">{investmentError}</p>}
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Available for investment:</span>
            <span className="text-gray-900 font-medium">₹{selectedProperty.buyable?.amount?.toLocaleString() || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Minimum investment:</span>
            <span className="text-gray-900 font-medium">₹1</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCloseModal}
            className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-lg transition-colors border border-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleInvestmentSubmit}
            disabled={investing}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all"
          >
            {investing ? "Processing..." : "Confirm Investment"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExploreProperties