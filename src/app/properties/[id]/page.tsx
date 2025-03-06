"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, BarChart, Bar } from "recharts";
import Navbar from "@/components/Navbar";
import { FaHome, FaChartLine, FaMoneyBillWave, FaInfoCircle, FaSchool, FaHospital, FaTree, FaShoppingCart, FaShieldAlt, FaStar } from "react-icons/fa";
import CircularText from "@/components/VerifiiedBanner";
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
  const { user } = useAuth(); // Destructure user from useAuth

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

  if (loading) return <p className="text-center mt-20 text-xl text-gray-600">Loading property details...</p>;
  if (error) return <p className="text-center text-red-500 mt-20">{error}</p>;

  // 📸 Property Images with Carousel
  const images = property?.property_images?.length > 0 ? property.property_images : ["/default-property.jpg"];
  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  // 📈 Valuation History Graph Data
  const valuationHistory = [...(property?.valuation_history || [])]
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map((entry) => ({
      date: new Date(entry.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }),
      valuation: entry.valuation / 1000000,
    }));

  // 💰 User Investment Data
  const userInvestment = property?.user_investments || {};
  const totalInvestment = userInvestment.total_investment || 0;
  const totalProfit = userInvestment.total_profit || 0;
  const stakePercent = property?.user_percentage_ownership?.stake_in_percent || 0;

  // 📊 Generate Investment Growth Data Using `total_profit`
  const investmentGrowth = [];
  if (totalProfit > 0) {
    for (let i = 1; i <= 6; i++) {
      investmentGrowth.push({
        month: `Month ${i}`,
        profit: (totalProfit / 6) * i, // Simulate gradual profit increase
      });
    }
  }

  // 🏦 Buyable Information
  const buyablePercentage = property?.buyable?.percentage || 0;
  const buyableAmount = property?.buyable?.amount || 0;

  // 📜 Investment History Data
  const investmentHistory = property?.investments_history || [];

  // Handle "View More" button click
  const handleViewMore = () => {
    setVisibleInvestments(investmentHistory.length); // Show all investments
    setShowAllInvestments(true); // Disable the "View More" button
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto mt-20 p-6">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-6 flex items-center justify-center gap-3">
          <FaHome className="text-green-500" /> {property.name}
        </h1>

        {/* 🏡 Property Details & 📊 Investment & Valuation Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 🏡 Property Details */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6">
            <div className="relative w-full h-80 rounded-md overflow-hidden">
              <Image src={images[currentImage]} alt={property.name} width={800} height={400} className="object-cover w-full h-full" />
              {images.length > 1 && (
                <>
                  <button className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 p-2 rounded-full text-white" onClick={prevImage}>‹</button>
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 p-2 rounded-full text-white" onClick={nextImage}>›</button>
                </>
              )}
            </div>

            <p className="text-gray-700 text-sm mt-4"><FaInfoCircle className="inline text-blue-500" /> {property.description}</p>
            <p className="text-gray-700 text-sm"><FaShieldAlt className="inline text-green-500" /> Govt Property ID: {property.govt_allotted_property_id}</p>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <p><strong>🏢 Type:</strong> {property.type}</p>
              <p><strong>📏 Built Area:</strong> {property.built_area_in_sqft} sqft</p>
              <p><strong>🏗️ Construction Age:</strong> {property.other_details.construction_age_in_years} years</p>
              <p><strong>🛠️ Building Health:</strong> {property.other_details.building_health}</p>
              <p><strong>💰 Valuation:</strong> ₹{property.valuation.toLocaleString()}</p>
              <p><strong>🔐 Investment Lock-in:</strong> {property.investment_lock_in_period_in_months} months</p>
              <p><strong>🏦 Loan Status:</strong> {property.has_loan ? "Yes" : "No"}</p>
            </div>

            {/* Nearby Amenities Section */}
            <div className="flex items-start mt-4 justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Nearby Amenities</h3>
                <ul className="text-gray-600 text-sm">
                  {Object.entries(property.amenities || {}).map(([key, value]: any) => (
                    <li key={key}>
                      {key === "school" && <FaSchool className="inline text-blue-500" />}
                      {key === "hospital" && <FaHospital className="inline text-red-500" />}
                      {key === "park" && <FaTree className="inline text-green-500" />}
                      {key === "shopping_mall" && <FaShoppingCart className="inline text-yellow-500" />} 
                      {" " + key.charAt(0).toUpperCase() + key.slice(1).replace("_", " ")} - {value.distance_in_km} km
                    </li>
                  ))}
                </ul>
              </div>

              {/* Verified Badge */}
              {/* {property.is_verified && (
                
              )} */}
              {/* {property.is_verified && <div className="ml-4"><CircularText /></div>} */}
              <div className="ml-8">
                <CircularText />
              </div>
            </div>

            {/* Invest Button */}
            <button onClick={() => router.push(`/invest/${property.uuid}`)} className="mt-6 w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition">
              Invest in this Property
            </button>
          </div>

          {/* 📊 Investment & Valuation Section */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaMoneyBillWave className="text-yellow-500" /> My Investment
            </h3>
            <p className="text-gray-700 text-sm">Total Investment: <span className="font-medium">₹{totalInvestment.toLocaleString()}</span></p>
            <p className="text-gray-700 text-sm">Total Profit: <span className="font-medium">₹{totalProfit.toLocaleString()}</span></p>
            <p className="text-gray-700 text-sm">My Stake: <span className="font-medium">{stakePercent.toFixed(3)}%</span></p>

            {/* Tabs for Graphs */}
            <div className="flex mt-6 border-b">
              <button className={`px-4 py-2 ${activeTab === "valuation" ? "border-b-2 border-green-500" : ""}`} onClick={() => setActiveTab("valuation")}>Valuation History</button>
              <button className={`px-4 py-2 ${activeTab === "investment" ? "border-b-2 border-green-500" : ""}`} onClick={() => setActiveTab("investment")}>Investment Growth</button>
            </div>

            <ResponsiveContainer width="100%" height={350}>
              {activeTab === "valuation" ? (
                <LineChart data={valuationHistory}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Legend />
                  <Line type="monotone" dataKey="valuation" stroke="#4CAF50" strokeWidth={3} />
                </LineChart>
              ) : (
                <BarChart data={investmentGrowth}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="profit" fill="#4CAF50" />
                </BarChart>
              )}
            </ResponsiveContainer>

            {/* 🏦 Buyable Information */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800">Available for Investment</h3>
              <p className="text-gray-700 text-sm">Percentage: <span className="font-medium">{buyablePercentage.toFixed(2)}%</span></p>
              <p className="text-gray-700 text-sm">Amount: <span className="font-medium">₹{buyableAmount.toLocaleString()}</span></p>
            </div>
          </div>
        </div>

        {/* 📜 Investment History Section (Table Format) */}
        <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaChartLine className="text-blue-500" /> Investment History
          </h3>
          {/* 📜 Investment History Table */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800">Investment History</h3>
            <table className="w-full mt-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {investmentHistory.slice(0, visibleInvestments).map((entry: any, index: number) => (
                  <tr key={index} className="border-b hover:bg-gray-50 transition-colors duration-200">
                    <td className="p-2">{new Date(entry[2]).toLocaleDateString()}</td>
                    <td className="p-2">{entry[1].toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* "View More" Button */}
            {!showAllInvestments && investmentHistory.length > visibleInvestments && (
              <button
                onClick={handleViewMore}
                className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                View More
              </button>
            )}
          </div>
        </div>

        {/* 🌟 Average Rating & User Reviews Section */}
        <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            Ratings & Reviews
            <div className="flex items-center">
              <FaStar className="text-yellow-500" />
              <span className="ml-2 text-gray-700">{property.avg_rating?.toFixed(1) || "N/A"}</span>
            </div>
          </h3>

          {/* Add Review Form */}
          {!yourReview && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-800">Add Your Review</h4>
              <div className="mt-4">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`cursor-pointer text-2xl ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
                <textarea
                  className="w-full p-2 border rounded-md"
                  rows={4}
                  placeholder="Write your review..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
                {submitError && <p className="text-red-500 mt-2">{submitError}</p>}
                <button
                  onClick={handleSubmitReview}
                  disabled={isSubmitting}
                  className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
            </div>
          </div>
          )}

          {/* Show Your Review */}
          {yourReview && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-800">Your Review</h4>
              <div className="mt-4">
                <div className="flex items-center">
                  {/* Display star rating */}
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`text-2xl ${star <= yourReview.rating ? "text-yellow-500" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="ml-2 text-gray-700">{yourReview.rating}</span>
                </div>
                {/* Display review text */}
                <p className="text-gray-700 mt-2">{yourReview.review}</p>
                {/* Display review date */}
                <p className="text-gray-500 text-sm mt-2">
                  Reviewed on {new Date(yourReview.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          {/* User Reviews */}
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-gray-800">User Reviews</h4>
            {reviewsLoading ? (
              <p className="text-gray-600">Loading reviews...</p>
            ) : reviewsError ? (
              <p className="text-red-500">{reviewsError}</p>
            ) : reviews.length === 0 ? (
              <p className="text-gray-600">No reviews yet.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {reviews
                  .filter((review) => review.user.uuid !== user.uuid) // Filter out the logged-in user's review
                  .map((review, index) => (
                    <div key={index} className="border-b pb-4">
                      <div className="flex items-center">
                        <FaStar className="text-yellow-500" />
                        <span className="ml-2 text-gray-700">{review.rating}</span>
                      </div>
                      <p className="text-gray-700 mt-2">{review.review}</p>
                      <p className="text-gray-500 text-sm mt-2">- {review.user.name}</p>
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