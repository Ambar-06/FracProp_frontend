'use client';

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import PhoneInput, { parsePhoneNumber, getCountryCallingCode } from "react-phone-number-input";
import "react-phone-number-input/style.css";

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ phone_number: "", country_code: "" });
    const [successMessage, setSuccessMessage] = useState("");

    // Function to convert country calling code (+91) to ISO Alpha-2 code (IN)
    const getCountryFromCode = (code) => {
        try {
            return Object.keys(getCountryCallingCode).find(
                (country) => `+${getCountryCallingCode(country)}` === code
            ) || "IN"; // Default to "IN" if conversion fails
        } catch (error) {
            return "IN"; // Fallback
        }
    };

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}user/profile`, {
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
                setProfileData(data.data);

                // Format phone number correctly
                const fullPhoneNumber = data.data.country_code + data.data.phone_number;

                setFormData({
                    ...data.data,
                    phone_number: fullPhoneNumber,
                    country_code: getCountryFromCode(data.data.country_code) // Convert country code
                });
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
        setFormData({
            ...profileData,
            phone_number: profileData.country_code + profileData.phone_number,
            country_code: getCountryFromCode(profileData.country_code),
        });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhoneChange = (value) => {
        setFormData({ ...formData, phone_number: value });
    };

    const handleVerifyEmail = () => alert("Verification email sent!");
    const handleVerifyPhone = () => alert("Verification OTP sent!");

    const handleSave = async () => {
        setLoading(true);
        const { phone_number, email, first_name, last_name } = formData;

        const phoneNumber = parsePhoneNumber(phone_number);

        if (!phoneNumber) {
            setError("Invalid phone number.");
            setLoading(false);
            return;
        }

        const country_code = `+${phoneNumber.countryCallingCode}`;
        const phone = phoneNumber.nationalNumber;

        const updatedData = { phone_number: phone, country_code, email, first_name, last_name };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}user/profile`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage("Profile updated successfully!");
                setIsEditing(false);
                setProfileData(data.data);
            } else {
                setError(data.errors ? data.errors.map((e) => e.message).join(", ") : data.data || "Failed to update profile.");
            }
        } catch (err) {
            setError("An error occurred while updating profile.");
        }
        setLoading(false);
    };

    if (loading) return <p className="text-center mt-20 text-xl text-gray-600">Loading...</p>;

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

                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}

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
                            <div className="flex items-center gap-2">
                            <PhoneInput
                                international
                                defaultCountry={formData?.country_code}
                                value={formData?.phone_number}
                                onChange={handlePhoneChange}
                                disabled={!isEditing}
                                className={`w-full mt-1 p-2 border border-gray-300 rounded ${
                                    !isEditing ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"
                                }`}
                            />
                            {!formData?.phone_number && !isEditing && <p className="text-red-500 mt-2">Please add a phone number.</p>}
                            {formData?.phone_number && (
                                formData?.is_phone_verified ? (
                                    <span className="text-green-500 font-semibold">✔ Verified</span>
                                ) : (
                                    <button onClick={handleVerifyPhone} type="button" className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 mt-2">
                                        Verify
                                    </button>
                                )
                            )}
                        </div>
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
                                {!formData?.email && !isEditing && <p className="text-red-500 mt-2">Please add an email address.</p>}
                                {formData?.email && (
                                    formData?.is_email_verified ? (
                                        <span className="text-green-500 font-semibold">✔ Verified</span>
                                    ) : (
                                        <button onClick={handleVerifyEmail} type="button" className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600">
                                            Verify
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    </form>

                    {isEditing && (
                        <div className="flex justify-end mt-6 space-x-4">
                            <button onClick={handleSave} className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition">Save</button>
                            <button onClick={handleCancel} className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition">Cancel</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
