"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import { Check, HelpCircle } from "lucide-react"
import Link from "next/link"

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(true)

  const toggleBilling = () => {
    setIsAnnual(!isAnnual)
  }

  const plans = [
    {
      name: "Basic",
      description: "Perfect for beginners exploring fractional property investment",
      monthlyPrice: 29,
      annualPrice: 290, // 10 months price (2 months free)
      features: [
        "Access to basic property listings",
        "Limited market insights",
        "Basic investment calculator",
        "Email support",
        "1 investment per month",
      ],
      highlighted: false,
      ctaText: "Get Started",
    },
    {
      name: "Pro",
      description: "For serious investors looking to build a diverse portfolio",
      monthlyPrice: 79,
      annualPrice: 790,
      features: [
        "Access to all property listings",
        "Advanced market insights",
        "Portfolio diversification tools",
        "Priority email & phone support",
        "5 investments per month",
        "Exclusive webinars",
      ],
      highlighted: true,
      ctaText: "Get Pro",
    },
    {
      name: "Enterprise",
      description: "Custom solutions for investment firms and high-net-worth individuals",
      monthlyPrice: 199,
      annualPrice: 1990,
      features: [
        "Full platform access",
        "Custom market reports",
        "Dedicated account manager",
        "24/7 priority support",
        "Unlimited investments",
        "Custom API integration",
        "White-label options",
      ],
      highlighted: false,
      ctaText: "Contact Sales",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 gradient-text">Pricing Plans</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan to accelerate your property investment journey
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
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl ${
                  plan.highlighted ? "ring-2 ring-purple-500 relative" : ""
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center text-sm py-1">
                    Most Popular
                  </div>
                )}

                <div className={`p-8 ${plan.highlighted ? "pt-10" : ""}`}>
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="mt-2 text-gray-600 h-12">{plan.description}</p>

                  <div className="mt-6">
                    <div className="flex items-baseline">
                      <span className="text-5xl font-extrabold text-gray-900">
                        ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                      </span>
                      <span className="ml-1 text-xl font-medium text-gray-500">/{isAnnual ? "year" : "month"}</span>
                    </div>
                    {isAnnual && (
                      <p className="mt-1 text-sm text-purple-600">
                        ${plan.monthlyPrice * 12 - plan.annualPrice} savings annually
                      </p>
                    )}
                  </div>

                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-gray-600">{feature}</p>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <Link
                      href={plan.name === "Enterprise" ? "/contact-us" : "/signup"}
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

          {/* FAQ Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">Frequently Asked Questions</h2>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  question: "What is fractional property investment?",
                  answer:
                    "Fractional property investment allows multiple investors to purchase shares of a single property, making real estate investment more accessible with lower capital requirements.",
                },
                {
                  question: "Can I upgrade my plan later?",
                  answer:
                    "Yes, you can upgrade your plan at any time. The price difference will be prorated based on the remaining time in your current billing cycle.",
                },
                {
                  question: "Is there a free trial available?",
                  answer:
                    "We offer a 14-day free trial for our Basic and Pro plans. No credit card required to start your trial.",
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans.",
                },
                {
                  question: "Can I cancel my subscription?",
                  answer:
                    "Yes, you can cancel your subscription at any time. For monthly plans, you'll have access until the end of your billing cycle.",
                },
                {
                  question: "Do you offer custom enterprise solutions?",
                  answer:
                    "Yes, our Enterprise plan can be customized to meet your specific needs. Contact our sales team for more information.",
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
            <Link
              href="/signup"
              className="inline-block bg-white text-purple-600 font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingPage

