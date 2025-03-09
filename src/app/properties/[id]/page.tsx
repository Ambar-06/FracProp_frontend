"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, BarChart, Bar } from "recharts";
import Navbar from "@/components/Navbar";
import { Building, ChevronLeft, ChevronRight, DollarSign, Home, Info, MapPin, School, Hospital, TreesIcon as Tree, ShoppingBag, Shield, Star, ArrowRight } from 'lucide-react';
import { useAuth } from "@/context/AuthContext"; 

const PropertyDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"valuation" | "investment">("valuation");
  const [currentImage, setCurrentImage] = useState(0);
  const [visibleInvestments, setVisibleInvestments] = useState(5);
  const [showAllInvestments, setShowAllInvestments] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  // State for review form
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // State for user's review
  const [yourReview, setYourReview] = useState<any>(null);

  // Get logged-in user data from AuthContext
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}properties/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setProperty(data.data);
            // Check if the user has already submitted a review
            if (data.data.your_review && Object.keys(data.data.your_review).length > 0) {
              setYourReview(data.data.your_review);
            }
          } else {
            setError("Failed to fetch property details.");
          }
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });

      // Fetch reviews data
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}properties/review?property_id=${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setReviews(data.data);
          } else {
            setReviewsError("Failed to fetch reviews.");
          }
          setReviewsLoading(false);
        })
        .catch((err) => {
          setReviewsError(err.message);
          setReviewsLoading(false);
        });
    }
  }, [id]);

  // Function to handle review submission
  const handleSubmitReview = async () => {
    if (!rating || !reviewText) {
      setSubmitError("Please provide a rating and review.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}properties/review/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          review: reviewText,
          property_id: id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add the new review to the reviews list
        setReviews([...reviews, data.data]);
        // Update the user's review
        setYourReview(data.data);
        setRating(0);
        setReviewText("");
      } else {
        setSubmitError(data.message || "Failed to submit review.");
      }
    } catch (err) {
      setSubmitError("An error occurred while submitting the review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 rounded-full bg-purple-600 animate-spin mb-4"></div>
        <p className="text-gray-700">Loading property details...</p>
      </div>
    </div>
  );
  
  if (error) return (
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
  );

  // Property Images with Carousel
  const images = property?.property_images?.length > 0 ? property.property_images : ["/default-property.jpg"];
  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  // Valuation History Graph Data
  const valuationHistory = [...(property?.valuation_history || [])]
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map((entry) => ({
      date: new Date(entry.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }),
      valuation: entry.valuation / 1000000,
    }));

  // User Investment Data
  const userInvestment = property?.user_investments || {};
  const totalInvestment = userInvestment.total_investment || 0;
  const totalProfit = userInvestment.total_profit || 0;
  const stakePercent = property?.user_percentage_ownership?.stake_in_percent || 0;

  // Generate Investment Growth Data Using `total_profit`
  const investmentGrowth = [];
  if (totalProfit > 0) {
    for (let i = 1; i <= 6; i++) {
      investmentGrowth.push({
        month: `Month ${i}`,
        profit: (totalProfit / 6) * i, // Simulate gradual profit increase
      });
    }
  }

  // Buyable Information
  const buyablePercentage = property?.buyable?.percentage || 0;
  const buyableAmount = property?.buyable?.amount || 0;

  // Investment History Data
  const investmentHistory = property?.investments_history || [];

  // Handle "View More" button click
  const handleViewMore = () => {
    setVisibleInvestments(investmentHistory.length); // Show all investments
    setShowAllInvestments(true); // Disable the "View More" button
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-6xl mx-auto pt-28 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => router.back()} 
            className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 mr-1" /> Back
          </button>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-6 flex items-center">
          <Home className="text-purple-600 mr-3 h-8 w-8" /> {property.name}
        </h1>

        {/* Property Details & Investment Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Property Details */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="relative w-full h-80">
              <Image 
                src={images[currentImage] || "/placeholder.svg"} 
                alt={property.name} 
                width={800} 
                height={400} 
                className="object-cover w-full h-full" 
              />
              {images.length > 1 && (
                <>
                  <button 
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full text-gray-700 shadow-md hover:bg-gray-100" 
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full text-gray-700 shadow-md hover:bg-gray-100" 
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
              
              {/* Property Type Badge */}
              <div className="absolute top-3 left-3 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                {property.type || "RESIDENTIAL"}
              </div>
              
              {/* Verified Badge */}
              {property.is_verified && (
                <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
                  <Shield className="h-3 w-3 mr-1" /> Verified
                </div>
              )}
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4 flex items-start">
                <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-1" /> 
                <span>{property.description}</span>
              </p>
              
              <p className="text-gray-700 mb-4 flex items-center">
                <MapPin className="h-5 w-5 text-red-500 mr-2" /> 
                <span>{property.address}, {property.city}, {property.state}, {property.country}</span>
              </p>
              
              <p className="text-gray-700 mb-4 flex items-center">
                <Shield className="h-5 w-5 text-green-500 mr-2" /> 
                <span>Govt Property ID: {property.govt_allotted_property_id}</span>
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-semibold text-gray-900">{property.type}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Built Area</p>
                  <p className="font-semibold text-gray-900">{property.built_area_in_sqft} sqft</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Construction Age</p>
                  <p className="font-semibold text-gray-900">{property.other_details.construction_age_in_years} years</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Building Health</p>
                  <p className="font-semibold text-gray-900">{property.other_details.building_health}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Valuation</p>
                  <p className="font-semibold text-gray-900">₹{property.valuation.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Investment Lock-in</p>
                  <p className="font-semibold text-gray-900">{property.investment_lock_in_period_in_months} months</p>
                </div>
              </div>

              {/* Nearby Amenities Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Nearby Amenities</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(property.amenities || {}).map(([key, value]: any) => (
                    <div key={key} className="flex items-center bg-gray-50 p-3 rounded-lg">
                      {key === "school" && <School className="h-4 w-4 text-blue-500 mr-2" />}
                      {key === "hospital" && <Hospital className="h-4 w-4 text-red-500 mr-2" />}
                      {key === "park" && <Tree className="h-4 w-4 text-green-500 mr-2" />}
                      {key === "shopping_mall" && <ShoppingBag className="h-4 w-4 text-yellow-500 mr-2" />}
                      <div>
                        <p className="text-sm font-medium text-gray-800 capitalize">{key.replace("_", " ")}</p>
                        <p className="text-xs text-gray-600">{value.distance_in_km} km away</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Invest Button */}
              <button 
                onClick={() => router.push(`/invest/${property.uuid}`)} 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center"
              >
                Invest in this Property <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Investment & Valuation Section */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <DollarSign className="text-yellow-500 mr-2 h-6 w-6" /> My Investment
            </h3>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Total Investment</p>
                <p className="text-lg font-bold text-gray-900">₹{totalInvestment.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Total Profit</p>
                <p className="text-lg font-bold text-green-600">₹{totalProfit.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">My Stake</p>
                <p className="text-lg font-bold text-purple-600">{stakePercent.toFixed(3)}%</p>
              </div>
            </div>

            {/* Tabs for Graphs */}
            <div className="flex mb-4 border-b">
              <button 
                className={`px-4 py-2 text-sm font-medium ${activeTab === "valuation" ? "border-b-2 border-purple-600 text-purple-600" : "text-gray-600"}`} 
                onClick={() => setActiveTab("valuation")}
              >
                Valuation History
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium ${activeTab === "investment" ? "border-b-2 border-purple-600 text-purple-600" : "text-gray-600"}`} 
                onClick={() => setActiveTab("investment")}
              >
                Investment Growth
              </button>
            </div>

            <div className="h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                {activeTab === "valuation" ? (
                  <LineChart data={valuationHistory}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Legend />
                    <Line type="monotone" dataKey="valuation" stroke="#a855f7" strokeWidth={3} />
                  </LineChart>
                ) : (
                  <BarChart data={investmentGrowth}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="profit" fill="#a855f7" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Buyable Information */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Available for Investment</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Percentage</p>
                  <p className="text-lg font-bold text-gray-900">{buyablePercentage.toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="text-lg font-bold text-gray-900">₹{buyableAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Investment History Section */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <Building className="text-blue-500 mr-2 h-6 w-6" /> Investment History
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-700">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {investmentHistory.slice(0, visibleInvestments).map((entry: any, index: number) => (
                  <tr key={index} className="border-b hover:bg-gray-50 transition-colors duration-200">
                    <td className="p-3 text-sm text-gray-700">{new Date(entry[2]).toLocaleDateString()}</td>
                    <td className="p-3 text-sm text-gray-700">{entry[1].toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* "View More" Button */}
          {!showAllInvestments && investmentHistory.length > visibleInvestments && (
            <button
              onClick={handleViewMore}
              className="mt-4 w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              View More
            </button>
          )}
        </div>

        {/* Ratings & Reviews Section */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <div className="flex items-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-800">Ratings & Reviews</h3>
            <div className="ml-4 flex items-center bg-gray-50 px-3 py-1 rounded-lg">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="ml-1 text-gray-700 font-medium">{property.avg_rating?.toFixed(1) || "N/A"}</span>
            </div>
          </div>

          {/* Add Review Form */}
          {!yourReview && (
            <div className="mb-8 bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Add Your Review</h4>
              <div>
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`cursor-pointer h-6 w-6 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
                <textarea
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={4}
                  placeholder="Write your review..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
                {submitError && <p className="text-red-500 mt-2 text-sm">{submitError}</p>}
                <button
                  onClick={handleSubmitReview}
                  disabled={isSubmitting}
                  className="mt-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </div>
          )}

          {/* Show Your Review */}
          {yourReview && (
            <div className="mb-8 bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Your Review</h4>
              <div>
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${star <= yourReview.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="ml-2 text-gray-700">{yourReview.rating}</span>
                </div>
                <p className="text-gray-700 mb-2">{yourReview.review}</p>
                <p className="text-gray-500 text-sm">
                  Reviewed on {new Date(yourReview.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          {/* User Reviews */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">User Reviews</h4>
            {reviewsLoading ? (
              <p className="text-gray-600">Loading reviews...</p>
            ) : reviewsError ? (
              <p className="text-red-500">{reviewsError}</p>
            ) : reviews.length === 0 ? (
              <p className="text-gray-600">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews
                  .filter((review) => review.user?.uuid !== user?.uuid) // Filter out the logged-in user's review
                  .map((review, index) => (
                    <div key={index} className="border-b pb-4">
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${star <= review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-gray-700">{review.rating}</span>
                      </div>
                      <p className="text-gray-700 mb-1">{review.review}</p>
                      <p className="text-gray-500 text-sm">- {review.user?.name || "Anonymous"}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
