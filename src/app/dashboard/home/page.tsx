'use client';

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import Image from 'next/image';

const Home = () => {
    const { user, token, logout } = useAuth();
    const router = useRouter();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
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
            {/* Navbar */}
            <nav className="bg-white text-black p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50 shadow-lg">
                <div>
                    <Image src="/fp_logo.png" alt="Logo" className="h-10" />
                </div>
                {/* </nav> */}


                {/* Burger Menu (Visible only on small screens) */}
                <button className="lg:hidden text-black" onClick={handleMenuToggle}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="black">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* Menu Options (Visible only on large screens) */}
                <div className="hidden lg:flex space-x-6">
                    <button
                        onClick={() => router.push("/profile")}
                        className="flex items-center space-x-2 hover:text-gray-200 transition-colors duration-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        <span>Profile</span>
                    </button>
                    <button
                        onClick={() => router.push("/properties")}
                        className="flex items-center space-x-2 hover:text-gray-200 transition-colors duration-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        <span>Properties</span>
                    </button>
                    <button
                        onClick={() => router.push("/settings")}
                        className="flex items-center space-x-2 hover:text-gray-200 transition-colors duration-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                        <span>Settings</span>
                    </button>
                    <button
                        onClick={logout}
                        className="flex items-center space-x-2 hover:text-gray-200 transition-colors duration-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                        </svg>
                        <span>Logout</span>
                    </button>
                </div>
            </nav>


            {/* Sliding Menu (Now Working) */}
            <div className={`fixed top--2 right-0 h-full w-64 bg-white text-black shadow-lg transform transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "translate-x-full"} z-50 lg:hidden`}>
                <div className="p-4">
                    <button onClick={handleMenuToggle} className="absolute top-4 right-4 text-black">✖</button>
                    <button onClick={() => router.push("/profile")} className="block w-full text-left py-2 hover:bg-gray-100">Profile</button>
                    <button onClick={() => router.push("/properties")} className="block w-full text-left py-2 hover:bg-gray-100">Properties</button>
                    <button onClick={() => router.push("/settings")} className="block w-full text-left py-2 hover:bg-gray-100">Settings</button>
                    <button onClick={logout} className="block w-full text-left py-2 hover:bg-gray-100">Logout</button>
                </div>
            </div>

            {/* Overlay for menu (Visible only on small screens) */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={handleMenuToggle}></div>
            )}

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