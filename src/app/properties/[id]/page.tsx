"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import Navbar from "@/components/Navbar";

const PropertyDetail = () => {
  const { id } = useParams(); // ✅ Get id correctly from URL
  const router = useRouter();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}properties/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch property details.");
          return res.json();
        })
        .then((data) => {
          if (data.success) {
            setProperty(data.data);
          } else {
            setError("Failed to fetch property details.");
          }
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <p className="text-center mt-20 text-xl text-gray-600">Loading property details...</p>;
  if (error) return <p className="text-center text-red-500 mt-20">{error}</p>;

  // ✅ Ensure Valuation History is Sorted Correctly
  const valuationHistory = [...(property?.valuation_history || [])]
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map((entry) => ({
      date: new Date(entry.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }),
      valuation: entry.valuation / 1000000, // Convert to Millions
    }));

  return (
    <div className="min-h-screen bg-gray-50">
        <Navbar />
      <div className="max-w-6xl mx-auto mt-20 p-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">{property.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Property Details */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6">
            <div className="relative w-full h-80">
              {property.property_images.length > 0 ? (
                <Image
                  src={property.property_images[0]}
                  alt={property.name}
                  width={800}
                  height={400}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <span>No images available</span>
                </div>
              )}
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mt-4">{property.name}</h2>
            <p className="text-gray-600 text-sm">{property.address}, {property.city}, {property.state}, {property.country}</p>
            <p className="text-gray-700 text-sm mt-2">Type: <span className="font-medium">{property.type}</span></p>
            <p className="text-gray-700 text-sm">Built Area: <span className="font-medium">{property.built_area_in_sqft} sqft</span></p>
            <p className="text-gray-700 text-sm">Valuation: <span className="font-medium">₹{property.valuation.toLocaleString()}</span></p>

            {/* Invest Button */}
            <button
              onClick={() => router.push(`/invest/${property.uuid}`)}
              className="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            >
              Invest in this Property
            </button>
          </div>

          {/* 📊 Improved Valuation History Chart */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Valuation History (in Millions)</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={valuationHistory} margin={{ top: 10, right: 30, left: 10, bottom: 30 }}>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" />
                <YAxis tickFormatter={(value) => `₹${value}M`} />
                <Tooltip formatter={(value) => `₹${value}M`} />
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <Legend />
                <Line type="monotone" dataKey="valuation" stroke="#4CAF50" strokeWidth={3} dot={{ r: 4, fill: "#4CAF50" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
