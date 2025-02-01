'use client';

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ phone_number: "" });

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}user/profile`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                setProfileData(data.data);
                setFormData({ ...data.data });
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

    const handlePhoneChange = (value) => {
        setFormData({ ...formData, phone_number: value });
    };

    const handleVerifyEmail = () => {
        alert("Verification email sent!");
    };

    const handleVerifyPhone = () => {
        alert("Verification OTP sent!");
    };

    if (loading) return <p className="text-center mt-20 text-xl text-gray-600">Loading...</p>;
    if (error) return <p className="text-center text-red-500 mt-20">{error}</p>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="flex justify-center items-center pt-24 px-6">
                <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8">
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

                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { label: "First Name", key: "first_name" },
                            { label: "Last Name", key: "last_name" },
                            { label: "Username", key: "username", readOnly: true },
                        ].map((field, index) => (
                            <div key={index} className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                                <input
                                    type="text"
                                    name={field.key}
                                    value={formData?.[field.key] || ""}
                                    readOnly={!isEditing || field.readOnly}
                                    onChange={handleChange}
                                    className={`w-full mt-1 p-2 border border-gray-300 rounded ${
                                        (!isEditing || field.readOnly) ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"
                                    }`}
                                />
                            </div>
                        ))}

                        {/* Phone Number Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <PhoneInput
                                international
                                defaultCountry="IN"
                                value={formData?.phone_number}
                                onChange={handlePhoneChange}
                                disabled={!isEditing}
                                className={`w-full mt-1 p-2 border border-gray-300 rounded ${
                                    !isEditing ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"
                                }`}
                            />
                            {formData?.phone_number ? (
                                formData?.is_phone_verified ? (
                                    <span className="text-green-500 font-semibold">✔ Verified</span>
                                ) : (
                                    <button
                                        onClick={handleVerifyPhone}
                                        type="button"
                                        className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 mt-2"
                                    >
                                        Verify
                                    </button>
                                )
                            ) : isEditing && (
                                <button
                                    type="button"
                                    className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 mt-2"
                                >
                                    Add Phone
                                </button>
                            )}
                        </div>

                        {/* Email Verification */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData?.email || ""}
                                    readOnly={!isEditing}
                                    onChange={handleChange}
                                    className={`w-full mt-1 p-2 border border-gray-300 rounded ${
                                        !isEditing ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"
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
                    </form>

                    {isEditing && (
                        <div className="flex justify-end mt-6 space-x-4">
                            <button className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition">
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
