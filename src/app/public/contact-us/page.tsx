"use client"

import OpenNavbar from "@/components/OpenNavbar"
import Footer from "@/components/CommonFooter"
import { Mail, MapPin, Phone, Clock, Globe } from "lucide-react"
import { motion } from "framer-motion"

const OpenContactUs = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <OpenNavbar />

      <div className="container mx-auto px-4 pt-24 pb-16">
        <motion.div className="max-w-4xl mx-auto" initial="hidden" animate="visible" variants={fadeIn}>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 gradient-text">Contact Us</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Have questions about fractional property investment? Our team is here to help you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Get in Touch</h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">Email</h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                      <a href="mailto:info@fracprop.com" className="hover:text-purple-600 transition-colors">
                        info@fracprop.com
                      </a>
                    </p>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                      <a href="mailto:support@fracprop.com" className="hover:text-purple-600 transition-colors">
                        support@fracprop.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">Phone</h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                      <a href="tel:+1-800-FRACPROP" className="hover:text-purple-600 transition-colors">
                        +1-800-FRACPROP
                      </a>
                    </p>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">
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
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">Address</h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">
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
            </motion.div>

            {/* Hours and Additional Info */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Business Hours</h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">Working Hours</h3>
                    <div className="mt-2 space-y-1 text-gray-600 dark:text-gray-300">
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
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">Global Offices</h3>
                    <div className="mt-2 space-y-3 text-gray-600 dark:text-gray-300">
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
            </motion.div>
          </div>

          {/* Map Section */}
          <motion.div
            className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Find Us</h2>
            <div className="rounded-lg overflow-hidden h-80 bg-gray-200 dark:bg-gray-700">
              {/* Placeholder for map - in a real app, you would integrate Google Maps or similar */}
              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <p className="text-gray-500 dark:text-gray-400">Interactive map would be displayed here</p>
              </div>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                  How quickly can I expect a response?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We aim to respond to all inquiries within 24 hours during business days. For urgent matters, please
                  call our customer support line.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                  Can I schedule a meeting with an investment advisor?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, you can schedule a virtual or in-person meeting with one of our investment advisors. Please email
                  us at advisors@fracprop.com with your preferred date and time.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                  Do you offer property tours for potential investors?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, we organize virtual and physical property tours for our listed properties. Contact our property
                  relations team to arrange a tour.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}

export default OpenContactUs
