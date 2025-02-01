'use client';

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Line } from "react-chartjs-2";
import Navbar from "@/components/Navbar";
import "chart.js/auto";

const Home = () => {
    const { user, token, logout } = useAuth();
    const router = useRouter();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (!token) {
            router.push("/login");
            return;
        }

        const dummyData = {
            totalInvestment: 500000,
            totalReturns: 12000,
            totalRentalIncome: 20000,
            totalProperties: 10,
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
        };

        setTimeout(() => {
            setDashboardData(dummyData);
            setLoading(false);
        }, 1000);
    }, [token, router]);

    const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);

    if (loading) return <p className="text-center mt-10 text-xl text-gray-600">Loading...</p>;
    if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

    const chartData = {
        labels: dashboardData?.investmentGrowth?.map((entry) => entry.date) || [],
        datasets: [
            {
                label: "Investment Growth",
                data: dashboardData?.investmentGrowth?.map((entry) => entry.amount) || [],
                borderColor: "#4CAF50",
                backgroundColor: "rgba(76, 175, 80, 0.2)",
                fill: true,
                tension: 0.4,
            },
        ],
    };

    return (
        <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
            <Navbar />

            {/* Main Content (Shifted Below Navbar) */}
            <div className="p-10 space-y-2 pt-27">
                <h1 className="text-3xl font-bold text-center text-gray-800">Welcome, {user?.first_name} 👋</h1>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Investment", value: `₹${dashboardData?.totalInvestment}` },
                    { label: "Total Returns", value: `₹${dashboardData?.totalReturns}` },
                    { label: "Total Rental Income", value: `₹${dashboardData?.totalRentalIncome}` },
                    { label: "Total Properties", value: dashboardData?.totalProperties },
                ].map((card, index) => (
                    <div key={index} className="p-6 bg-white shadow-lg rounded-xl transform transition-transform hover:scale-105 duration-300 ease-in-out">
                        <h3 className="text-xl font-semibold text-gray-700">{card.label}</h3>
                        <p className="text-2xl font-bold text-green-600">{card.value || 0}</p>
                    </div>
                ))}
            </div>

            {/* Investment Growth Chart */}
            <div className="bg-white p-6 shadow-lg rounded-xl flex flex-col md:flex-row justify-between items-center">
                {/* Chart Section */}
                <div className="w-full md:w-2/3">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 w-full text-center md:text-left">Investment Growth</h2>
                    <div className="relative w-full h-72 md:h-96">
                        <Line data={chartData} options={{ responsive: true }} />
                    </div>
                </div>

                {/* Additional Data Section */}
                <div className="w-full md:w-1/3 mt-6 md:mt-0 md:pl-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Key Metrics</h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">Current Investment Value</p>
                            <p className="text-xl font-bold text-green-600">₹{dashboardData?.totalInvestment}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">Total Returns</p>
                            <p className="text-xl font-bold text-green-600">₹{dashboardData?.totalReturns}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">Total Rental Income</p>
                            <p className="text-xl font-bold text-green-600">₹{dashboardData?.totalRentalIncome}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">Total Properties</p>
                            <p className="text-xl font-bold text-green-600">{dashboardData?.totalProperties}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions Section */}
            <div className="bg-white p-6 shadow-lg rounded-xl">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Last 3 Transactions</h2>
                <ul className="space-y-3">
                    {(dashboardData?.transactions || []).slice(0, 3).map((tx, index) => (
                        <li key={index} className="border-b py-3">
                            <span className="font-medium text-gray-700">{tx.description}</span> - ₹{tx.amount}
                        </li>
                    ))}
                </ul>
                <button className="mt-4 text-blue-500 hover:underline" onClick={() => router.push("/transactions")}>
                    View More
                </button>
            </div>

            {/* Explore Properties Button */}
            <div className="text-center">
                <button className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-3 rounded-full text-lg hover:scale-105 transition-transform duration-300" onClick={() => router.push("/properties")}>
                    Explore Properties to Invest In
                </button>
            </div>
        </div >
    );
};

export default Home;