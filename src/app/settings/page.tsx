"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { Shield, Bell, CreditCard, User } from 'lucide-react';

const SettingsPage = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState("profile"); // State to manage the active tab

  // Define the tabs and their corresponding content
  const tabs = [
    { id: "profile", label: "Profile", icon: <User className="w-5 h-5 mr-2" />, content: <ProfileSettings /> },
    { id: "security", label: "Security", icon: <Shield className="w-5 h-5 mr-2" />, content: <SecuritySettings /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-5 h-5 mr-2" />, content: <NotificationSettings /> },
    { id: "billing", label: "Billing", icon: <CreditCard className="w-5 h-5 mr-2" />, content: <BillingSettings /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-28 pb-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

        {/* Settings Layout */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Tabs on the Left Side */}
          <div className="w-full md:w-64 mb-6 md:mb-0">
            <div className="bg-white shadow-sm rounded-xl p-4">
              <ul className="space-y-2">
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      className={`w-full flex items-center text-left px-4 py-3 rounded-lg transition-all ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium shadow-md"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Content on the Right Side */}
          <div className="flex-1 bg-white shadow-sm rounded-xl p-6">
            {tabs.find((tab) => tab.id === activeTab)?.content}
          </div>
        </div>
      </div>
    </div>
  );
};

// Example Components for Each Tab
const ProfileSettings = () => (
  <div>
    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Profile Settings</h2>
    <p className="text-gray-600 mb-6">Update your profile information here.</p>
    
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input 
            type="text" 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter your first name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input 
            type="text" 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter your last name"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <input 
          type="email" 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Enter your email address"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
        <textarea 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          rows={4}
          placeholder="Tell us about yourself"
        ></textarea>
      </div>
      
      <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all">
        Save Changes
      </button>
    </div>
  </div>
);

const SecuritySettings = () => {
  const { token } = useAuth();
  const [is2FAEnabled, setIs2FAEnabled] = useState<boolean | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}user/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch profile.");

        const data = await response.json();
        if (data.success) {
          setIs2FAEnabled(data.data.is_2fa_enabled);
        } else {
          throw new Error(data.message || "Failed to fetch profile.");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, [token]);

  const fetchQrCode = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}user/auth/2fa`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch QR code.");

      const data = await response.json();
      if (data.success) {
        setQrUrl(data.data.qr_url);
        setError(null);
      } else {
        throw new Error(data.message || "Failed to fetch QR code.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const activate2FA = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}user/auth/2fa`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp }),
      });

      if (!response.ok) throw new Error("Failed to activate 2FA.");

      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setIs2FAEnabled(true);
        setError(null);
      } else {
        throw new Error(data.message || "Failed to activate 2FA.");
      }
    } catch (err) {
      setError(err.message);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const deactivate2FA = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}user/auth/2fa`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to deactivate 2FA.");

      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setIs2FAEnabled(false);
        setError(null);
      } else {
        throw new Error(data.message || "Failed to deactivate 2FA.");
      }
    } catch (err) {
      setError(err.message);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Security Settings</h2>
      <p className="text-gray-600 mb-6">Manage your account security settings here.</p>

      <div className="space-y-8">
        <div className="p-6 border border-gray-200 rounded-xl bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Two-Factor Authentication (2FA)</h3>
          <p className="text-gray-600 mb-4">Add an extra layer of security to your account by enabling two-factor authentication.</p>
          
          {is2FAEnabled === null ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : is2FAEnabled ? (
            <button
              className="px-6 py-2 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-600 transition-all"
              onClick={deactivate2FA}
              disabled={loading}
            >
              {loading ? "Processing..." : "Deactivate 2FA"}
            </button>
          ) : (
            <button
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
              onClick={fetchQrCode}
              disabled={loading}
            >
              {loading ? "Processing..." : "Activate 2FA"}
            </button>
          )}
        </div>

        {/* Display QR Code */}
        {qrUrl && (
          <div className="p-6 border border-gray-200 rounded-xl bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Scan QR Code</h3>
            <div className="flex flex-col items-center">
              <img src={qrUrl || "/placeholder.svg"} alt="2FA QR Code" className="w-48 h-48 border p-2 rounded-lg bg-white" />
              <p className="text-sm text-gray-600 mt-4 text-center max-w-md">
                Scan the QR code using an authenticator app (e.g., Google Authenticator, Authy) to set up two-factor authentication.
              </p>
            </div>
          </div>
        )}

        {/* OTP Input */}
        {qrUrl && (
          <div className="p-6 border border-gray-200 rounded-xl bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Verify Authentication Code</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter the 6-digit code from your authenticator app to complete the setup.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                maxLength={6}
              />
              <button
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
                onClick={activate2FA}
                disabled={loading || otp.length !== 6}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600">
              {is2FAEnabled ? "Two-factor authentication has been activated successfully!" : "Two-factor authentication has been deactivated successfully!"}
            </p>
          </div>
        )}
        
        <div className="p-6 border border-gray-200 rounded-xl bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Change Password</h3>
          <p className="text-gray-600 mb-4">Update your password to keep your account secure.</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your current password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your new password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Confirm your new password"
              />
            </div>
            <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all">
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationSettings = () => (
  <div>
    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Notification Settings</h2>
    <p className="text-gray-600 mb-6">Customize your notification preferences here.</p>
    
    <div className="space-y-6">
      <div className="p-6 border border-gray-200 rounded-xl bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Property Updates</p>
              <p className="text-sm text-gray-600">Receive updates about properties you've invested in</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Investment Opportunities</p>
              <p className="text-sm text-gray-600">Get notified about new investment opportunities</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Blog Updates</p>
              <p className="text-sm text-gray-600">Receive notifications about new blog posts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>
      
      <div className="p-6 border border-gray-200 rounded-xl bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Push Notifications</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Transaction Updates</p>
              <p className="text-sm text-gray-600">Get notified about your transactions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Account Security</p>
              <p className="text-sm text-gray-600">Receive security alerts for your account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>
      
      <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all">
        Save Preferences
      </button>
    </div>
  </div>
);

const BillingSettings = () => (
  <div>
    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Billing Settings</h2>
    <p className="text-gray-600 mb-6">Manage your billing and payment information here.</p>
    
    <div className="space-y-8">
      <div className="p-6 border border-gray-200 rounded-xl bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h3>
        
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg bg-white flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-md mr-4">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-600">Expires 12/2025</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">Default</span>
              <button className="text-gray-500 hover:text-gray-700">Edit</button>
            </div>
          </div>
          
          <button className="inline-flex items-center text-purple-600 font-medium hover:text-purple-700">
            + Add Payment Method
          </button>
        </div>
      </div>
      
      <div className="p-6 border border-gray-200 rounded-xl bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Address</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company (Optional)</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter company name"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your address"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="State/Province"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Postal Code"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option>India</option>
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Canada</option>
              <option>Australia</option>
            </select>
          </div>
        </div>
      </div>
      
      <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all">
        Save Billing Information
      </button>
    </div>
  </div>
);

export default SettingsPage;
