"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaArrowRight, FaArrowLeft, FaHeart } from "react-icons/fa"; // Import FaHeart
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const ExploreProperties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [investmentAmount, setInvestmentAmount] = useState("");
    const [investing, setInvesting] = useState(false);
    const [investmentError, setInvestmentError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({});
    const [sortBy, setSortBy] = useState("");
    const router = useRouter();

    useEffect(() => {
        fetchProperties(page, filters, sortBy);
    }, [page, filters, sortBy]);

    const fetchProperties = (page, filters = {}, sortBy = "") => {
        setLoading(true);
        let url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}user/wishlist/?page=${page}&perPage=10`;

        // Add filters to the URL
        if (filters.type) url += `&type=${filters.type}`;
        if (sortBy) url += `&sortBy=${sortBy}`;

        fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((res) => {
                if (res.status === 401 || res.status === 408) {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                    throw new Error("Unauthorized");
                }
                return res.json();
            })
            .then((data) => {
                if (data.success) {
                    setProperties(data.data);
                    setTotalPages(data.meta.pagination.totalPages);
                } else {
                    setError("Failed to fetch properties.");
                }
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load properties.");
                setLoading(false);
            });
    };

    const handleInvestNow = (property) => {
        setSelectedProperty(property);
        setInvestmentAmount("");
        setInvestmentError(null);
    };

    const handleCloseModal = () => {
        setSelectedProperty(null);
    };

    const handleInvestmentSubmit = async () => {
        if (!investmentAmount || isNaN(investmentAmount) || investmentAmount <= 0) {
            setInvestmentError("Please enter a valid investment amount.");
            return;
        }

        setInvesting(true);
        setInvestmentError(null);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}properties/${selectedProperty.uuid}/invest/`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ amount: parseFloat(investmentAmount) }),
                }
            );

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Investment failed.");

            alert("Investment successful!");
            handleCloseModal();
        } catch (err) {
            setInvestmentError(err.message);
        } finally {
            setInvesting(false);
        }
    };

    const nextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const prevPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleFilterChange = (filterType, value) => {
        setFilters({ ...filters, [filterType]: value });
    };

    const handleSortChange = (sortBy) => {
        setSortBy(sortBy);
    };

    if (loading) return <p className="text-center mt-20 text-xl text-gray-600">Loading properties...</p>;
    if (error) return <p className="text-center text-red-500 mt-20">{error}</p>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-6xl mx-auto mt-20 p-6">
                <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Explore Properties</h1>

                {/* Filters and Sort Component */}
                <Filters onFilterChange={handleFilterChange} onSortChange={handleSortChange} />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                        <PropertyCard key={property.uuid} property={property} onInvestNow={handleInvestNow} />
                    ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-8">
                    <button
                        onClick={prevPage}
                        disabled={page === 1}
                        className={`px-4 py-2 rounded-md ${page === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                    >
                        <FaArrowLeft className="inline mr-2" /> Previous
                    </button>
                    <span className="text-gray-800">Page {page} of {totalPages}</span>
                    <button
                        onClick={nextPage}
                        disabled={page === totalPages}
                        className={`px-4 py-2 rounded-md ${page === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                    >
                        Next <FaArrowRight className="inline ml-2" />
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
    const { user } = useAuth();
    const [currentImage, setCurrentImage] = useState(0);
    const [isInWishlist, setIsInWishlist] = useState(property.favorite || false);
    // Track wishlist status
    const images = property.property_images?.length > 0 ? property.property_images : ["/default-property.jpg"];

    const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

    // Handle wishlist button click
    const handleWishlistClick = async () => {
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
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Failed to update wishlist.");

            // Toggle wishlist status
            setIsInWishlist(!isInWishlist);
            alert(isInWishlist ? "Removed from wishlist!" : "Added to wishlist!");
        } catch (err) {
            console.error(err);
            alert("Failed to update wishlist.");
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="relative w-full h-60">
                <Image
                    src={images[currentImage]}
                    alt={property.name}
                    width={400}
                    height={240}
                    className="object-cover w-full h-full"
                />
                {images.length > 1 && (
                    <>
                        <button
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 p-2 rounded-full text-white"
                            onClick={prevImage}
                        >
                            <FaArrowLeft />
                        </button>
                        <button
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 p-2 rounded-full text-white"
                            onClick={nextImage}
                        >
                            <FaArrowRight />
                        </button>
                    </>
                )}
                {/* Heart Button */}
                <button
                    onClick={handleWishlistClick}
                    className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
                >
                    <FaHeart className={`text-lg ${isInWishlist ? "text-red-500" : "text-gray-500"}`} />
                </button>
            </div>

            <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{property.name}</h3>
                <p className="text-gray-600 text-sm">{property.address}, {property.city}, {property.state}, {property.country}</p>

                <div className="mt-4">
                    <p className="text-gray-700 text-sm">Sold Percentage: <span className="font-medium">{property.sold_percentage.toFixed(4)}%</span></p>
                    <div className="w-full bg-gray-300 rounded-full h-3 mt-1">
                        <div
                            className="bg-green-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${property.sold_percentage}%` }}
                        ></div>
                    </div>
                </div>

                {/* Investment History */}
                <InvestmentHistory property={property} />

                {/* Buttons */}
                <div className="mt-4 flex flex-col gap-2">
                    <button
                        onClick={() => onInvestNow(property)}
                        className={`w-full ${property.sold_percentage === 100 ? "bg-gray-500" : "bg-green-500"} text-white px-4 py-2 rounded-md hover:bg-green-600 transition`}
                    >
                        Invest Now
                    </button>
                    <Link href={`/properties/${property.uuid}`}>
                        <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                            View Details
                        </button>
                    </Link>
                    {(user?.is_admin || user?.is_staff) && (
                        <Link href={`/properties/${property.uuid}/edit`}>
                            <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                                Edit Property
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

// Investment History Component
const InvestmentHistory = ({ property }) => {
    const { user_investments } = property;
    return (
        <div className="mt-4 bg-gray-100 p-3 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-800">Investment History</h4>
            <p className="text-gray-700 text-sm">Total Investment: ₹{user_investments.total_investment?.toLocaleString()}</p>
            <p className="text-gray-700 text-sm">Total Profit: ₹{user_investments.total_profit?.toLocaleString()}</p>
            <p className="text-gray-700 text-sm">Total Loss: ₹{user_investments.total_loss?.toLocaleString()}</p>
        </div>
    );
};

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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold text-gray-800">Invest in {selectedProperty.name}</h2>
                <p className="text-gray-600 text-sm mt-2">Enter the amount you want to invest:</p>
                <input
                            type="number"
                            value={investmentAmount}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value <= (selectedProperty.buyable.amount || 0)) {
                                    setInvestmentAmount(value);
                                } else {
                                    setInvestmentAmount(selectedProperty.buyable.amount);
                                }
                            }}
                            className="w-full mt-3 p-2 border border-gray-300 rounded"
                            placeholder="Enter amount (₹)"
                            min="1"
                            max={selectedProperty.buyable.amount || ""}
                        />
                {investmentError && <p className="text-red-500 text-sm mt-2">{investmentError}</p>}
                <div className="mt-4 flex justify-end gap-2">
                    <button
                        onClick={handleCloseModal}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleInvestmentSubmit}
                        disabled={investing}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                        {investing ? "Investing..." : "Confirm Investment"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExploreProperties;