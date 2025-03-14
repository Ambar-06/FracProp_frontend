"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Building, DollarSign, Shield, Users, ChevronDown, Heart, Star } from "lucide-react"
import { useState } from "react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold gradient-text">FracProp</span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                <Link
                  href="#how-it-works"
                  className="text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  How It Works
                </Link>
                <Link
                  href="#investments"
                  className="text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Investments
                </Link>
                <Link
                  href="#faq"
                  className="text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  FAQ
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/login"
                className="text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium hidden md:block"
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
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Invest in <span className="gradient-text">Fractional Real Estate</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Start building your real estate portfolio today with as little as ₹1,000. Earn stable rental income and
                long-term property appreciation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all text-center"
                >
                  Start Investing
                </Link>
                <Link
                  href="#how-it-works"
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-all text-center"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-100 rounded-full z-0"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-100 rounded-full z-0"></div>
                <div className="relative z-10 rounded-xl overflow-hidden shadow-xl">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="Real Estate Investment"
                    width={600}
                    height={400}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <p className="text-4xl font-bold gradient-text mb-2">₹500Cr+</p>
              <p className="text-gray-600">Properties Listed</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <p className="text-4xl font-bold gradient-text mb-2">15,000+</p>
              <p className="text-gray-600">Active Investors</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <p className="text-4xl font-bold gradient-text mb-2">12%</p>
              <p className="text-gray-600">Avg. Annual Returns</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <p className="text-4xl font-bold gradient-text mb-2">₹1,000</p>
              <p className="text-gray-600">Min. Investment</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-700 text-center mb-8">
            Trusted by thousands of investors across India
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-500 font-medium">Partner 1</span>
            </div>
            <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-500 font-medium">Partner 2</span>
            </div>
            <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-500 font-medium">Partner 3</span>
            </div>
            <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-500 font-medium">Partner 4</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Investing in real estate has never been easier. Follow these simple steps to start building your
              portfolio.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Sign Up</h3>
              <p className="text-gray-600">
                Create your account in minutes. Verify your identity and you're ready to start investing.
              </p>
              <Image
                src="/placeholder.svg?height=150&width=300"
                alt="Sign Up Process"
                width={300}
                height={150}
                className="mt-4 rounded-lg w-full object-cover"
              />
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Choose Properties</h3>
              <p className="text-gray-600">
                Browse our curated selection of high-quality properties and invest in the ones that match your goals.
              </p>
              <Image
                src="/placeholder.svg?height=150&width=300"
                alt="Property Selection"
                width={300}
                height={150}
                className="mt-4 rounded-lg w-full object-cover"
              />
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Earn Returns</h3>
              <p className="text-gray-600">
                Start earning rental income and benefit from property appreciation as your investment grows.
              </p>
              <Image
                src="/placeholder.svg?height=150&width=300"
                alt="Earning Returns"
                width={300}
                height={150}
                className="mt-4 rounded-lg w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Investment Opportunities */}
      <section id="investments" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Featured Investment Opportunities</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our selection of premium properties available for fractional investment.
            </p>
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
              },
            ].map((property, index) => (
              <PropertyCard key={index} property={property} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/properties"
              className="inline-flex items-center text-purple-600 font-medium hover:text-purple-700"
            >
              View All Properties <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Why Choose FracProp</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We make real estate investing accessible, transparent, and hassle-free.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start p-6 bg-white rounded-xl shadow-md border border-gray-100">
              <div className="flex-shrink-0 mr-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Investments</h3>
                <p className="text-gray-600">
                  All properties are thoroughly vetted and legally verified before being listed on our platform.
                </p>
              </div>
            </div>
            <div className="flex items-start p-6 bg-white rounded-xl shadow-md border border-gray-100">
              <div className="flex-shrink-0 mr-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Low Minimum Investment</h3>
                <p className="text-gray-600">
                  Start with as little as ₹1,000 and gradually build your real estate portfolio.
                </p>
              </div>
            </div>
            <div className="flex items-start p-6 bg-white rounded-xl shadow-md border border-gray-100">
              <div className="flex-shrink-0 mr-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Building className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Diversified Portfolio</h3>
                <p className="text-gray-600">
                  Spread your investments across multiple properties to minimize risk and maximize returns.
                </p>
              </div>
            </div>
            <div className="flex items-start p-6 bg-white rounded-xl shadow-md border border-gray-100">
              <div className="flex-shrink-0 mr-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Hassle-Free Management</h3>
                <p className="text-gray-600">
                  We handle property management, tenant relations, and maintenance so you don't have to.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Frequently Asked Questions</h2>
            <p className="text-gray-600">Find answers to common questions about fractional real estate investing.</p>
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
              <div key={index} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer">
                    <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                    <ChevronDown className="h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-6 pb-6 pt-0">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl p-8 md:p-12 shadow-xl">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Start Investing?</h2>
              <p className="text-white text-opacity-90 max-w-2xl mx-auto mb-8">
                Join thousands of investors who are already building their real estate portfolio with FracProp.
              </p>
              <Link
                href="/signup"
                className="inline-block bg-white text-purple-600 font-medium px-8 py-3 rounded-lg hover:shadow-lg transition-all"
              >
                Create Your Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">FracProp</h3>
              <p className="text-gray-400">Making real estate investment accessible to everyone.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/team" className="text-gray-400 hover:text-white transition-colors">
                    Our Team
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-gray-400 hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/guides" className="text-gray-400 hover:text-white transition-colors">
                    Investment Guides
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} FracProp. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Property Card Component that matches the style from explore-properties page
const PropertyCard = ({ property }) => {
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
    <div className="gradient-card bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl group">
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
            Featured
          </div>
        </div>
      </Link>

      <div className="p-5">
        <Link href="/signup">
          <h3 className="text-xl font-bold text-gray-900 mb-1 hover:text-purple-600 transition-colors">
            {property.title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3 flex items-center">
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
                  className={`${i < Math.round(property.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-gray-600 ml-2 text-sm">{property.rating.toFixed(1)}</span>
          </div>
        )}

        {/* Sold Percentage */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Sold</span>
            <span className="text-gray-900 font-medium">{property.sold}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${property.sold}%` }}
            ></div>
          </div>
        </div>

        {/* Investment Details */}
        <div className="bg-gray-100 rounded-lg p-3 mb-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-gray-500">Expected ROI</p>
              <p className="text-sm font-bold text-purple-600">{property.roi}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Min Investment</p>
              <p className="text-sm font-bold text-gray-900">{property.minInvestment}</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <Link href="/signup" className="flex-1">
            <button className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all">
              Invest Now
            </button>
          </Link>
          <Link href="/signup" className="flex-1">
            <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors">
              Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

