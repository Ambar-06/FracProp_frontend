"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import { Check, HelpCircle } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(true)

  const toggleBilling = () => {
    setIsAnnual(!isAnnual)
  }

  const plans = [
    {
      name: "Free",
      description: "Perfect for beginners exploring fractional property investment",
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        "Access to basic property listings",
        "Investment portfolio tracking",
        "Basic market insights",
        "Community forum access",
        "Email support (response within 48 hours)",
        "Mobile app access",
      ],
      highlighted: false,
      ctaText: "Get Started",
      image: "/placeholder.svg?height=120&width=120"
    },
    {
      name: "Premium",
      description: "For serious investors looking to build a diverse portfolio",
      monthlyPrice: 79,
      annualPrice: 790,
      features: [
        "Everything in Free plan",
        "Access to premium property listings",
        "Priority early investment access",
        "Advanced market analytics",
        "Priority support (response within 4 hours)",
        "Dedicated investment advisor",
        "No transaction fees",
        "Exclusive investment webinars",
      ],
      highlighted: true,
      ctaText: "Go Premium",
      image: "/placeholder.svg?height=120&width=120"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 gradient-text">Choose Your Plan</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select the perfect plan to accelerate your property investment journey
            </p>

            {/* Billing Toggle */}
            <div className="mt-8 flex items-center justify-center">
              <span className={`mr-3 text-sm ${!isAnnual ? "text-gray-900 font-medium" : "text-gray-500"}`}>
                Monthly
              </span>
              <button
                onClick={toggleBilling}
                className="relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                style={{
                  backgroundColor: isAnnual ? "#8B5CF6" : "#D1D5DB",
                }}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAnnual ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className={`ml-3 text-sm ${isAnnual ? "text-gray-900 font-medium" : "text-gray-500"}`}>
                Yearly <span className="text-purple-600 font-medium">(Save 20%)</span>
              </span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl ${
                  plan.highlighted ? "ring-2 ring-purple-500 relative" : ""
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center text-sm py-1">
                    Recommended
                  </div>
                )}

                <div className={`p-8 ${plan.highlighted ? "pt-10" : ""}`}>
                  <div className="flex items-center mb-4">
                    <div className="mr-4 bg-purple-100 p-2 rounded-full">
                      <Image 
                        src={plan.image || "/placeholder.svg"} 
                        alt={plan.name} 
                        width={60} 
                        height={60} 
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                      <p className="text-gray-600">{plan.description}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-baseline">
                      <span className="text-5xl font-extrabold text-gray-900">
                        {plan.monthlyPrice === 0 ? "Free" : `$${isAnnual ? plan.annualPrice : plan.monthlyPrice}`}
                      </span>
                      {plan.monthlyPrice !== 0 && (
                        <span className="ml-1 text-xl font-medium text-gray-500">/{isAnnual ? "year" : "month"}</span>
                      )}
                    </div>
                    {isAnnual && plan.monthlyPrice !== 0 && (
                      <p className="mt-1 text-sm text-purple-600">
                        ${plan.monthlyPrice * 12 - plan.annualPrice} savings annually
                      </p>
                    )}
                  </div>

                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className={`h-5 w-5 ${plan.highlighted ? "text-purple-500" : "text-green-500"}`} />
                        </div>
                        <p className="ml-3 text-gray-600">{feature}</p>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <Link
                      href="/signup"
                      className={`w-full flex items-center justify-center px-4 py-3 rounded-lg text-white font-medium transition-colors ${
                        plan.highlighted
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                          : "bg-gray-800 hover:bg-gray-900"
                      }`}
                    >
                      {plan.ctaText}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="mt-20 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Plan Comparison</h2>
              <p className="text-gray-600">Compare features between our Free and Premium plans</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">Free</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">Premium</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { name: "Property Listings", free: "Basic", premium: "Basic + Premium" },
                    { name: "Investment Portfolio Tracking", free: "✓", premium: "✓" },
                    { name: "Market Insights", free: "Basic", premium: "Advanced" },
                    { name: "Early Investment Access", free: "✗", premium: "✓" },
                    { name: "Support Response Time", free: "48 hours", premium: "4 hours" },
                    { name: "Dedicated Investment Advisor", free: "✗", premium: "✓" },
                    { name: "Transaction Fees", free: "2%", premium: "0%" },
                    { name: "Investment Webinars", free: "✗", premium: "✓" },
                    { name: "Mobile App Access", free: "✓", premium: "✓" },
                  ].map((feature, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{feature.name}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">
                        {feature.free === "✓" ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : feature.free === "✗" ? (
                          <span className="text-red-500">✗</span>
                        ) : (
                          feature.free
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">
                        {feature.premium === "✓" ? (
                          <Check className="h-5 w-5 text-purple-500 mx-auto" />
                        ) : feature.premium === "✗" ? (
                          <span className="text-red-500">✗</span>
                        ) : (
                          <span className="text-purple-600 font-medium">{feature.premium}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">Frequently Asked Questions</h2>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  question: "What is included in the Free plan?",
                  answer:
                    "The Free plan includes access to basic property listings, investment portfolio tracking, basic market insights, community forum access, email support, and mobile app access.",
                },
                {
                  question: "What additional benefits do I get with the Premium plan?",
                  answer:
                    "The Premium plan includes everything in the Free plan plus access to premium property listings, priority early investment access, advanced market analytics, priority support, a dedicated investment advisor, no transaction fees, and exclusive investment webinars.",
                },
                {
                  question: "Can I upgrade from Free to Premium later?",
                  answer:
                    "Yes, you can upgrade to the Premium plan at any time. Your new benefits will be available immediately after upgrading.",
                },
                {
                  question: "Is there a free trial for the Premium plan?",
                  answer:
                    "Yes, we offer a 14-day free trial of the Premium plan. No credit card required to start your trial.",
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans.",
                },
                {
                  question: "Can I cancel my Premium subscription?",
                  answer:
                    "Yes, you can cancel your subscription at any time. For monthly plans, you'll have access until the end of your billing cycle.",
                },
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <HelpCircle className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                      <p className="mt-2 text-gray-600">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to start your investment journey?</h2>
            <p className="text-white text-opacity-90 mb-6 max-w-2xl mx-auto">
              Join thousands of investors who are already building wealth through fractional property ownership.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-block bg-white text-purple-600 font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Get Started for Free
              </Link>
              <Link
                href="/signup?plan=premium"
                className="inline-block bg-purple-800 bg-opacity-50 text-white font-medium px-6 py-3 rounded-lg hover:bg-opacity-70 transition-colors border border-white"
              >
                Try Premium Free for 14 Days
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingPage
