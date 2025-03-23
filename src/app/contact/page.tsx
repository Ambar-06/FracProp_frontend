"use client"
import Navbar from "@/components/Navbar"
import { Mail, MapPin, Phone, Clock, Globe } from "lucide-react"

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 gradient-text">Contact Us</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions about fractional property investment? Our team is here to help you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Get in Touch</h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-800">Email</h3>
                    <p className="mt-1 text-gray-600">
                      <a href="mailto:info@fracprop.in" className="hover:text-purple-600 transition-colors">
                        info@fracprop.in
                      </a>
                    </p>
                    <p className="mt-1 text-gray-600">
                      <a href="mailto:support@fracprop.in" className="hover:text-purple-600 transition-colors">
                        support@fracprop.in
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-800">Phone</h3>
                    <p className="mt-1 text-gray-600">
                      <a href="tel:+1-800-FRACPROP" className="hover:text-purple-600 transition-colors">
                        +1-800-FRACPROP
                      </a>
                    </p>
                    <p className="mt-1 text-gray-600">
                      <a href="tel:+1-212-555-0123" className="hover:text-purple-600 transition-colors">
                        +1-212-555-0123
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-800">Address</h3>
                    <p className="mt-1 text-gray-600">
                      123 Investment Avenue
                      <br />
                      Financial District
                      <br />
                      New York, NY 10004
                      <br />
                      United States
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hours and Additional Info */}
            <div className="bg-white rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Business Hours</h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-800">Working Hours</h3>
                    <div className="mt-2 space-y-1 text-gray-600">
                      <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p>Saturday: 10:00 AM - 4:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-full">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-800">Global Offices</h3>
                    <div className="mt-2 space-y-3 text-gray-600">
                      <div>
                        <p className="font-medium">London</p>
                        <p>45 Financial Street, London, UK</p>
                      </div>
                      <div>
                        <p className="font-medium">Singapore</p>
                        <p>78 Marina Bay, Singapore</p>
                      </div>
                      <div>
                        <p className="font-medium">Dubai</p>
                        <p>120 Sheikh Zayed Road, Dubai, UAE</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Find Us</h2>
            <div className="rounded-lg overflow-hidden h-80 bg-gray-200">
              {/* Placeholder for map - in a real app, you would integrate Google Maps or similar */}
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <p className="text-gray-500">Interactive map would be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactUs

