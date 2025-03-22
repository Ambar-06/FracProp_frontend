"use client"

import { motion } from "framer-motion"
import OpenNavbar from "@/components/OpenNavbar"
import CommonFooter from "@/components/CommonFooter"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Award, BarChart, Building, CheckCircle, Globe, Users } from 'lucide-react'

const AboutUs = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <OpenNavbar />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background gradient circles */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200 dark:bg-purple-900/20 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              About <span className="gradient-text">FracProp</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              We're revolutionizing real estate investment by making it accessible to everyone through fractional ownership.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Our Story</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                FracProp was founded in 2020 with a simple yet powerful vision: to democratize real estate investment. 
                We recognized that traditional real estate investment had high barriers to entry, requiring significant 
                capital, market knowledge, and time commitment.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Our founders, a team of real estate professionals and technology experts, came together to create a 
                platform that would allow anyone to invest in high-quality properties with as little as ₹1,000, 
                while enjoying the benefits of property ownership without the hassles of management.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Since our inception, we've helped thousands of investors build wealth through fractional real estate 
                ownership, and we're just getting started on our mission to transform how people invest in property.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full z-0"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-100 dark:bg-blue-900/30 rounded-full z-0"></div>
              <div className="relative z-10 rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="FracProp Team"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Our Mission & Vision</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're driven by a clear purpose and ambitious goals for the future of real estate investment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-6">
                <CheckCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Our Mission</h3>
              <p className="text-gray-600 dark:text-gray-300">
                To democratize real estate investment by providing a secure, transparent, and accessible platform that 
                enables everyone to build wealth through fractional property ownership, regardless of their financial 
                background or investment experience.
              </p>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
                <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Our Vision</h3>
              <p className="text-gray-600 dark:text-gray-300">
                To become the world's leading platform for fractional real estate investment, creating a future where 
                property investment is as accessible and liquid as stock market investing, while maintaining the 
                stability and growth potential that real estate offers.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Our Core Values</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              These principles guide everything we do at FracProp, from how we select properties to how we interact with our investors.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
              variants={fadeIn}
            >
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Accessibility</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We believe that everyone deserves the opportunity to invest in real estate, regardless of their financial status.
              </p>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
              variants={fadeIn}
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Quality</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We rigorously vet all properties to ensure they meet our high standards for investment potential and quality.
              </p>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
              variants={fadeIn}
            >
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Integrity</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We operate with complete transparency and honesty in all our dealings with investors and partners.
              </p>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
              variants={fadeIn}
            >
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Innovation</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We continuously seek new ways to improve our platform and create better investment opportunities.
              </p>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
              variants={fadeIn}
            >
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Community</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We foster a supportive community of investors who share knowledge and grow together.
              </p>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
              variants={fadeIn}
            >
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Sustainability</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We prioritize environmentally and socially responsible investments for long-term positive impact.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Our Journey</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Key milestones in our mission to transform real estate investment.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>

            <div className="space-y-12">
              <motion.div
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-center">
                  <div className="z-10 flex items-center justify-center w-12 h-12 bg-purple-600 rounded-full">
                    <span className="text-white font-bold">2020</span>
                  </div>
                </div>
                <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 max-w-xl mx-auto">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Foundation</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    FracProp was founded with the mission to democratize real estate investment through technology.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center justify-center">
                  <div className="z-10 flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full">
                    <span className="text-white font-bold">2021</span>
                  </div>
                </div>
                <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 max-w-xl mx-auto">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Platform Launch</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We launched our platform with our first 10 properties, allowing investments starting from ₹5,000.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex items-center justify-center">
                  <div className="z-10 flex items-center justify-center w-12 h-12 bg-green-600 rounded-full">
                    <span className="text-white font-bold">2022</span>
                  </div>
                </div>
                <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 max-w-xl mx-auto">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Expansion</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We expanded to 5 major cities across India and reduced our minimum investment to ₹1,000.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="flex items-center justify-center">
                  <div className="z-10 flex items-center justify-center w-12 h-12 bg-yellow-600 rounded-full">
                    <span className="text-white font-bold">2023</span>
                  </div>
                </div>
                <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 max-w-xl mx-auto">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Mobile App Launch</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We launched our mobile app, making it even easier for investors to manage their portfolios on the go.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="flex items-center justify-center">
                  <div className="z-10 flex items-center justify-center w-12 h-12 bg-purple-600 rounded-full">
                    <span className="text-white font-bold">2024</span>
                  </div>
                </div>
                <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 max-w-xl mx-auto">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">International Expansion</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We began our international expansion, offering properties in select global markets to our investors.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>

            <div className="text-center relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Join Our Investment Community</h2>
              <p className="text-white text-opacity-90 max-w-2xl mx-auto mb-8">
                Become part of the FracProp family and start building your real estate portfolio today.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/signup"
                  className="inline-block bg-white text-purple-600 font-medium px-8 py-3 rounded-lg hover:shadow-lg transition-all"
                >
                  Get Started <ArrowRight size={16} className="inline ml-2" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <CommonFooter />
    </div>
  )
}

export default AboutUs
