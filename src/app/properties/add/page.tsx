'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { CheckCircle, ArrowRight, ArrowLeft, Upload, Home, Building, DollarSign, MapPin, Landmark } from 'lucide-react';

const steps = [
    'Property Details',
    'Specifications',
    'Valuation & Other Details',
    'Amenities',
    'Review & Submit'
];

const ListProperty = () => {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        country: '',
        pin_code: '',
        description: '',
        type: '',
        number_of_floors: '',
        number_of_rooms: '',
        return_type: '',
        govt_allotted_property_id: '',
        built_area_in_sqft: '',
        area_in_sqft: '',
        latitude: '',
        longitude: '',
        valuation: '',
        has_loan: false,
        investment_lock_in_period_in_months: '',
        other_details: {
            construction_age_in_years: '',
            building_health: ''
        },
        amenities: {
            school: { available: false, distance_in_km: 0 },
            hospital: { available: false, distance_in_km: 0 },
            shopping_mall: { available: false, distance_in_km: 0 },
            park: { available: false, distance_in_km: 0 }
        },
        property_images: []
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData((prev) => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: type === 'checkbox' ? checked : value }
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData((prev) => ({
            ...prev,
            property_images: files
        }));
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

            Object.keys(formData).forEach((key) => {
                if (key === "property_images" && formData[key]) {
                    const files = Array.isArray(formData[key]) ? formData[key] : [formData[key]];

                    files.forEach((file) => {
                        if (file instanceof File) {
                            formDataToSend.append("property_images", file);
                        }
                    });
                } else if (typeof formData[key] === 'object') {
                    formDataToSend.append(key, JSON.stringify(formData[key]));
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}properties/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: formDataToSend
            });

            const data = await res.json();

            if (res.ok) {
                alert('Property listed successfully!');
                router.push('/properties'); // Redirect to properties list page
            } else {
                alert(data.message || 'Failed to list property.');
            }
        } catch (error) {
            console.error('Error submitting property:', error);
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

    // Step icons
    const stepIcons = [
        <Home key="home" className="w-5 h-5" />,
        <Building key="building" className="w-5 h-5" />,
        <DollarSign key="dollar" className="w-5 h-5" />,
        <MapPin key="map" className="w-5 h-5" />,
        <CheckCircle key="check" className="w-5 h-5" />
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-28 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                        List Your Property
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Complete the form below to list your property for investment opportunities.
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="mb-12">
                    <div className="flex justify-between items-center relative">
                        {/* Line behind the icons */}
                        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>

                        {steps.map((label, index) => (
                            <div key={index} className="flex flex-col items-center relative z-10">
                                {/* Step Circle */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${index < step ? 'bg-green-500 text-white' :
                                        index === step ? 'bg-purple-600 text-white' :
                                            'bg-gray-200 text-gray-500'
                                    }`}>
                                    {stepIcons[index]}
                                </div>

                                {/* Step Label */}
                                <span className={`text-xs mt-2 font-medium text-center ${index <= step ? 'text-gray-900' : 'text-gray-500'
                                    }`}>
                                    {label}
                                </span>

                                {/* Progress Line (for completed steps) */}
                                {index < step && (
                                    <div className="absolute top-5 left-1/2 w-full h-0.5 bg-green-500 z-0"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Container */}
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                    {/* Step Content */}
                    {step === 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <label className="flex flex-col">
                                <span className="text-gray-700 font-medium mb-1">Property Name <span className="text-red-500">*</span></span>
                                <input
                                    name="name"
                                    placeholder="Property Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </label>
                            <label className="flex flex-col">
                                <span className="text-gray-700 font-medium mb-1">Address <span className="text-red-500">*</span></span>
                                <input
                                    name="address"
                                    placeholder="Address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </label>
                            <label className="flex flex-col">
                                <span className="text-gray-700 font-medium mb-1">City <span className="text-red-500">*</span></span>
                                <input
                                    name="city"
                                    placeholder="City"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </label>
                            <label className="flex flex-col">
                                <span className="text-gray-700 font-medium mb-1">State <span className="text-red-500">*</span></span>
                                <input
                                    name="state"
                                    placeholder="State"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </label>
                            <label className="flex flex-col">
                                <span className="text-gray-700 font-medium mb-1">Country <span className="text-red-500">*</span></span>
                                <input
                                    name="country"
                                    placeholder="Country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </label>
                            <label className="flex flex-col">
                                <span className="text-gray-700 font-medium mb-1">Pin Code <span className="text-red-500">*</span></span>
                                <input
                                    name="pin_code"
                                    placeholder="Pin Code"
                                    value={formData.pin_code}
                                    onChange={handleChange}
                                    className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </label>
                            <label className="flex flex-col md:col-span-2">
                                <span className="text-gray-700 font-medium mb-1">Description <span className="text-red-500">*</span></span>
                                <textarea
                                    name="description"
                                    placeholder="Description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px]"
                                    required
                                ></textarea>
                            </label>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <label className="flex flex-col">
                                <span className="text-gray-700 font-medium mb-1">Type <span className="text-red-500">*</span></span>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="" disabled hidden>Select an Option</option>
                                    <option value="COMMERCIAL">Commercial</option>
                                    <option value="RESIDENTIAL">Residential</option>
                                    <option value="INDUSTRIAL">Industrial</option>
                                    <option value="AGRICULTURAL">Agricultural</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </label>
                            <label className="flex flex-col">
                                <span className="text-gray-700 font-medium mb-1">Number of Floors <span className="text-red-500">*</span></span>
                                <input
                                    name="number_of_floors"
                                    placeholder="Number of Floors"
                                    value={formData.number_of_floors}
                                    onChange={handleChange}
                                    className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </label>
                            <label className="flex flex-col">
                                <span className="text-gray-700 font-medium mb-1">Number of Rooms <span className="text-red-500">*</span></span>
                                <input
                                    name="number_of_rooms"
                                    placeholder="Number of Rooms"
                                    value={formData.number_of_rooms}
                                    onChange={handleChange}
                                    className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </label>
                            <label className="flex flex-col">
                                <span className="text-gray-700 font-medium mb-1">Return Type <span className="text-red-500">*</span></span>
                                <select
                                    name="return_type"
                                    value={formData.return_type}
                                    onChange={handleChange}
                                    className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="" disabled hidden>Select an Option</option>
                                    <option value="RENT">Rent</option>
                                    <option value="APPRECIATION">Appreciation</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </label>
                            <label className="flex flex-col">
                                <span className="text-gray-700 font-medium mb-1">Government Property ID <span className="text-red-500">*</span></span>
                                <input
                                    name="govt_allotted_property_id"
                                    placeholder="Government Property ID"
                                    value={formData.govt_allotted_property_id}
                                    onChange={handleChange}
                                    className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </label>
                            <label className="flex flex-col">
                                <span className="text-gray-700 font-medium mb-1">Built Area in Sqft <span className="text-red-500">*</span></span>
                                <input
                                    name="built_area_in_sqft"
                                    type="number"
                                    step="0.01"
                                    placeholder="Built Area in Sqft"
                                    value={formData.built_area_in_sqft}
                                    onChange={handleChange}
                                    className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </label>
                            <label className="flex flex-col">
                                <span className="text-gray-700 font-medium mb-1">Area in Sqft <span className="text-red-500">*</span></span>
                                <input
                                    name="area_in_sqft"
                                    type="number"
                                    step="0.01"
                                    placeholder="Area in Sqft"
                                    value={formData.area_in_sqft}
                                    onChange={handleChange}
                                    className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </label>
                            <label className="flex flex-col">
                                <span className="text-gray-700 font-medium mb-1">Latitude <span className="text-red-500">*</span></span>
                                <input
                                    name="latitude"
                                    type="number"
                                    step="0.000001"
                                    placeholder="Latitude"
                                    value={formData.latitude}
                                    onChange={handleChange}
                                    className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </label>
                            <label className="flex flex-col">
                                <span className="text-gray-700 font-medium mb-1">Longitude <span className="text-red-500">*</span></span>
                                <input
                                    name="longitude"
                                    type="number"
                                    step="0.000001"
                                    placeholder="Longitude"
                                    value={formData.longitude}
                                    onChange={handleChange}
                                    className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </label>
                            <label className="flex flex-col md:col-span-2">
                                <span className="text-gray-700 font-medium mb-1">Upload Images</span>
                                <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500 mb-2">Drag and drop files here, or click to browse</p>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                    />
                                </div>
                            </label>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <label className="flex flex-col">
                                <span className="text-gray-700 font-medium mb-1">Property Valuation <span className="text-red-500">*</span></span>
                                <input
                                    name="valuation"
                                    type="number"
                                    step="0.01"
                                    placeholder="Property Valuation"
                                    value={formData.valuation}
                                    onChange={handleChange}
                                    className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </label>
                            <label className="flex items-center space-x-2 p-3">
                                <input
                                    type="checkbox"
                                    name="has_loan"
                                    checked={formData.has_loan}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                                />
                                <span className="text-gray-700 font-medium">Has Loan</span>
                            </label>
                            <label className="flex flex-col">
                                <span className="text-gray-700 font-medium mb-1">Lock-in Period for Investments (months) <span className="text-red-500">*</span></span>
                                <input
                                    name="investment_lock_in_period_in_months"
                                    type="number"
                                    placeholder="Lock-in Period for Investments"
                                    value={formData.investment_lock_in_period_in_months}
                                    onChange={handleChange}
                                    className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </label>
                            <label className="flex flex-col">
                                <span className="text-gray-700 font-medium mb-1">Construction Age in Years <span className="text-red-500">*</span></span>
                                <input
                                    name="other_details.construction_age_in_years"
                                    type="number"
                                    placeholder="Construction Age in Years"
                                    value={formData.other_details.construction_age_in_years}
                                    onChange={handleChange}
                                    className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </label>
                            <label className="flex flex-col">
                                <span className="text-gray-700 font-medium mb-1">Building Health <span className="text-red-500">*</span></span>
                                <select
                                    name="other_details.building_health"
                                    value={formData.other_details.building_health}
                                    onChange={handleChange}
                                    className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Object.keys(formData.amenities).map((amenity) => (
                                <div key={amenity} className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center mb-3">
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
                                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 mr-2"
                                        />
                                        <span className="text-gray-700 font-medium capitalize">{amenity.replace('_', ' ')}</span>
                                    </div>
                                    {formData.amenities[amenity].available && (
                                        <div className="ml-6">
                                            <label className="flex flex-col">
                                                <span className="text-gray-700 text-sm mb-1">Distance in km</span>
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
                                                    className="border border-gray-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                />
                                            </label>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {step === 4 && (
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Review Your Property Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Object.entries(formData).map(([key, value]) => {
                                    // Skip property_images in the review
                                    if (key === 'property_images') return null;

                                    return (
                                        <div key={key} className="bg-gray-50 p-4 rounded-lg">
                                            <strong className="text-gray-700 capitalize block mb-2">{key.replace(/_/g, ' ')}:</strong>
                                            {typeof value === 'object' && value !== null ? (
                                                <div className="pl-4 border-l-2 border-purple-200">
                                                    {Object.entries(value).map(([subKey, subValue]) => (
                                                        <div key={subKey} className="mb-2">
                                                            <strong className="text-gray-600 capitalize">{subKey.replace(/_/g, ' ')}:</strong>
                                                            {typeof subValue === 'object' && subValue !== null ? (
                                                                <div className="pl-4 border-l-2 border-purple-100 mt-1">
                                                                    {Object.entries(subValue).map(([innerKey, innerValue]) => (
                                                                        <div key={innerKey} className="text-sm">
                                                                            <strong className="text-gray-500 capitalize">{innerKey.replace(/_/g, ' ')}:</strong>{' '}
                                                                            <span className="text-gray-700">{String(innerValue)}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-700 ml-1">{String(subValue)}</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-700">{String(value)}</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                        {step === 0 ? (
                            <button
                                className="px-6 py-2 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed"
                                disabled
                            >
                                Back
                            </button>
                        ) : (
                            <button
                                onClick={prevStep}
                                className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center"
                            >
                                <ArrowLeft size={16} className="mr-2" /> Back
                            </button>
                        )}

                        {step < steps.length - 1 ? (
                            <button
                                id="next-button"
                                onClick={nextStep}
                                className={`px-6 py-2 rounded-lg flex items-center ${isStepValid()
                                    ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:shadow-lg'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    } transition-all`}
                            >
                                Next <ArrowRight size={16} className="ml-2" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className={`px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:shadow-lg transition-all ${submitting ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                            >
                                {submitting ? 'Submitting...' : 'Submit Property'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListProperty;
