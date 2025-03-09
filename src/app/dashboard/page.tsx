'use client';

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Line } from "react-chartjs-2";
import Navbar from "@/components/Navbar";
import "chart.js/auto";
import { ArrowUpRight, Building, CreditCard, DollarSign, Home, TrendingUp, Wallet } from 'lucide-react';
import Link from "next/link";

const HomePage = () => {
    const { user, token, logout } = useAuth();
    const router = useRouter();
    const [dashboardData, setDashboardData] = useState(null);
    const [investmentData, setInvestmentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) {
            router.push("/login");
            return;
        }

        // Fetch Dashboard Data
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}user/dashboard`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
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
                    setDashboardData({
                        totalInvestment: data.data.total_investment,
                        totalReturns: 0, // Add if API provides this data
                        totalRentalIncome: data.data.total_rental_income,
                        totalProperties: data.data.total_properties,
                        valuationChange: data.data.increase_in_valuation || 0, // Ensure no undefined values
                        investmentGrowth: [
                            { date: "Jan", amount: 10000 },
                            { date: "Feb", amount: 15000 },
                            { date: "Mar", amount: 20000 },
                            { date: "Apr", amount: 25000 },
                            { date: "May", amount: 30000 },
                        ],
                        transactions: [
                            { description: "Property Investment", amount: 100000 },
                            { description: "Rental Income", amount: 5000 },
                            { description: "Property Sale", amount: 200000 },
                        ],
                    });
                } else {
                    setError("Failed to fetch dashboard data.");
                }
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load dashboard data.");
            });

        // Fetch Investment Data
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}investments/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
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
                    setInvestmentData(data.data);
                } else {
                    setError("Failed to fetch investment data.");
                }
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load investment data.");
                setLoading(false);
            });
    }, [token, router]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-purple-600 animate-spin mb-4"></div>
                <p className="text-gray-700">Loading your investments...</p>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
                <p className="text-red-500 text-center">{error}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-all"
                >
                    Try Again
                </button>
            </div>
        </div>
    );

    // Chart Data for Investment Growth
    const chartData = {
        labels: dashboardData?.investmentGrowth?.map((entry) => entry.date) || [],
        datasets: [
            {
                label: "Investment Growth",
                data: dashboardData?.investmentGrowth?.map((entry) => entry.amount) || [],
                borderColor: "#a855f7",
                backgroundColor: "rgba(168, 85, 247, 0.2)",
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointBackgroundColor: "#a855f7",
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#333',
                bodyColor: '#333',
                borderColor: 'rgba(168, 85, 247, 0.3)',
                borderWidth: 1,
                displayColors: false,
                padding: 10,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            },
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
                ticks: {
                    color: 'rgba(0, 0, 0, 0.7)',
                },
            },
            y: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
                ticks: {
                    color: 'rgba(0, 0, 0, 0.7)',
                    callback: function(value) {
                        return '₹' + value.toLocaleString();
                    }
                },
            },
        },
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <div className="pt-28 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                        Welcome, {user?.first_name} 👋
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Track your property investments, monitor performance, and discover new opportunities all in one place.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { 
                            label: "Total Investment", 
                            value: `₹${investmentData?.overall_investment?.toLocaleString() || 0}`,
                            icon: <Wallet className="h-6 w-6 text-purple-500" />,
                            change: "+12.5%"
                        },
                        { 
                            label: "Valuation Change", 
                            value: `${dashboardData?.valuationChange || 0}%`,
                            icon: <TrendingUp className="h-6 w-6 text-green-500" />,
                            change: "+3.2%"
                        },
                        { 
                            label: "Total Rental Income", 
                            value: `₹${dashboardData?.totalRentalIncome || 0}`,
                            icon: <DollarSign className="h-6 w-6 text-blue-500" />,
                            change: "+5.7%"
                        },
                        { 
                            label: "Total Properties", 
                            value: investmentData?.total_properties_invested || 0,
                            icon: <Building className="h-6 w-6 text-pink-500" />,
                            change: "+1"
                        },
                    ].map((card, index) => (
                        <div key={index} className="bg-white rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 rounded-lg bg-gray-50">
                                    {card.icon}
                                </div>
                                <span className="text-xs text-green-500 flex items-center">
                                    {card.change} <ArrowUpRight className="h-3 w-3 ml-1" />
                                </span>
                            </div>
                            <h3 className="text-sm font-medium text-gray-600 mb-1">{card.label}</h3>
                            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Investment Growth Chart */}
                    <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Investment Growth</h2>
                        <div className="h-80">
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    </div>

                    {/* Investment Breakdown */}
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Investment Breakdown</h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-sm text-gray-600">Rental Assets</p>
                                    <span className="text-xs text-green-500">70%</span>
                                </div>
                                <p className="text-xl font-bold text-gray-900">₹{investmentData?.total_invested_in_rental_assests?.toLocaleString() || 0}</p>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-sm text-gray-600">Non-Rental Assets</p>
                                    <span className="text-xs text-green-500">30%</span>
                                </div>
                                <p className="text-xl font-bold text-gray-900">₹{investmentData?.total_invested_in_non_rental_assests?.toLocaleString() || 0}</p>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Properties Section */}
                    <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Your Properties</h2>
                            <Link href="/properties" className="text-purple-600 text-sm hover:text-purple-700 transition-colors">
                                View All
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {investmentData?.properties?.slice(0, 3).map((property) => (
                                <div key={property.uuid} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="flex-shrink-0 p-3 bg-gray-100 rounded-lg mr-4">
                                        <Home className="h-6 w-6 text-purple-500" />
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="text-lg font-semibold text-gray-800">{property.name}</h3>
                                        <p className="text-sm text-gray-600">{property.address}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Investment</p>
                                        <p className="text-lg font-bold text-gray-900">₹{property.investment_amount?.toLocaleString() || 0}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Transactions Section */}
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Recent Transactions</h2>
                            <Link href="/transactions" className="text-purple-600 text-sm hover:text-purple-700 transition-colors">
                                View All
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {(dashboardData?.transactions || []).slice(0, 3).map((tx, index) => (
                                <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                                    <div className="flex-shrink-0 p-3 bg-gray-100 rounded-lg mr-4">
                                        <CreditCard className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-sm font-medium text-gray-800">{tx.description}</p>
                                        <p className="text-xs text-gray-600">Today, 12:30 PM</p>
                                    </div>
                                    <p className="text-lg font-bold text-gray-900">₹{tx.amount.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Explore Properties Button */}
                <div className="text-center mt-12">
                    <button 
                        className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-300" 
                        onClick={() => router.push("/properties")}
                    >
                        Explore Properties to Invest In
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
