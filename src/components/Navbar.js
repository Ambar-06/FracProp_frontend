'use client';

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [pendingApprovals, setPendingApprovals] = useState(0);

    useEffect(() => {
        const updateSize = () => {
            setIsDesktop(window.innerWidth > 1040);
        };

        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    useEffect(() => {
        if (user?.is_admin) {
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}properties/approval-requests/`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setPendingApprovals(data.data.length);
                }
            })
            .catch((err) => console.error("Error fetching approval requests:", err));
        }
    }, [user]);

    const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="bg-white dark:bg-gray-900 fixed top-4 left-4 right-4 z-50 shadow-lg p-4 rounded-2xl">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
                <Link href="/" className="flex items-center space-x-3">
                    <img src="/fp_logo.png" alt="FracProp" className="h-10" />
                </Link>

                {isDesktop && (
                    <div className="flex space-x-6">
                        <Link href="/dashboard" className="py-2 px-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Home</Link>
                        <Link href="/properties" className="py-2 px-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Explore</Link>
                        {(user?.is_admin || user?.is_staff) && (
                            <Link href="/properties/add" className="py-2 px-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded">List Property</Link>
                        )}
                        {(user?.is_admin) && (
                            <Link href="/properties/approve" className="py-2 px-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded relative">
                                Approve Property
                                {pendingApprovals > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                        {pendingApprovals}
                                    </span>
                                )}
                            </Link>
                        )}
                        <Link href="/blog" className="py-2 px-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Blogs</Link>
                        <Link href="#" className="py-2 px-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Pricing</Link>
                        <Link href="#" className="py-2 px-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Contact</Link>
                    </div>
                )}

                <div className="flex items-center md:order-2 space-x-3 relative">
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
                                <li><Link href="/user/profile" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600">My Profile</Link></li>
                                <li><Link href="/user/favourites" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600">Favourites</Link></li>
                                <li><Link href="/settings" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600">Settings</Link></li>
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

                    {!isDesktop && (
                        <button
                            type="button"
                            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={toggleMenu}
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {!isDesktop && (
                <div className={`fixed top-20 right-4 w-64 bg-white dark:bg-gray-800 shadow-lg z-40 h-screen rounded-2xl transition-transform transform ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
                    <div className="p-4">
                        <ul className="space-y-4 text-gray-900 dark:text-white">
                            <li><Link href="/dashboard" className="block py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700">Home</Link></li>
                            <li><Link href="/properties" className="block py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700">Explore</Link></li>
                            {(user?.is_admin || user?.is_staff) && (
                                <li>
                                    <Link href="/properties/add" className="block py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700">
                                        List Property
                                    </Link>
                                </li>
                            )}
                            {(user?.is_admin) && (
                                <li className="relative">
                                    <Link href="/properties/approve" className="block py-2 px-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                                        Approve Property
                                        {pendingApprovals > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                                {pendingApprovals}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            )}
                             <li><Link href="/blog" className="block py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700">Blogs</Link></li>
                            <li><Link href="#" className="block py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700">Pricing</Link></li>
                            <li><Link href="#" className="block py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700">Contact</Link></li>
                        </ul>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
