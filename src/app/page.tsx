"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Building,
  DollarSign,
  Shield,
  Users,
  ChevronDown,
  Heart,
  Star,
  ArrowDown,
  Check,
  X,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Footer from "@/components/CommonFooter"

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const statsRef = useRef(null)

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

  const phoneAnimation = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.3,
      },
    },
  }

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current)
      }
    }
  }, [])

  // Counter animation for stats
  const CounterAnimation = ({ end, duration = 2000, prefix = "", suffix = "" }) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
      if (!isVisible) return

      let startTime
      let animationFrame

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp
        const progress = timestamp - startTime
        const percentage = Math.min(progress / duration, 1)

        setCount(Math.floor(percentage * end))

        if (percentage < 1) {
          animationFrame = requestAnimationFrame(animate)
        }
      }

      animationFrame = requestAnimationFrame(animate)

      return () => cancelAnimationFrame(animationFrame)
    }, [end, duration, isVisible])

    return (
      <span>
        {prefix}
        {count}
        {suffix}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black overflow-hidden">
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white py-3 px-4 text-center relative">
        <p className="text-sm md:text-base">
          FracProp successfully launches its inaugural property fund!
          <Link href="#" className="ml-2 underline font-medium">
            Learn more
          </Link>
        </p>
      </div>

      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
              <img src="/fp_logo.png" alt="FracProp" className="h-10" />
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                <Link
                  href="#how-it-works"
                  className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  How It Works
                </Link>
                <Link
                  href="#investments"
                  className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Investments
                </Link>
                <Link
                  href="#faq"
                  className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  FAQ
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/login"
                className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-md text-sm font-medium hidden md:block"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background gradient circles */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200 dark:bg-purple-900/20 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="flex flex-col lg:flex-row items-center"
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
          >
            <motion.div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10" variants={fadeIn}>
              <div className="inline-block px-3 py-1 mb-6 text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <span className="flex items-center">
                  <span className="w-2 h-2 mr-2 bg-green-400 rounded-full animate-pulse"></span>
                  Real Estate sector is projected to grow at an 18.7% compounded annual growth rate (CAGR) from 2020 to 2030.
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Build your wealth <br />
                through <span className="gradient-text">real estate</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-lg">
                Thousands of investors all over the world are using FracProp to access income generating real estate
                deals in high growth markets, from only ₹1,000.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all text-center group"
                >
                  <span className="flex items-center justify-center">
                    Start Investing
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                  </span>
                </Link>
                <Link
                  href="#how-it-works"
                  className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-center"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
            <motion.div className="lg:w-1/2 relative" variants={phoneAnimation}>
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full z-0"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-100 dark:bg-blue-900/30 rounded-full z-0"></div>

                {/* Phone mockups */}
                <div className="relative z-10 flex justify-center">
                  <div className="relative w-[280px] md:w-[320px] h-[580px] md:h-[650px] bg-gray-900 rounded-[40px] p-4 shadow-xl border-4 border-gray-800 overflow-hidden">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-gray-800 rounded-b-xl"></div>
                    <Image
                      src="/explore_properties_ss.jpeg?height=650&width=320"
                      alt="FracProp Mobile App"
                      width={320}
                      height={650}
                      className="w-full h-full rounded-[28px] object-cover"
                    />

                    {/* Floating notification */}
                    <div className="absolute top-20 right-0 transform translate-x-1/4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg w-48 animate-float">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
                          <DollarSign size={16} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="ml-2">
                          <p className="text-xs font-semibold text-gray-900 dark:text-white">Rent Received</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">₹1,250 from Property : Virendra PG</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <div className="mt-12 text-center">
            <Link
              href="#stats"
              className="inline-flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <span className="text-sm font-medium mb-1">Discover More</span>
              <ArrowDown size={20} className="animate-bounce" />
            </Link>
          </div>
        </div>
      </section>

      {/* App Download Section */}
      {/* <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <p className="text-gray-600 dark:text-gray-300 font-medium">Get the FracProp app</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#" className="transition-transform hover:scale-105">
                <Image
                  src="/placeholder.svg?height=50&width=170"
                  alt="Download on the App Store"
                  width={170}
                  height={50}
                  className="h-12 w-auto"
                />
              </Link>
              <Link href="#" className="transition-transform hover:scale-105">
                <Image
                  src="/placeholder.svg?height=50&width=170"
                  alt="Get it on Google Play"
                  width={170}
                  height={50}
                  className="h-12 w-auto"
                />
              </Link>
            </div>
          </div>
        </div>
      </section> */}

      {/* Stats Section */}
      <section id="stats" ref={statsRef} className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={staggerChildren}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
              variants={fadeIn}
            >
              <p className="text-4xl font-bold gradient-text mb-2">
                {isVisible && <CounterAnimation end={80} prefix="₹" suffix="Lakhs+" />}
              </p>
              <p className="text-gray-600 dark:text-gray-300">Properties Listed</p>
            </motion.div>
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
              variants={fadeIn}
            >
              <p className="text-4xl font-bold gradient-text mb-2">
                {isVisible && <CounterAnimation end={20} suffix="+" />}
              </p>
              <p className="text-gray-600 dark:text-gray-300">Active Investors</p>
            </motion.div>
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
              variants={fadeIn}
            >
              <p className="text-4xl font-bold gradient-text mb-2">
                {isVisible && <CounterAnimation end={12} suffix="%" />}
              </p>
              <p className="text-gray-600 dark:text-gray-300">Avg. Annual Returns</p>
            </motion.div>
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
              variants={fadeIn}
            >
              <p className="text-4xl font-bold gradient-text mb-2">
                {isVisible && <CounterAnimation end={5} prefix="₹" />}
              </p>
              <p className="text-gray-600 dark:text-gray-300">Min. Investment</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      {/* <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 text-center mb-8">
            Our Partners
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="rounded flex items-center justify-center"> */}
              {/* <span className="text-gray-500 dark:text-gray-400 font-medium">Partner 1</span> */}
              {/* <Image src="/GeckoTech_slim_no_bg.png" alt="FracProp" className="" height={240} /> */}
              {/* <Image src={"/GeckoTech_slim_no_bg.png"} alt={"GeckoTech IT Solutions"} className="object-cover w-full h-full" height={120} width={120} />
            </div>
            <div className="rounded flex items-center justify-center"> */}
              {/* <span className="text-gray-500 dark:text-gray-400 font-medium">Partner 2</span> */}
              {/* <Image src={"/siberal.png"} alt={"Siberal Tech"} className="object-cover w-full h-full" height={120} width={120} />
            </div> */}
            {/* <div className="w-24 h-12 bg-white dark:bg-gray-800 rounded flex items-center justify-center shadow-sm">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Partner 3</span>
            </div>
            <div className="w-24 h-12 bg-white dark:bg-gray-800 rounded flex items-center justify-center shadow-sm">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Partner 4</span>
            </div> */}
          {/* </div>
        </div>
      </section> */}

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">How It Works</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Investing in real estate has never been easier. Follow these simple steps to start building your
              portfolio.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1. Sign Up</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create your account in minutes. Verify your identity and you're ready to start investing.
              </p>
              <Image
                src="/signup.png?height=150&width=300"
                alt="Sign Up Process"
                width={300}
                height={150}
                className="mt-4 rounded-lg w-full object-cover"
              />
            </motion.div>
            <motion.div
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
                <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2. Choose Properties</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Browse our curated selection of high-quality properties and invest in the ones that match your goals.
              </p>
              <Image
                src="/explore.png?height=150&width=300"
                alt="Property Selection"
                width={300}
                height={150}
                className="mt-4 rounded-lg w-full object-cover"
              />
            </motion.div>
            <motion.div
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-6">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3. Earn Returns</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Start earning rental income and benefit from property appreciation as your investment grows.
              </p>
              <Image
                src="/placeholder.svg?height=150&width=300"
                alt="Earning Returns"
                width={300}
                height={150}
                className="mt-4 rounded-lg w-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Investment Opportunities */}
      <section id="investments" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Featured Investment Opportunities
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore our selection of premium properties available for fractional investment.
            </p>
          </div>

          {/* Property Tabs */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
              {["All Properties", "Residential", "Commercial", "Retail"].map((tab, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === index
                      ? "bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                  onClick={() => setActiveTab(index)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Luxury Apartment",
                location: "Mumbai, Maharashtra",
                roi: "10% p.a.",
                price: "₹50,00,000",
                minInvestment: "₹10,000",
                sold: 65,
                rating: 4.5,
                images: ["/placeholder.svg?height=240&width=400"],
                type: "Residential",
              },
              {
                title: "Commercial Office Space",
                location: "Bangalore, Karnataka",
                roi: "12% p.a.",
                price: "₹1,20,00,000",
                minInvestment: "₹25,000",
                sold: 42,
                rating: 4.8,
                images: ["/placeholder.svg?height=240&width=400"],
                type: "Commercial",
              },
              {
                title: "Retail Store",
                location: "Delhi NCR",
                roi: "9% p.a.",
                price: "₹75,00,000",
                minInvestment: "₹15,000",
                sold: 78,
                rating: 4.2,
                images: ["/placeholder.svg?height=240&width=400"],
                type: "Retail",
              },
            ].map((property, index) => (
              <PropertyCard key={index} property={property} index={index} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/properties"
              className="inline-flex items-center text-purple-600 dark:text-purple-400 font-medium hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              View All Properties <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Why Choose FracProp</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We make real estate investing accessible, transparent, and hassle-free.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              className="flex items-start p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex-shrink-0 mr-4">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Secure Investments</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  All properties are thoroughly vetted and legally verified before being listed on our platform.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="flex items-start p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex-shrink-0 mr-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Low Minimum Investment</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Start with as little as ₹1,000 and gradually build your real estate portfolio.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="flex items-start p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex-shrink-0 mr-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Building className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Diversified Portfolio</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Spread your investments across multiple properties to minimize risk and maximize returns.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="flex items-start p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex-shrink-0 mr-4">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Hassle-Free Management</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We handle property management, tenant relations, and maintenance so you don't have to.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Find answers to common questions about fractional real estate investing.
            </p>
          </div>
          <div className="space-y-6">
            {[
              {
                question: "What is fractional real estate investing?",
                answer:
                  "Fractional real estate investing allows multiple investors to own portions of a property, making real estate investment more accessible by lowering the entry barrier and enabling portfolio diversification.",
              },
              {
                question: "How do I start investing?",
                answer:
                  "Simply sign up on our platform, complete the verification process, browse available properties, and make your first investment with as little as ₹1,000.",
              },
              {
                question: "How do I earn returns?",
                answer:
                  "You earn returns through regular rental income distributions and potential property value appreciation when the property is sold.",
              },
              {
                question: "Is my investment secure?",
                answer:
                  "Yes, all investments are backed by real property assets. We conduct thorough due diligence on all properties and use secure legal structures to protect investor interests.",
              },
              {
                question: "Can I sell my investment before the property is sold?",
                answer:
                  "Yes, we provide a secondary market where you can list your investment shares for sale to other investors on our platform, subject to certain conditions.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{faq.question}</h3>
                    <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-6 pb-6 pt-0">
                    <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                  </div>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">How We Compare</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              See how FracProp stacks up against traditional real estate investment options.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-4 text-left text-gray-500 dark:text-gray-400 font-medium">Features</th>
                  <th className="p-4 text-center bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-semibold rounded-tl-lg">
                    FracProp
                  </th>
                  <th className="p-4 text-center text-gray-500 dark:text-gray-400 font-medium">REITs</th>
                  <th className="p-4 text-center text-gray-500 dark:text-gray-400 font-medium rounded-tr-lg">
                    Direct Ownership
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="p-4 text-gray-900 dark:text-white">Minimum Investment</td>
                  <td className="p-4 text-center bg-purple-50 dark:bg-purple-900/20">
                    <span className="font-medium text-purple-600 dark:text-purple-400">₹1,000</span>
                  </td>
                  <td className="p-4 text-center text-gray-600 dark:text-gray-300">₹5,000+</td>
                  <td className="p-4 text-center text-gray-600 dark:text-gray-300">₹50,00,000+</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="p-4 text-gray-900 dark:text-white">Property Selection</td>
                  <td className="p-4 text-center bg-purple-50 dark:bg-purple-900/20">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center text-gray-600 dark:text-gray-300">
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center text-gray-600 dark:text-gray-300">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="p-4 text-gray-900 dark:text-white">Liquidity</td>
                  <td className="p-4 text-center bg-purple-50 dark:bg-purple-900/20">
                    <span className="font-medium text-purple-600 dark:text-purple-400">Medium</span>
                  </td>
                  <td className="p-4 text-center text-gray-600 dark:text-gray-300">High</td>
                  <td className="p-4 text-center text-gray-600 dark:text-gray-300">Low</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="p-4 text-gray-900 dark:text-white">Management Hassle</td>
                  <td className="p-4 text-center bg-purple-50 dark:bg-purple-900/20">
                    <span className="font-medium text-purple-600 dark:text-purple-400">None</span>
                  </td>
                  <td className="p-4 text-center text-gray-600 dark:text-gray-300">None</td>
                  <td className="p-4 text-center text-gray-600 dark:text-gray-300">High</td>
                </tr>
                <tr>
                  <td className="p-4 text-gray-900 dark:text-white">Average Returns</td>
                  <td className="p-4 text-center bg-purple-50 dark:bg-purple-900/20 rounded-bl-lg">
                    <span className="font-medium text-purple-600 dark:text-purple-400">10-12%</span>
                  </td>
                  <td className="p-4 text-center text-gray-600 dark:text-gray-300">7-9%</td>
                  <td className="p-4 text-center text-gray-600 dark:text-gray-300 rounded-br-lg">8-10%</td>
                </tr>
              </tbody>
            </table>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Start Investing?</h2>
              <p className="text-white text-opacity-90 max-w-2xl mx-auto mb-8">
                Join thousands of investors who are already building their real estate portfolio with FracProp.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/signup"
                  className="inline-block bg-white text-purple-600 font-medium px-8 py-3 rounded-lg hover:shadow-lg transition-all"
                >
                  Create Your Account
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

// Property Card Component that matches the style from explore-properties page
const PropertyCard = ({ property, index }) => {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)
  const images = property.images || ["/placeholder.svg?height=240&width=400"]

  const nextImage = (e) => {
    e.stopPropagation()
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e) => {
    e.stopPropagation()
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleWishlistClick = (e) => {
    e.stopPropagation()
    setIsInWishlist(!isInWishlist)
  }

  return (
    <motion.div
      className="gradient-card bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href="/signup">
        <div className="relative w-full h-60">
          <Image
            src={images[currentImage] || "/placeholder.svg"}
            alt={property.title}
            width={400}
            height={240}
            className="object-cover w-full h-full"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ArrowRight size={16} className="rotate-180" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ArrowRight size={16} />
              </button>
            </>
          )}
          {/* Heart Button */}
          <button
            onClick={handleWishlistClick}
            className="absolute top-3 right-3 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-70 transition-all"
          >
            <Heart className={`h-5 w-5 ${isInWishlist ? "fill-current text-red-500" : ""}`} />
          </button>

          {/* Property Type Badge */}
          <div className="absolute top-3 left-3 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            {property.type}
          </div>
        </div>
      </Link>

      <div className="p-5">
        <Link href="/signup">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            {property.title}
          </h3>
        </Link>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 flex items-center">
          <Building size={14} className="mr-1" />
          {property.location}
        </p>

        {/* Rating */}
        {property.rating && (
          <div className="flex items-center mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`${i < Math.round(property.rating) ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-600"}`}
                />
              ))}
            </div>
            <span className="text-gray-600 dark:text-gray-300 ml-2 text-sm">{property.rating.toFixed(1)}</span>
          </div>
        )}

        {/* Sold Percentage */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500 dark:text-gray-400">Sold</span>
            <span className="text-gray-900 dark:text-white font-medium">{property.sold}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${property.sold}%` }}
            ></div>
          </div>
        </div>

        {/* Investment Details */}
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Expected ROI</p>
              <p className="text-sm font-bold text-purple-600 dark:text-purple-400">{property.roi}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Min Investment</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{property.minInvestment}</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <Link href="/signup" className="flex-1">
            <motion.button
              className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Invest Now
            </motion.button>
          </Link>
          <Link href="/signup" className="flex-1">
            <button className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg transition-colors">
              Details
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

