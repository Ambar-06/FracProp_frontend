"use client"

import OpenNavbar from "@/components/OpenNavbar"
import { Briefcase, Mail, MapPin, Calendar, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"

const CareersPage = () => {
  // State for job filtering
  const [filter, setFilter] = useState("all")

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  // Job listings data
  const jobListings = [
    {
      id: 1,
      title: "Senior Full Stack Developer",
      department: "Technology",
      location: "Mumbai, India (Hybrid)",
      type: "Full-time",
      posted: "2 weeks ago",
      description:
        "We're looking for an experienced Full Stack Developer to join our technology team and help build innovative features for our investment platform.",
    },
    {
      id: 2,
      title: "Property Acquisition Specialist",
      department: "Real Estate",
      location: "Delhi, India",
      type: "Full-time",
      posted: "1 week ago",
      description:
        "Join our property acquisition team to identify, evaluate, and secure high-quality real estate assets for our investment platform.",
    },
    {
      id: 3,
      title: "Digital Marketing Manager",
      department: "Marketing",
      location: "Remote, India",
      type: "Full-time",
      posted: "3 days ago",
      description:
        "Lead our digital marketing efforts to grow our investor community and establish FracProp as the leading fractional real estate investment platform.",
    },
    {
      id: 4,
      title: "Investment Analyst",
      department: "Finance",
      location: "Bangalore, India",
      type: "Full-time",
      posted: "1 month ago",
      description:
        "Analyze real estate investment opportunities, perform financial modeling, and help develop investment strategies for our platform.",
    },
    {
      id: 5,
      title: "Customer Success Representative",
      department: "Customer Experience",
      location: "Remote, India",
      type: "Full-time",
      posted: "2 days ago",
      description:
        "Provide exceptional support to our investors, helping them navigate our platform and maximize their investment experience.",
    },
    {
      id: 6,
      title: "UI/UX Designer",
      department: "Technology",
      location: "Mumbai, India (Hybrid)",
      type: "Full-time",
      posted: "1 week ago",
      description:
        "Create intuitive and engaging user experiences for our web and mobile platforms, making real estate investment accessible and enjoyable.",
    },
    {
      id: 7,
      title: "Content Writer",
      department: "Marketing",
      location: "Remote, India",
      type: "Part-time",
      posted: "5 days ago",
      description:
        "Develop compelling content about real estate investment, market trends, and financial literacy for our blog, social media, and educational resources.",
    },
  ]

  // Filter jobs based on department
  const filteredJobs = filter === "all" ? jobListings : jobListings.filter((job) => job.department === filter)

  // Get unique departments for filter
  const departments = ["all", ...new Set(jobListings.map((job) => job.department))]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <OpenNavbar />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200 dark:bg-purple-900/20 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div className="text-center" initial="hidden" animate="visible" variants={fadeIn}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Join Our <span className="gradient-text">Team</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Build your career at FracProp and help us revolutionize real estate investment for everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Why Join FracProp?</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We offer more than just a job – we offer an opportunity to be part of a transformative journey in real
              estate investment.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                title: "Meaningful Impact",
                description:
                  "Your work will directly contribute to democratizing real estate investment and helping thousands of people build wealth.",
              },
              {
                title: "Innovation & Growth",
                description:
                  "We're at the forefront of fintech and proptech innovation, offering endless opportunities to learn and grow professionally.",
              },
              {
                title: "Collaborative Culture",
                description:
                  "Join a diverse team of passionate professionals who value collaboration, creativity, and mutual support.",
              },
              {
                title: "Competitive Benefits",
                description:
                  "We offer competitive salaries, equity options, health benefits, and flexible work arrangements to support your wellbeing.",
              },
              {
                title: "Learning Opportunities",
                description:
                  "Continuous learning is part of our DNA, with regular workshops, conferences, and education allowances.",
              },
              {
                title: "Work-Life Balance",
                description:
                  "We believe in sustainable high performance, with policies that support a healthy balance between work and personal life.",
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Open Positions</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Explore our current opportunities and find your perfect role at FracProp.
            </p>
          </div>

          {/* Department Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setFilter(dept)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === dept
                    ? "bg-purple-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {dept === "all" ? "All Departments" : dept}
              </button>
            ))}
          </div>

          {/* Job Listings */}
          <motion.div
            className="space-y-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <motion.div
                  key={job.id}
                  variants={fadeIn}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-medium rounded-full mb-2">
                          {job.department}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{job.title}</h3>
                        <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 gap-4 mb-3">
                          <div className="flex items-center">
                            <MapPin size={14} className="mr-1" />
                            {job.location}
                          </div>
                          <div className="flex items-center">
                            <Briefcase size={14} className="mr-1" />
                            {job.type}
                          </div>
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            Posted {job.posted}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <a
                          href={`mailto:jobs@fracprop.in?subject=Application for ${job.title} Position`}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-lg hover:shadow-md transition-all"
                        >
                          Apply Now <ArrowRight size={16} className="ml-2" />
                        </a>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mt-3">{job.description}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Open Positions</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  We don't have any open positions in this department right now. Please check back later or explore
                  other departments.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Application Process Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Our Application Process</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We've designed a straightforward process to help you find your place at FracProp.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Progress Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

            <motion.div
              className="space-y-12"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                {
                  step: "Application",
                  description:
                    "Submit your application by emailing your resume and cover letter to jobs@fracprop.in with the position title in the subject line.",
                },
                {
                  step: "Initial Screening",
                  description:
                    "Our recruitment team will review your application and reach out for an initial phone or video screening if your profile matches our requirements.",
                },
                {
                  step: "Technical/Role Assessment",
                  description:
                    "Depending on the role, you may be asked to complete a technical assessment, case study, or role-specific task to demonstrate your skills.",
                },
                {
                  step: "Team Interviews",
                  description:
                    "Meet with potential team members and leaders to discuss your experience, skills, and fit with our culture and values.",
                },
                {
                  step: "Final Interview",
                  description:
                    "A final interview with senior leadership to discuss your career goals, expectations, and potential contribution to FracProp.",
                },
                {
                  step: "Offer & Onboarding",
                  description:
                    "If successful, you'll receive an offer letter. Once accepted, our HR team will guide you through the onboarding process.",
                },
              ].map((stage, index) => (
                <motion.div key={index} variants={fadeIn} className="relative pl-16">
                  <div className="absolute left-0 top-0 w-16 h-16 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center z-10">
                      {index + 1}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{stage.step}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{stage.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>

            <div className="text-center relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Don't See the Right Role?</h2>
              <p className="text-white text-opacity-90 max-w-2xl mx-auto mb-8">
                We're always interested in connecting with talented individuals. Send your resume to jobs@fracprop.in
                and tell us how you can contribute to our mission.
              </p>
              <a
                href="mailto:jobs@fracprop.in"
                className="inline-flex items-center bg-white text-purple-600 font-medium px-8 py-3 rounded-lg hover:shadow-lg transition-all"
              >
                <Mail size={18} className="mr-2" />
                jobs@fracprop.in
              </a>
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
                  <Link href="/open-blogs" className="text-gray-400 hover:text-white transition-colors">
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
          </div>
        </div>
      </footer>
    </div>
  )
}

export default CareersPage

