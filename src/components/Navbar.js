'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
    const { user, token, logout } = useAuth();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);

    return (
        <>
        {/* Navbar */}
        <nav className="bg-white text-black p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50 shadow-lg">
        <div>
            <img src="/fp_logo.png" alt="Logo" className="h-10" />
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
    </>
    );
};

export default Navbar;
