'use client';

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

const ExploreProperties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}property/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                setProperties(data.data);
            } else {
                setError("Failed to fetch properties.");
            }
            setLoading(false);
        })
        .catch(() => {
            setError("Failed to load properties.");
            setLoading(false);
        });
    }, []);

    if (loading) return <p className="text-center mt-20 text-xl text-gray-600">Loading properties...</p>;
    if (error) return <p className="text-center text-red-500 mt-20">{error}</p>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar />

            <div className="max-w-6xl mx-auto mt-20 p-6">
                <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Explore Properties</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                        <PropertyCard key={property.uuid} property={property} router={router} />
                    ))}
                </div>
            </div>
        </div>
    );
};

// Property Card Component
const PropertyCard = ({ property, router }) => {
    const [currentImage, setCurrentImage] = useState(0);
    const images = property.property_images.length > 0 ? property.property_images : ["/default-property.jpg"]; // Default Image

    const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Image Carousel */}
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
            </div>

            {/* Property Info */}
            <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{property.name}</h3>
                <p className="text-gray-600 text-sm">{property.address}, {property.city}, {property.state}, {property.country}</p>
                <p className="text-gray-700 text-sm mt-2">Type: <span className="font-medium">{property.type}</span></p>
                <p className="text-gray-700 text-sm">Built Area: <span className="font-medium">{property.built_area_in_sqft} sqft</span></p>
                <p className="text-gray-700 text-sm">Valuation: <span className="font-medium">₹{property.valuation.toLocaleString()}</span></p>

                {/* Invest Button */}
                <button
                    onClick={() => router.push(`/invest/${property.uuid}`)}
                    className="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                >
                    Invest Now
                </button>
            </div>
        </div>
    );
};

export default ExploreProperties;
