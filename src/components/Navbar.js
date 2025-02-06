'use client';

import React, { useState } from "react";
import Link from 'next/link';
import { useAuth } from "@/context/AuthContext"; // Import AuthContext

const Navbar = () => {
    const { user, logout } = useAuth(); // Get user data from AuthContext
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="bg-white dark:bg-gray-900 fixed top-4 left-4 right-4 z-50 shadow-lg p-4 rounded-2xl">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
                <Link href="/" className="flex items-center space-x-3">
                    <img src="/fp_logo.png" alt="FracProp" className="h-10" />
                </Link>

                {/* ✅ Desktop Menu (Visible on Large Screens) */}
                <div className="hidden md:flex space-x-6">
                    <Link href="/dashboard" className="py-2 px-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Home</Link>
                    <Link href="/properties" className="py-2 px-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Explore</Link>
                    <Link href="#" className="py-2 px-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Services</Link>
                    <Link href="#" className="py-2 px-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Pricing</Link>
                    <Link href="#" className="py-2 px-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Contact</Link>
                </div>

                {/* User Menu & Burger Icon */}
                <div className="flex items-center md:order-2 space-x-3 relative">
                    {/* User Menu Button */}
                    <button
                        type="button"
                        className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                        onClick={toggleUserMenu}
                    >
                        <span className="sr-only">Open user menu</span>
                        <img
                            className="w-8 h-8 rounded-full"
                            src={`https://ui-avatars.com/api/?name=${user?.first_name || 'User'}&background=random`}
                            alt="User profile"
                        />
                    </button>

                    {/* User Dropdown Menu */}
                    {isUserMenuOpen && (
                        <div className="absolute right-0 top-12 z-50 w-48 bg-white dark:bg-gray-700 shadow-md rounded-lg">
                            <div className="px-4 py-3">
                                <span className="block text-sm text-gray-900 dark:text-white">
                                    {user?.first_name} {user?.last_name}
                                </span>
                                <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                                    {user?.email}
                                </span>
                            </div>
                            <ul className="py-2">
                                <li><Link href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600">My Profile</Link></li>
                                <li><Link href="#" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600">Settings</Link></li>
                                <li><Link href="#" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600">Earnings</Link></li>
                                <li>
                                    <button
                                        onClick={logout}
                                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                                    >
                                        Sign out
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}

                    {/* Burger Menu Button (Mobile) */}
                    <button
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={toggleMenu}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* ✅ Mobile Menu (Hidden on Desktop) */}
            <div className={`fixed top-20 right-4 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out 
                    ${isMenuOpen ? "translate-x-0" : "translate-x-full"} z-40 h-screen md:hidden rounded-2xl`}>
                <div className="p-4">
                    <ul className="space-y-4 text-gray-900 dark:text-white">
                        <li><Link href="/dashboard" className="block py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700">Home</Link></li>
                        <li><Link href="#" className="block py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700">About</Link></li>
                        <li><Link href="#" className="block py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700">Services</Link></li>
                        <li><Link href="#" className="block py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700">Pricing</Link></li>
                        <li><Link href="#" className="block py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700">Contact</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
