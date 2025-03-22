"use client"

import { motion } from "framer-motion"
import OpenNavbar from "@/components/OpenNavbar"
import CommonFooter from "@/components/CommonFooter"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Github, Linkedin, Mail, Twitter } from 'lucide-react'

const Team = () => {
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

  // Team members data
  const leadershipTeam = [
    {
      name: "Ambar Rizvi",
      role: "Chief Executive Officer",
      image: "/placeholder.svg?height=400&width=400",
      bio: "...",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Priya Patel",
      role: "Chief Technology Officer",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Priya brings 12 years of experience in fintech and blockchain. She previously built technology platforms for several successful startups.",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Arjun Mehta",
      role: "Chief Investment Officer",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Arjun has managed over $500M in real estate investments throughout his career. His expertise in property valuation is key to our investment strategy.",
      linkedin: "#",
      twitter: "#",
    },
  ]

  const teamMembers = [
    {
      name: "Neha Gupta",
      role: "Head of Marketing",
      image: "/placeholder.svg?height=300&width=300",
      linkedin: "#",
    },
    {
      name: "Vikram Singh",
      role: "Senior Software Engineer",
      image: "/placeholder.svg?height=300&width=300",
      linkedin: "#",
    },
    {
      name: "Ananya Reddy",
      role: "Investment Analyst",
      image: "/placeholder.svg?height=300&width=300",
      linkedin: "#",
    },
    {
      name: "Rohan Kapoor",
      role: "Customer Success Manager",
      image: "/placeholder.svg?height=300&width=300",
      linkedin: "#",
    },
    {
      name: "Divya Malhotra",
      role: "Legal Counsel",
      image: "/placeholder.svg?height=300&width=300",
      linkedin: "#",
    },
    {
      name: "Karan Joshi",
      role: "UI/UX Designer",
      image: "/placeholder.svg?height=300&width=300",
      linkedin: "#",
    },
    {
      name: "Sanya Khanna",
      role: "Property Relations Manager",
      image: "/placeholder.svg?height=300&width=300",
      linkedin: "#",
    },
    {
      name: "Aditya Verma",
      role: "Data Scientist",
      image: "/placeholder.svg?height=300&width=300",
      linkedin: "#",
    },
  ]

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
              Meet Our <span className="gradient-text">Team</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              The passionate individuals behind FracProp who are revolutionizing real estate investment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Leadership Team</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Meet the visionaries guiding FracProp's mission to democratize real estate investment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadershipTeam.map((member, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                  <p className="text-purple-600 dark:text-purple-400 font-medium mb-4">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{member.bio}</p>
                  <div className="flex space-x-3">
                    <a
                      href={member.linkedin}
                      className="text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      <Linkedin size={20} />
                    </a>
                    <a
                      href={member.twitter}
                      className="text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      <Twitter size={20} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Our Team</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The talented individuals who make FracProp's vision a reality every day.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                variants={fadeIn}
              >
                <div className="relative h-60 overflow-hidden">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                  <p className="text-purple-600 dark:text-purple-400 text-sm mb-3">{member.role}</p>
                  <a
                    href={member.linkedin}
                    className="inline-block text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    <Linkedin size={18} />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Company Culture Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Our Culture</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                At FracProp, we foster a culture of innovation, collaboration, and continuous learning. We believe that 
                our diverse team is our greatest asset, bringing together different perspectives and experiences to 
                create the best possible platform for our investors.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We're passionate about our mission to democratize real estate investment, and this shared purpose drives 
                everything we do. We celebrate wins together, learn from challenges, and constantly push the boundaries 
                of what's possible in fractional property ownership.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Our team members enjoy flexible working arrangements, continuous professional development opportunities, 
                and a supportive environment where everyone's voice is heard and valued.
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
                  alt="FracProp Team Culture"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Join Our Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Join Our Team</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're always looking for talented individuals who are passionate about revolutionizing real estate investment.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Why Work With Us?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mt-0.5">
                      <svg className="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="ml-3 text-gray-600 dark:text-gray-300">
                      Work on cutting-edge technology in the fintech and proptech space
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mt-0.5">
                      <svg className="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="ml-3 text-gray-600 dark:text-gray-300">
                      Flexible work arrangements and competitive compensation
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mt-0.5">
                      <svg className="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="ml-3 text-gray-600 dark:text-gray-300">
                      Continuous learning and professional development opportunities
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mt-0.5">
                      <svg className="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="ml-3 text-gray-600 dark:text-gray-300">
                      Be part of a mission-driven team making real estate investment accessible to everyone
                    </span>
                  </li>
                </ul>
              </div>
              <div className="text-center md:text-left">
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Check out our current openings and join us in our mission to democratize real estate investment.
                </p>
                <Link
                  href="/careers"
                  className="inline-flex items-center bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
                >
                  View Open Positions <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>

            <div className="text-center relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Have Questions?</h2>
              <p className="text-white text-opacity-90 max-w-2xl mx-auto mb-8">
                Our team is always happy to hear from you. Reach out with any questions or inquiries.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/open-contact-us"
                  className="inline-flex items-center bg-white text-purple-600 font-medium px-8 py-3 rounded-lg hover:shadow-lg transition-all"
                >
                  <Mail size={16} className="mr-2" /> Contact Us
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

export default Team
