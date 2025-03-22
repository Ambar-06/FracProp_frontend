"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import OpenNavbar from "@/components/OpenNavbar"
import { Book, Calendar, Search, Tag, ArrowRight, ChevronDown, Filter, User } from "lucide-react"
import { motion } from "framer-motion"

const OpenBlogs = () => {
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

  // Define blog type to match API response
  type Blog = {
    uuid: string
    title: string
    content: string
    created_at: string
    updated_at: string
    is_deleted: boolean
    time_to_read_in_minutes?: number
    author?: number
    category?: string
    tags?: string[]
    featured_image?: string
  }

  // Fetch all blog posts
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Fetch blogs from the API
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}beacon/public/blogs/`, {
          method: "GET",
        })

        if (!res.ok) throw new Error("Failed to fetch blogs.")

        const data = await res.json()
        if (data.success) {
          // Process the blog data to add missing properties
          const processedBlogs = data.data.map((blog) => {
            // Extract a category from the content or title (simplified approach)
            const categoryMatch = blog.title.match(/Investment|Strategy|Market|Legal|Property|Finance/i)
            const category = categoryMatch ? categoryMatch[0] : "General"

            // Extract tags from content (simplified approach)
            const tagMatches = blog.content.match(
              /Real Estate|Investment|Property|Market|India|Growth|Economy|Housing/gi,
            )
            const tags = tagMatches ? [...new Set(tagMatches)] : ["Real Estate"]

            // Create a featured image placeholder
            const featured_image = "/placeholder.svg?height=400&width=600"

            return {
              ...blog,
              category,
              tags,
              featured_image,
            }
          })

          setBlogs(processedBlogs)
        } else {
          setError("Failed to fetch blogs.")
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    // For now, use mock data until the API is ready
    // const mockBlogs = [
    //   {
    //     uuid: "1",
    //     title: "Understanding Fractional Real Estate Investment",
    //     content: "Fractional real estate investment is revolutionizing how people invest in property. Instead of purchasing an entire property, investors can buy shares or fractions of high-value real estate assets...",
    //     created_at: new Date().toISOString(),
    //     category: "Investment",
    //     author: "Sarah Johnson",
    //     featured_image: "/placeholder.svg?height=400&width=600",
    //     tags: ["Investment", "Real Estate", "Beginner"]
    //   },
    //   {
    //     uuid: "2",
    //     title: "5 Benefits of Diversifying Your Property Portfolio",
    //     content: "Diversification is a key strategy for reducing risk and maximizing returns in any investment portfolio. When it comes to real estate, spreading your investments across different property types, locations, and markets can provide significant advantages...",
    //     created_at: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    //     category: "Strategy",
    //     author: "Michael Chen",
    //     featured_image: "/placeholder.svg?height=400&width=600",
    //     tags: ["Diversification", "Strategy", "Portfolio"]
    //   },
    //   {
    //     uuid: "3",
    //     title: "Real Estate Market Trends for 2025",
    //     content: "As we look ahead to 2025, several emerging trends are shaping the real estate market. From the continued growth of remote work affecting housing demands to the increasing importance of sustainability in property development...",
    //     created_at: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    //     category: "Market Analysis",
    //     author: "Priya Patel",
    //     featured_image: "/placeholder.svg?height=400&width=600",
    //     tags: ["Market Trends", "Forecast", "Analysis"]
    //   },
    //   {
    //     uuid: "4",
    //     title: "How to Evaluate Rental Yield Before Investing",
    //     content: "Rental yield is one of the most important metrics for property investors to understand. It provides a clear indication of the return you can expect from your investment relative to its cost...",
    //     created_at: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
    //     category: "Investment",
    //     author: "James Wilson",
    //     featured_image: "/placeholder.svg?height=400&width=600",
    //     tags: ["Rental Yield", "Investment", "Analysis"]
    //   },
    //   {
    //     uuid: "5",
    //     title: "Legal Aspects of Fractional Property Ownership",
    //     content: "Fractional property ownership comes with unique legal considerations that investors should understand before diving in. From ownership structures and shareholder agreements to regulatory compliance...",
    //     created_at: new Date(Date.now() - 86400000 * 15).toISOString(), // 15 days ago
    //     category: "Legal",
    //     author: "Amanda Rodriguez",
    //     featured_image: "/placeholder.svg?height=400&width=600",
    //     tags: ["Legal", "Compliance", "Ownership"]
    //   },
    //   {
    //     uuid: "6",
    //     title: "Commercial vs. Residential: Which is Right for You?",
    //     content: "When building your real estate investment portfolio, one of the fundamental decisions is whether to focus on commercial properties, residential properties, or a mix of both...",
    //     created_at: new Date(Date.now() - 86400000 * 20).toISOString(), // 20 days ago
    //     category: "Strategy",
    //     author: "David Thompson",
    //     featured_image: "/placeholder.svg?height=400&width=600",
    //     tags: ["Commercial", "Residential", "Comparison"]
    //   }
    // ]

    // // Use mock data for now
    // setTimeout(() => {
    //   setBlogs(mockBlogs)
    //   setLoading(false)
    // }, 1000)

    // Uncomment this when API is ready
    // fetchBlogs()
    fetchBlogs()
  }, [])

  // Filter blogs based on search query and category
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = activeCategory === "all" || blog.category === activeCategory

    return matchesSearch && matchesCategory
  })

  // Sort blogs
  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    } else {
      // Alphabetical
      return a.title.localeCompare(b.title)
    }
  })

  // Get unique categories
  const categories = ["all", ...new Set(blogs.map((blog) => blog.category))]

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-purple-600 animate-spin mb-4"></div>
          <p className="text-gray-700">Loading blogs...</p>
        </div>
      </div>
    )

  if (error)
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <OpenNavbar />
      <div className="pt-10 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            <span className="gradient-text">Blog & Insights</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Stay updated with the latest trends, insights, and news from the real estate investment world.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="recent">Most Recent</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={16}
                />
              </div>
              <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <Filter size={20} />
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {category === "all" ? "All Categories" : category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts */}
        {sortedBlogs.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {sortedBlogs.map((blog) => (
              <motion.div
                key={blog.uuid}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
                variants={itemVariants}
              >
                {blog.featured_image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={blog.featured_image || "/placeholder.svg"}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {blog.category}
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-2">
                    <Book size={16} />
                    <span className="text-sm font-medium">
                      {blog.time_to_read_in_minutes ? `${blog.time_to_read_in_minutes} min read` : "Article"}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    <Link href={`/login?redirect=/blog/${blog.uuid}`}>{blog.title}</Link>
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{blog.content}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      >
                        <Tag size={12} className="mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {blog.author && (
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-2">
                      <User size={14} className="mr-1" />
                      <span>Author #{blog.author}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <Calendar size={14} className="mr-1" />
                      <span>{formatDate(blog.created_at)}</span>
                    </div>
                    <Link
                      href={`/login?redirect=/blog/${blog.uuid}`}
                      className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm flex items-center"
                    >
                      Read More <ArrowRight size={14} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <Book size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Blog Posts Found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? "Try adjusting your search or filters." : "Check back later for new content."}
            </p>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl p-8 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h3>
            <p className="mb-6">Get the latest insights and updates delivered straight to your inbox.</p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-gray-900"
              />
              <button className="bg-white text-purple-600 font-medium px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

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
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.903 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.023.047 1.351.058 3.807.058h.468c2.456 0 2.784-.011 3.807-.058.975-.045 1.504-.207 1.857-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.047-1.023.058-1.351.058-3.807v-.468c0-2.456-.011-2.784-.058-3.807-.045-.975-.207-1.504-.344-1.857a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
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

export default OpenBlogs
