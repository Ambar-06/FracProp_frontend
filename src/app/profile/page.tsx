'use client';

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}user/profile`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("Profile Data: ", data);
            if (data.success) {
                setProfileData(data.data);
                setFormData(data.data);
            } else {
                setError("Failed to fetch profile data.");
            }
            setLoading(false);
        })
        .catch(() => {
            setError("Failed to load profile data.");
            setLoading(false);
        });
    }, []);

    const handleEdit = () => setIsEditing(true);
    const handleCancel = () => {
        setIsEditing(false);
        setFormData(profileData); // Reset form data to original values
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleVerifyEmail = () => {
        // Handle email verification logic here
        alert("Verification email sent!");
    };

    const handleVerifyPhone = () => {
        // Handle phone verification logic here
        alert("Verification OTP sent!");
    };

    if (loading) return <p className="text-center mt-20 text-xl text-gray-600">Loading...</p>;
    if (error) return <p className="text-center text-red-500 mt-20">{error}</p>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar />
              
            {/* Profile Section */}
            <div className="flex justify-center items-center pt-24 px-6">
                <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8">
                    {/* Profile Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">Profile</h2>
                        {!isEditing && (
                            <button 
                                onClick={handleEdit} 
                                className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 transition"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {/* Profile Form */}
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { label: "First Name", key: "first_name" },
                            { label: "Last Name", key: "last_name" },
                            { label: "Username", key: "username", readOnly: true },
                            { label: "Country Code", key: "country_code", readOnly: true },
                        ].map((field, index) => (
                            <div key={index} className="flex flex-col">
                                <label className="text-gray-600 font-medium">{field.label}</label>
                                <input
                                    type="text"
                                    name={field.key}
                                    value={formData?.[field.key] || ""}
                                    readOnly={!isEditing || field.readOnly}
                                    onChange={handleChange}
                                    className={`w-full p-3 border rounded-md focus:outline-none ${
                                        isEditing && !field.readOnly ? "bg-white border-gray-400" : "bg-gray-100 text-gray-500"
                                    }`}
                                />
                            </div>
                        ))}

                        {/* Email Verification */}
                        <div className="flex flex-col">
                            <label className="text-gray-600 font-medium">Email</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData?.email || ""}
                                    readOnly={!isEditing}
                                    onChange={handleChange}
                                    className={`w-full p-3 border rounded-md focus:outline-none ${
                                        isEditing ? "bg-white border-gray-400" : "bg-gray-100 text-gray-500"
                                    }`}
                                />
                                {formData?.email ? (
                                    formData?.is_email_verified ? (
                                        <span className="text-green-500 font-semibold">✔ Verified</span>
                                    ) : (
                                        <button
                                            onClick={handleVerifyEmail}
                                            type="button"
                                            className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                                        >
                                            Verify
                                        </button>
                                    )
                                ) : isEditing && (
                                    <button
                                        type="button"
                                        className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
                                    >
                                        Add Email
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Phone Verification */}
                        <div className="flex flex-col">
                            <label className="text-gray-600 font-medium">Phone</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    name="phone_number"
                                    value={formData?.phone_number || ""}
                                    readOnly={!isEditing}
                                    onChange={handleChange}
                                    className={`w-full p-3 border rounded-md focus:outline-none ${
                                        isEditing ? "bg-white border-gray-400" : "bg-gray-100 text-gray-500"
                                    }`}
                                />
                                {formData?.phone_number ? (
                                    formData?.is_phone_verified ? (
                                        <span className="text-green-500 font-semibold">✔ Verified</span>
                                    ) : (
                                        <button
                                            onClick={handleVerifyPhone}
                                            type="button"
                                            className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                                        >
                                            Verify
                                        </button>
                                    )
                                ) : isEditing && (
                                    <button
                                        type="button"
                                        className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
                                    >
                                        Add Phone
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>

                    {/* Buttons */}
                    {isEditing && (
                        <div className="flex justify-end mt-6 space-x-4">
                            <button
                                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition"
                            >
                                Save
                            </button>
                            <button
                                onClick={handleCancel}
                                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
