"use client"

import { useEffect, useState } from "react"
import OpenNavbar from "@/components/OpenNavbar"
import { Briefcase, MapPin, Clock, Calendar, Search, Filter, ChevronDown, ArrowRight } from 'lucide-react'
import { motion } from "framer-motion"
import Footer from "@/components/CommonFooter"

// Job type definition
type Job = {
  id: number
  uuid: string
  title: string
  department: string
  location: string
  type: string
  posted: string
  description: string
  created_at: string
  updated_at: string
}

const CareersPage = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}beacon/jobs`)
        
        if (!res.ok) {
          throw new Error("Failed to fetch job listings")
        }
        
        const data = await res.json()
        
        if (data.success) {
          setJobs(data.data)
          setFilteredJobs(data.data)
        } else {
          throw new Error(data.message || "Failed to fetch job listings")
        }
      } catch (err) {
        setError(err.message || "An error occurred while fetching job listings")
      } finally {
        setLoading(false)
      }
    }
    
    fetchJobs()
  }, [])

  // Apply filters whenever filter state changes
  useEffect(() => {
    let result = jobs

    // Apply search filter
    if (searchQuery) {
      result = result.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply department filter
    if (departmentFilter !== "all") {
      result = result.filter(job => job.department === departmentFilter)
    }

    // Apply location filter
    if (locationFilter !== "all") {
      result = result.filter(job => job.location.includes(locationFilter))
    }

    // Apply job type filter
    if (typeFilter !== "all") {
      result = result.filter(job => job.type === typeFilter)
    }

    setFilteredJobs(result)
  }, [searchQuery, departmentFilter, locationFilter, typeFilter, jobs])

  // Get unique departments, locations, and job types for filter options
  const departments = ["all", ...new Set(jobs.map(job => job.department))]
  const locations = ["all", ...new Set(jobs.map(job => {
    const city = job.location.split(',')[0].trim()
    return city
  }))]
  const jobTypes = ["all", ...new Set(jobs.map(job => job.type))]

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Format job type for display
  const formatJobType = (type: string) => {
    return type.replace('_', ' ').toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // Format department for display
  const formatDepartment = (dept: string) => {
    return dept.charAt(0) + dept.slice(1).toLowerCase()
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-purple-600 animate-spin mb-4"></div>
          <p className="text-gray-700">Loading job opportunities...</p>
        </div>
      </div>
    )

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <OpenNavbar />
        <div className="pt-10 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md">
              <p className="text-red-500 dark:text-red-400 text-center">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-all"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <OpenNavbar />
      <div className="pt-10 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            <span className="gradient-text">Join Our Team</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover exciting career opportunities at FracProp and be part of revolutionizing real estate investment
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {/* Department Filter */}
              <div className="relative">
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">All Departments</option>
                  {departments.filter(dept => dept !== "all").map((dept) => (
                    <option key={dept} value={dept}>{formatDepartment(dept)}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
              
              {/* Location Filter */}
              <div className="relative">
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">All Locations</option>
                  {locations.filter(loc => loc !== "all").map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
              
              {/* Job Type Filter */}
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">All Job Types</option>
                  {jobTypes.filter(type => type !== "all").map((type) => (
                    <option key={type} value={type}>{formatJobType(type)}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
              
              <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <Filter size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        {filteredJobs.length > 0 ? (
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredJobs.map((job) => (
              <motion.div
                key={job.uuid}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
                variants={itemVariants}
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-2">
                        <Briefcase size={16} />
                        <span className="text-sm font-medium">{formatDepartment(job.department)}</span>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{job.title}</h2>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <MapPin size={16} className="mr-1" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock size={16} className="mr-1" />
                          <span>{formatJobType(job.type)}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-1" />
                          <span>Posted {formatDate(job.posted)}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center"
                      onClick={() => window.open(`/login?redirect=/apply/${job.uuid}`, '_blank')}
                    >
                      Apply Now <ArrowRight size={16} className="ml-2" />
                    </button>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-300">{job.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Jobs Found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery || departmentFilter !== "all" || locationFilter !== "all" || typeFilter !== "all" 
                ? "Try adjusting your search or filters." 
                : "We don't have any open positions at the moment. Please check back later."}
            </p>
          </div>
        )}

        {/* Company Culture Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">
            Why Work With Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Innovation</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We're revolutionizing real estate investment with cutting-edge technology and creative solutions.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Inclusive Culture</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We celebrate diversity and foster an environment where everyone's voice is heard and valued.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Growth Opportunities</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We invest in our team's professional development with continuous learning and advancement paths.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl p-8 text-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Our Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="bg-white/20 p-2 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Comprehensive Health Insurance</h3>
                  <p className="text-white/80">Medical, dental, and vision coverage for you and your family</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-white/20 p-2 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Flexible Work Hours</h3>
                  <p className="text-white/80">Work-life balance with flexible scheduling and remote options</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-white/20 p-2 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Competitive Compensation</h3>
                  <p className="text-white/80">Salary packages that recognize your skills and experience</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-white/20 p-2 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Modern Office Space</h3>
                  <p className="text-white/80">Collaborative workspaces designed for creativity and productivity</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Application Process */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">
            Our Application Process
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-8 left-8 right-8 h-0.5 bg-gray-200 dark:bg-gray-700"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                    <span className="text-xl font-bold text-purple-600 dark:text-purple-400">1</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Apply Online</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Submit your application through our careers portal
                  </p>
                </div>
                
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                    <span className="text-xl font-bold text-purple-600 dark:text-purple-400">2</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Initial Screening</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Our team reviews your application and qualifications
                  </p>
                </div>
                
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                    <span className="text-xl font-bold text-purple-600 dark:text-purple-400">3</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Interviews</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Meet with our team to discuss your experience and fit
                  </p>
                </div>
                
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                    <span className="text-xl font-bold text-purple-600 dark:text-purple-400">4</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Offer & Onboarding</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Receive your offer and join our team
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Don't see a position that fits your skills?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            We're always looking for talented individuals to join our team. Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <button 
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all"
            onClick={() => window.open('/contact', '_self')}
          >
            Contact Us
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default CareersPage
