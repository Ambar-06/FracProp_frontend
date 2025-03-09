'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { CheckCircle, XCircle, Building, User, MapPin, DollarSign, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ApproveRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [processing, setProcessing] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchApprovalRequests = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}properties/approval-requests/`, {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                const data = await res.json();
                if (data.success) {
                    setRequests(data.data);
                } else {
                    setError('Failed to fetch approval requests.');
                }
            } catch (err) {
                setError('Failed to load approval requests.');
            } finally {
                setLoading(false);
            }
        };
        fetchApprovalRequests();
    }, []);

    const handleApprove = async (uuid) => {
        if (processing) return;
        setProcessing(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}properties/approval-requests/${uuid}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: 'APPROVE' }),
            });
            if (res.ok) {
                setRequests((prev) => prev.filter((req) => req.uuid !== uuid));
            } else {
                console.error('Approval failed');
            }
        } catch (err) {
            console.error('Approval request failed');
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!rejectReason || processing) return;
        setProcessing(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}properties/approval-requests/${selectedRequest.uuid}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: 'REJECT', remarks: rejectReason }),
            });
            if (res.ok) {
                setRequests((prev) => prev.filter((req) => req.uuid !== selectedRequest.uuid));
                setSelectedRequest(null);
                setRejectReason('');
            } else {
                console.error('Rejection failed');
            }
        } catch (err) {
            console.error('Rejection request failed');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Loading approval requests...</p>
        </div>
    );
    
    if (error) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
            <div className="bg-red-100 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                <p>{error}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 pt-28 pb-16">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Property Approval Requests</h1>
                
                {requests.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                        <div className="flex justify-center mb-4">
                            <CheckCircle className="h-16 w-16 text-green-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">All Caught Up!</h3>
                        <p className="text-gray-600">There are no pending approval requests at this time.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {requests.map((req) => (
                            <div key={req.uuid} className="bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md">
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                                        <div className="bg-purple-100 rounded-lg p-4 flex items-center justify-center flex-shrink-0">
                                            <Building className="h-12 w-12 text-purple-600" />
                                        </div>
                                        
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-gray-900">{req.property.name}</h3>
                                            
                                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex items-start">
                                                    <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                                                    <p className="text-gray-700">
                                                        {req.property.address}, {req.property.city}, {req.property.state}, {req.property.country} - {req.property.pin_code}
                                                    </p>
                                                </div>
                                                
                                                <div className="flex items-center">
                                                    <Home className="h-5 w-5 text-gray-500 mr-2" />
                                                    <p className="text-gray-700">Type: <span className="font-medium">{req.property.type}</span></p>
                                                </div>
                                                
                                                <div className="flex items-center">
                                                    <div className="h-5 w-5 flex items-center justify-center text-gray-500 mr-2">
                                                        <span className="text-xs font-bold">ft²</span>
                                                    </div>
                                                    <p className="text-gray-700">
                                                        Built Area: <span className="font-medium">{req.property.built_area_in_sqft.toLocaleString()} sqft</span>
                                                    </p>
                                                </div>
                                                
                                                <div className="flex items-center">
                                                    <div className="h-5 w-5 flex items-center justify-center text-gray-500 mr-2">
                                                        <span className="text-xs font-bold">ft²</span>
                                                    </div>
                                                    <p className="text-gray-700">
                                                        Total Area: <span className="font-medium">{req.property.area_in_sqft.toLocaleString()} sqft</span>
                                                    </p>
                                                </div>
                                                
                                                <div className="flex items-center">
                                                    <DollarSign className="h-5 w-5 text-gray-500 mr-2" />
                                                    <p className="text-gray-700">
                                                        Valuation: <span className="font-medium">₹{req.property.valuation.toLocaleString()}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-6 pt-6 border-t border-gray-100">
                                                <h4 className="text-lg font-medium text-gray-800 mb-3">Requested By</h4>
                                                <div className="flex items-start">
                                                    <User className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                                                    <div>
                                                        <p className="text-gray-700"><span className="font-medium">{req.requested_by.name}</span></p>
                                                        <p className="text-gray-600 text-sm">{req.requested_by.email} • {req.requested_by.phone_number}</p>
                                                        <p className="text-gray-500 text-xs mt-1">User ID: {req.requested_by.uuid}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="px-6 py-4 bg-gray-50 flex flex-wrap gap-3 justify-end">
                                    <button
                                        onClick={() => handleApprove(req.uuid)}
                                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-70"
                                        disabled={processing}
                                    >
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        {processing ? "Processing..." : "Approve"}
                                    </button>
                                    <button
                                        onClick={() => setSelectedRequest(req)}
                                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-70"
                                        disabled={processing}
                                    >
                                        <XCircle className="w-5 h-5 mr-2" />
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Reject Reason Popup */}
            {selectedRequest && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md mx-4">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Reject Property Request</h2>
                        <p className="text-gray-600 text-sm mb-4">Please provide a reason for rejecting this property request.</p>
                        
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Enter reason for rejection"
                            rows={4}
                        ></textarea>
                        
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-all"
                                disabled={processing}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-70"
                                disabled={!rejectReason.trim() || processing}
                            >
                                {processing ? "Processing..." : "Confirm Rejection"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApproveRequests;
