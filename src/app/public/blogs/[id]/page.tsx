"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import OpenNavbar from "@/components/OpenNavbar"
import DOMPurify from "dompurify" // For sanitizing HTML
import { Calendar, Clock, User, ArrowLeft, Share2, Tag } from "lucide-react"
import Link from "next/link"
import Footer from "@/components/CommonFooter"

// Blog type definition
type Blog = {
  uuid: string
  title: string
  content: string
  created_at: string
  updated_at: string
  time_to_read_in_minutes?: number
  author?: string | number
  is_deleted: boolean
}

const OpenBlogDetailPage = () => {
  const { id } = useParams()
  const router = useRouter()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch blog details
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}beacon/public/blogs/${id}`)

        if (!res.ok) throw new Error("Failed to fetch blog.")

        const data = await res.json()
        if (data.success) {
          setBlog(data.data) // Set the blog data from the response
        } else {
          setError("Failed to fetch blog.")
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchBlog()
    }
  }, [id])

  // Sanitize HTML content to prevent XSS attacks
  const sanitizedContent = blog?.content ? DOMPurify.sanitize(blog.content) : ""

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Extract tags from content (mock implementation)
  const extractTags = () => {
    // In a real implementation, you might extract tags from the blog content or metadata
    // For now, we'll return some mock tags
    return ["Real Estate", "Investment", "Property", "Market Trends"]
  }

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <OpenNavbar />
        <div className="pt-10 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading blog post...</p>
          </div>
        </div>
      </div>
    )

  if (error || !blog)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <OpenNavbar />
        <div className="pt-10 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md">
              <p className="text-red-500 dark:text-red-400 text-center">{error || "Blog post not found"}</p>
              <button
                onClick={() => router.push("/open-blogs")}
                className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-all"
              >
                Back to Blogs
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
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/open-blogs"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Blogs
          </Link>
        </div>

        {/* Blog Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{blog.title}</h1>

          <div className="flex flex-wrap items-center text-gray-500 dark:text-gray-400 text-sm gap-4 md:gap-6">
            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              <span>{formatDate(blog.created_at)}</span>
            </div>
            {blog.time_to_read_in_minutes && (
              <div className="flex items-center">
                <Clock size={16} className="mr-2" />
                <span>{blog.time_to_read_in_minutes} min read</span>
              </div>
            )}
            {blog.author && (
              <div className="flex items-center">
                <User size={16} className="mr-2" />
                <span>By {typeof blog.author === "number" ? `Author #${blog.author}` : blog.author}</span>
              </div>
            )}
          </div>
        </div>

        {/* Blog Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
          {/* Content */}
          <div className="p-6 md:p-8">
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-purple-600 dark:prose-a:text-purple-400"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          </div>
        </div>

        {/* Tags Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {extractTags().map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
              >
                <Tag size={14} className="mr-1" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Metadata Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Published On</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(blog.created_at)}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last Updated</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(blog.updated_at)}</p>
          </div>
          {blog.time_to_read_in_minutes && (
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Reading Time</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {blog.time_to_read_in_minutes} minutes
              </p>
            </div>
          )}
          {blog.author && (
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Author</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {typeof blog.author === "number" ? `Author #${blog.author}` : blog.author}
              </p>
            </div>
          )}
        </div>

        {/* Share Section */}
        <div className="flex justify-center">
          <div className="inline-flex items-center bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700">
            <Share2 size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Share this article</span>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to start your investment journey?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Join thousands of investors who are already building wealth through fractional property ownership.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-block bg-white text-purple-600 font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Sign Up Now
            </Link>
            <Link
              href="/login"
              className="inline-block bg-purple-800 bg-opacity-50 text-white font-medium px-6 py-3 rounded-lg hover:bg-opacity-70 transition-colors border border-white"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    <Link href="/login">
                      {i === 1
                        ? "Understanding Property Valuation Methods"
                        : i === 2
                          ? "Top 5 Cities for Real Estate Investment"
                          : "How to Build a Diversified Property Portfolio"}
                    </Link>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {i === 1
                      ? "Learn about different methods used to value properties and how they impact your investment decisions."
                      : i === 2
                        ? "Discover the most promising cities for real estate investment in 2025 based on growth potential and returns."
                        : "Strategies for building a well-balanced property portfolio that minimizes risk and maximizes returns."}
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {i === 1 ? "Mar 15, 2025" : i === 2 ? "Mar 10, 2025" : "Mar 5, 2025"}
                    </div>
                    <Link
                      href="/login"
                      className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default OpenBlogDetailPage

