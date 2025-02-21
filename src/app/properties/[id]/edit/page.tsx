'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { FaCheckCircle, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from "@/context/AuthContext";

const steps = [
    'Property Details',
    'Specifications',
    'Valuation & Other Details',
    'Amenities',
    'Review & Submit'
];

const EditProperty = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const propertyId = searchParams.get('id');
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [property_images, setPropertyImages] = useState([]); // Stores newly uploaded File objects
    const [delete_images, setDeletedImages] = useState([]);

    useEffect(() => {
        if (id) {
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}properties/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data.data, 'data');
                    setFormData({
                        ...data.data,
                        delete_images: [], // Initialize delete_images in formData
                    });
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching property:', error);
                    setLoading(false);
                });
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Check if the field is nested (e.g., "other_details.building_health")
        if (name.includes('.')) {
            const [parent, child] = name.split('.'); // Split into parent and child keys
            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent], // Preserve other fields in the parent object
                    [child]: value, // Update the nested field
                },
            }));
        } else if (type === 'checkbox') {
            setFormData((prev) => ({
                ...prev,
                [name]: checked, // Use the `checked` property for checkboxes
            }));
        } else {
            // Handle top-level fields
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const isStepValid = () => {
        const requiredFields = {
            0: ['name', 'address', 'city', 'state', 'country', 'pin_code', 'description'],
            1: ['type', 'number_of_floors', 'number_of_rooms', 'return_type', 'govt_allotted_property_id', 'built_area_in_sqft', 'area_in_sqft', 'latitude', 'longitude'],
            2: ['valuation', 'investment_lock_in_period_in_months', 'other_details.construction_age_in_years', 'other_details.building_health'],
            3: ['amenities.school', 'amenities.hospital', 'amenities.park', 'amenities.shopping_mall'],
        };
        if (requiredFields[step]) {
            return requiredFields[step].every((field) => {
                if (field === 'has_loan') {
                    return typeof formData.has_loan === 'boolean';
                }
                if (field.includes('.')) {
                    const [parent, child] = field.split('.');
                    return formData[parent]?.[child] !== '' && formData[parent]?.[child] !== undefined;
                }
                return formData[field] !== '' && formData[field] !== undefined;
            });
        }
        return true;
    };

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            const formDataToSend = new FormData();

            // Append other form data
            Object.keys(formData).forEach((key) => {
                if (key === "property_images" && formData[key]) {
                    const files = Array.isArray(formData[key]) ? formData[key] : [formData[key]];
                    files.forEach((file) => {
                        if (file instanceof File) {
                            formDataToSend.append("property_images", file);
                        }
                    });
                } else if (key === "delete_images" && formData[key]) {
                    // Send delete_images as a JSON-encoded list
                    formDataToSend.append("delete_images", JSON.stringify(formData[key]));
                } else if (typeof formData[key] === 'object') {
                    formDataToSend.append(key, JSON.stringify(formData[key]));
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}properties/${id}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: formDataToSend,
            });

            if (res.ok) {
                alert('Property updated successfully!');
                router.push('/properties');
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to update property.');
            }
        } catch (error) {
            console.error('Error updating property:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const nextStep = () => {
        if (isStepValid()) {
            setStep((prev) => prev + 1);
        } else {
            const button = document.getElementById('next-button');
            if (button) {
                button.classList.add('animate-shake');
                setTimeout(() => button.classList.remove('animate-shake'), 500);
            }
        }
    };

    const prevStep = () => setStep((prev) => prev - 1);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData((prev) => ({
            ...prev,
            property_images: [...prev.property_images, ...files]
        }));
    };

    const handleDeleteImage = (index) => {
        const imageToDelete = formData.property_images[index];

        // If the image is a URL (string), add it to the deleted_images array
        if (typeof imageToDelete === 'string') {
            setDeletedImages((prev) => [...prev, imageToDelete]);
            setFormData((prev) => ({
                ...prev,
                delete_images: [...prev.delete_images, imageToDelete], // Ensure delete_images is an array
            }));
        }

        // Remove the image from the property_images array
        const updatedImages = formData.property_images.filter((_, i) => i !== index);
        setFormData((prev) => ({
            ...prev,
            property_images: updatedImages,
        }));
    };

    if (loading) return <div>Loading...</div>;
    if (!formData) return <div>Property not found</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-6xl mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Edit Property</h1>

                {/* Progress Indicator */}
                <ol className="flex justify-between mb-8">
                    {steps.map((label, index) => (
                        <li key={index}>
                            <div className={`w-full p-4 border rounded-lg flex items-center justify-between transition ${index < step ? 'bg-green-50 border-green-300 text-green-700' :
                                index === step ? 'bg-blue-100 border-blue-300 text-blue-700' :
                                    'bg-gray-100 border-gray-300 text-gray-900'
                                }`}>
                                <h3 className="font-medium">{index + 1}. {label}</h3>
                                {index < step ? <FaCheckCircle className="text-green-500" /> : index === step ? <FaArrowRight className="text-blue-500" /> : null}
                            </div>
                        </li>
                    ))}
                </ol>

                {/* Step Content */}
                {step === 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex flex-col">
                            <span>Property Name <span className="text-red-500">*</span></span>
                            <input name="name" placeholder="Property Name" value={formData.name} onChange={handleChange} className="border p-2 rounded-lg" required />
                        </label>
                        <label className="flex flex-col">
                            <span>Address <span className="text-red-500">*</span></span>
                            <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="border p-2 rounded-lg" required />
                        </label>
                        <label className="flex flex-col">
                            <span>City <span className="text-red-500">*</span></span>
                            <input name="city" placeholder="City" value={formData.city} onChange={handleChange} className={`border p-2 rounded-lg ${user.is_staff && !user.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`} readOnly={user.is_staff && !user.is_admin} />
                        </label>
                        <label className="flex flex-col">
                            <span>State <span className="text-red-500">*</span></span>
                            <input name="state" placeholder="State" value={formData.state} onChange={handleChange} className={`border p-2 rounded-lg ${user.is_staff && !user.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`} readOnly={user.is_staff && !user.is_admin} />
                        </label>
                        <label className="flex flex-col">
                            <span>Country <span className="text-red-500">*</span></span>
                            <input name="country" placeholder="Country" value={formData.country} onChange={handleChange} className={`border p-2 rounded-lg ${user.is_staff && !user.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`} readOnly={user.is_staff && !user.is_admin} />
                        </label>
                        <label className="flex flex-col">
                            <span>Pin Code <span className="text-red-500">*</span></span>
                            <input name="pin_code" placeholder="Pin Code" value={formData.pin_code} onChange={handleChange} className={`border p-2 rounded-lg ${user.is_staff && !user.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`} readOnly={user.is_staff && !user.is_admin} />
                        </label>
                        <label className="flex flex-col">
                            <span>Description <span className="text-red-500">*</span></span>
                            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="border p-2 rounded-lg col-span-2" required></textarea>
                        </label>
                    </div>
                )}

                {step === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex flex-col">
                            <span>Type <span className="text-red-500">*</span></span>
                            <select name="type" value={formData.type} onChange={handleChange} className={`border p-2 rounded-lg ${user.is_staff && !user.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`} disabled={user.is_staff && !user.is_admin}>
                                <option value="" disabled hidden>Select an Option</option>
                                <option value="COMMERCIAL">Commercial</option>
                                <option value="RESIDENTIAL">Residential</option>
                                <option value="INDUSTRIAL">Industrial</option>
                                <option value="AGRICULTURAL">Agricultural</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </label>
                        <label className="flex flex-col">
                            <span>Number of Floors <span className="text-red-500">*</span></span>
                            <input name="number_of_floors" placeholder="Number of Floors" value={formData.number_of_floors} onChange={handleChange} className={`border p-2 rounded-lg ${user.is_staff && !user.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`} readOnly={user.is_staff && !user.is_admin} />
                        </label>
                        <label className="flex flex-col">
                            <span>Number of Rooms <span className="text-red-500">*</span></span>
                            <input name="number_of_rooms" placeholder="Number of Rooms" value={formData.number_of_rooms} onChange={handleChange} className={`border p-2 rounded-lg ${user.is_staff && !user.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`} readOnly={user.is_staff && !user.is_admin} />
                        </label>
                        <label className="flex flex-col">
                            <span>Return Type <span className="text-red-500">*</span></span>
                            <select name="return_type" value={formData.return_type} onChange={handleChange} className={`border p-2 rounded-lg ${user.is_staff && !user.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`} disabled={user.is_staff && !user.is_admin}>
                                <option value="" disabled hidden>Select an Option</option>
                                <option value="RENT">Rent</option>
                                <option value="APPRECIATION">Appreciation</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </label>
                        <label className="flex flex-col">
                            <span>Government Property ID <span className="text-red-500">*</span></span>
                            <input name="govt_allotted_property_id" placeholder="Government Property ID" value={formData.govt_allotted_property_id} onChange={handleChange} className={`border p-2 rounded-lg ${user.is_staff && !user.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`} readOnly={user.is_staff && !user.is_admin} />
                        </label>
                        <label className="flex flex-col">
                            <span>Built Area in Sqft <span className="text-red-500">*</span></span>
                            <input name="built_area_in_sqft" type="number" step="0.01" placeholder="Built Area in Sqft" value={formData.built_area_in_sqft} onChange={handleChange} className={`border p-2 rounded-lg ${user.is_staff && !user.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`} />
                        </label>
                        <label className="flex flex-col">
                            <span>Area in Sqft <span className="text-red-500">*</span></span>
                            <input name="area_in_sqft" type="number" step="0.01" placeholder="Area in Sqft" value={formData.area_in_sqft} onChange={handleChange} className={`border p-2 rounded-lg ${user.is_staff && !user.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`} />
                        </label>
                        <label className="flex flex-col">
                            <span>Latitude <span className="text-red-500">*</span></span>
                            <input name="latitude" type="number" step="0.000001" placeholder="Latitude" value={formData.latitude} onChange={handleChange} className="border p-2 rounded-lg" />
                        </label>
                        <label className="flex flex-col">
                            <span>Longitude <span className="text-red-500">*</span></span>
                            <input name="longitude" type="number" step="0.000001" placeholder="Longitude" value={formData.longitude} onChange={handleChange} className="border p-2 rounded-lg" />
                        </label>
                        <label className="flex flex-col">
                            <span>Upload Images</span>
                            <input type="file" multiple onChange={handleFileChange} className="border p-2 rounded-lg" />
                        </label>
                        {/* Display Uploaded Images */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                            {formData.property_images.map((image, index) => (
                                <div key={index} className="relative group rounded-lg overflow-hidden shadow-lg">
                                    {typeof image === 'string' ? (
                                        <img
                                            src={image}
                                            alt={`property-image-${index}`}
                                            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : image instanceof File || image instanceof Blob ? (
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt={`property-image-${index}`}
                                            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <p className="text-center text-gray-500">Invalid image</p>
                                    )}
                                    {/* Delete button with hover effect */}
                                    {(user?.is_admin) &&
                                    <button
                                        onClick={() => handleDeleteImage(index)}
                                        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md hover:bg-red-700"
                                    >
                                        ✕
                                    </button>
}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex flex-col">
                            <span>Property Valuation <span className="text-red-500">*</span></span>
                            <input name="valuation" type="number" step="0.01" placeholder="Property Valuation" value={formData.valuation} onChange={handleChange} className={`border p-2 rounded-lg ${user.is_staff && !user.is_admin ? "bg-gray-100 cursor-not-allowed" : ""}`} readOnly={user.is_staff && !user.is_admin} />
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="has_loan"
                                checked={formData.has_loan || false} // Ensure a default value is used
                                onChange={handleChange}
                                className="border p-2 rounded-lg"
                            />
                            <span>Has Loan</span>
                        </label>
                        <label className="flex flex-col">
                            <span>Lock-in Period for Investments <span className="text-red-500">*</span></span>
                            <input name="investment_lock_in_period_in_months" type="number" placeholder="Lock-in Period for Investments" value={formData.investment_lock_in_period_in_months} onChange={handleChange} className="border p-2 rounded-lg" />
                        </label>
                        <label className="flex flex-col">
                            <span>Construction Age in Years <span className="text-red-500">*</span></span>
                            <input name="other_details.construction_age_in_years" type="number" placeholder="Construction Age in Years" value={formData.other_details.construction_age_in_years} onChange={handleChange} className="border p-2 rounded-lg" />
                        </label>
                        <label className="flex flex-col">
                            <span>Building Health <span className="text-red-500">*</span></span>
                            <select name="other_details.building_health" value={formData.other_details.building_health} onChange={handleChange} className="border p-2 rounded-lg">
                                <option value="" disabled hidden>Select an Option</option>
                                <option value="EXCELLENT">Excellent</option>
                                <option value="GOOD">Good</option>
                                <option value="AVERAGE">Average</option>
                                <option value="BAD">Bad</option>
                            </select>
                        </label>
                    </div>
                )}

                {step === 3 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.keys(formData.amenities).map((amenity) => (
                            <div key={amenity} className="flex items-center gap-2 border p-2 rounded-lg">
                                <label className="flex flex-col">
                                    <span>Amenities <span className="text-red-500">*</span></span>
                                    <label className="flex items-center space-x-2 w-full">
                                        <input
                                            type="checkbox"
                                            name={`amenities.${amenity}.available`}
                                            checked={formData.amenities[amenity].available}
                                            onChange={(e) => {
                                                const isChecked = e.target.checked;
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    amenities: {
                                                        ...prev.amenities,
                                                        [amenity]: {
                                                            available: isChecked,
                                                            distance_in_km: isChecked ? prev.amenities[amenity].distance_in_km : 0
                                                        }
                                                    }
                                                }));
                                            }}
                                        />
                                        <span className="capitalize">{amenity.replace('_', ' ')}</span>
                                    </label>
                                </label>
                                {formData.amenities[amenity].available && (
                                    <input
                                        type="number"
                                        name={`amenities.${amenity}.distance_in_km`}
                                        placeholder="Distance in km"
                                        value={formData.amenities[amenity].distance_in_km}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setFormData((prev) => ({
                                                ...prev,
                                                amenities: {
                                                    ...prev.amenities,
                                                    [amenity]: {
                                                        ...prev.amenities[amenity],
                                                        distance_in_km: value
                                                    }
                                                }
                                            }));
                                        }}
                                        className="border p-2 rounded-lg w-full"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {step === 4 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(formData).map(([key, value]) => (
                            <div key={key} className="border p-2 rounded-lg bg-gray-100">
                                <strong className="capitalize">{key.replace(/_/g, ' ')}:</strong>
                                {typeof value === 'object' && value !== null ? (
                                    Object.entries(value).map(([subKey, subValue]) => (
                                        <div key={subKey} className="ml-4">
                                            <strong className="capitalize">{subKey.replace(/_/g, ' ')}:</strong>
                                            {typeof subValue === 'object' ? (
                                                Object.entries(subValue).map(([innerKey, innerValue]) => (
                                                    <div key={innerKey} className="ml-6">
                                                        <strong className="capitalize">{innerKey.replace(/_/g, ' ')}:</strong> {innerValue.toString()}
                                                    </div>
                                                ))
                                            ) : (
                                                subValue.toString()
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <span> {value.toString()} </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6">
                    {step === 0 ? (
                        <button className="bg-gray-500 text-white py-2 px-4 rounded-lg">Back</button>
                    ) : (<button onClick={prevStep} className="bg-blue-500 text-white py-2 px-4 rounded-lg">Back</button>)}
                    {step < steps.length - 1 ? (
                        <button id="next-button" onClick={nextStep} className={`py-2 px-4 rounded-lg ${isStepValid() ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white animate-shake'}`}>Next</button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className={`bg-green-500 text-white py-2 px-4 rounded-lg ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting...' : 'Submit'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditProperty;