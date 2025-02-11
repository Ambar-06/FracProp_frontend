'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
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

    if (loading) return <p className="text-center mt-20 text-xl text-gray-600">Loading approval requests...</p>;
    if (error) return <p className="text-center text-red-500 mt-20">{error}</p>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-4xl mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Approval Requests</h1>
                {requests.length === 0 ? (
                    <p className="text-center text-gray-600">No pending approval requests.</p>
                ) : (
                    requests.map((req) => (
                        <div key={req.uuid} className="flex items-center justify-between border p-4 rounded-lg mb-4 bg-white shadow">
                            <div>
                                <p className="text-lg font-semibold">Request ID: {req.uuid}</p>
                                <p className="text-gray-600">Property ID: {req.property}</p>
                                <p className="text-gray-600">Requested By: {req.requested_by}</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleApprove(req.uuid)}
                                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition disabled:bg-gray-400"
                                    disabled={processing}
                                >
                                    <FaCheckCircle className="inline mr-2" /> {processing ? "Processing..." : "Approve"}
                                </button>
                                <button
                                    onClick={() => setSelectedRequest(req)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition disabled:bg-gray-400"
                                    disabled={processing}
                                >
                                    <FaTimesCircle className="inline mr-2" /> Reject
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Reject Reason Popup */}
            {selectedRequest && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold text-gray-800">Reject Request</h2>
                        <p className="text-gray-600 text-sm mt-2">Enter the reason for rejection:</p>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="w-full mt-3 p-2 border border-gray-300 rounded"
                            placeholder="Enter reason"
                        ></textarea>
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                                disabled={processing}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition disabled:bg-gray-400"
                                disabled={processing}
                            >
                                {processing ? "Processing..." : "Confirm Reject"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApproveRequests;
