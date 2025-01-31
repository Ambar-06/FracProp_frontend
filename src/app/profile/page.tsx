'use client';

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/user/profile", {
            method: "GET",
            headers: {
                Authorization: `Bearer YOUR_ACCESS_TOKEN`,
            },
        })
        .then((res) => res.json())
        .then((data) => {
            setProfileData(data);
            setLoading(false);
        })
        .catch((err) => {
            setError("Failed to load profile data.");
            setLoading(false);
        });
    }, []);

    const handleEdit = () => setIsEditing(true);
    const handleCancel = () => setIsEditing(false);

    if (loading) return <p className="text-center mt-20 text-xl text-gray-600">Loading...</p>;
    if (error) return <p className="text-center text-red-500 mt-20">{error}</p>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar />

            {/* Profile Section */}
            <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-28">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Profile</h2>

                {/* Profile Form */}
                <form className="grid grid-cols-2 gap-6">
                    {[
                        { label: "Full Name", key: "full_name" },
                        { label: "Email", key: "email" },
                        { label: "Phone", key: "phone" },
                        { label: "Address", key: "address" },
                    ].map((field, index) => (
                        <div key={index}>
                            <label className="block text-gray-600">{field.label}</label>
                            <input
                                type="text"
                                name={field.key}
                                value={profileData?.[field.key] || ""}
                                readOnly={!isEditing}
                                className={`w-full p-2 border rounded-md ${
                                    isEditing ? "bg-white" : "bg-gray-100 text-gray-500"
                                }`}
                            />
                        </div>
                    ))}
                </form>

                {/* Buttons */}
                <div className="flex justify-between mt-6">
                    {!isEditing ? (
                        <button
                            onClick={handleEdit}
                            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
                        >
                            Edit Profile
                        </button>
                    ) : (
                        <>
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
