"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import DOMPurify from "dompurify" // For sanitizing HTML
import Navbar from "@/components/Navbar"
import { Calendar, Clock, User, ArrowLeft, Share2 } from "lucide-react"
import Link from "next/link"
import Image from 'next/image';

const BlogDetailPage = () => {
  const { id } = useParams()
  const router = useRouter()
  const [blog, setBlog] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch blog details
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}beacon/blogs/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

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

    fetchBlog()
  }, [id])

  // Sanitize HTML content to prevent XSS attacks
  const sanitizedContent = DOMPurify.sanitize(blog?.content || "")

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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-purple-600 animate-spin mb-4"></div>
          <p className="text-gray-700">Loading blog post...</p>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <p className="text-red-500 text-center">{error}</p>
          <button
            onClick={() => router.push("/blog")}
            className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-all"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-28 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/blog" className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to Blogs
          </Link>
        </div>

        {/* Blog Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{blog?.title}</h1>

          <div className="flex flex-wrap items-center text-gray-500 text-sm gap-4 md:gap-6">
            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              <span>{formatDate(blog?.created_at)}</span>
            </div>
            {blog?.time_to_read_in_minutes && (
              <div className="flex items-center">
                <Clock size={16} className="mr-2" />
                <span>{blog?.time_to_read_in_minutes} min read</span>
              </div>
            )}
            {blog?.author && (
              <div className="flex items-center">
                <User size={16} className="mr-2" />
                <span>By {blog?.author}</span>
              </div>
            )}
          </div>
        </div>

        {/* Blog Content */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-8">
          {/* Featured Image (if available) */}
          {blog?.featured_image && (
            <div className="w-full h-64 md:h-96 bg-gray-200">
              <Image
                src={blog.featured_image || "/placeholder.svg"}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6 md:p-8">
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-purple-600"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          </div>
        </div>

        {/* Metadata Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Published On</p>
            <p className="text-sm font-medium text-gray-900">{formatDate(blog?.created_at)}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Last Updated</p>
            <p className="text-sm font-medium text-gray-900">{formatDate(blog?.updated_at)}</p>
          </div>
          {blog?.time_to_read_in_minutes && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Reading Time</p>
              <p className="text-sm font-medium text-gray-900">{blog?.time_to_read_in_minutes} minutes</p>
            </div>
          )}
          {blog?.author && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Author</p>
              <p className="text-sm font-medium text-gray-900">{blog?.author}</p>
            </div>
          )}
        </div>

        {/* Share Section */}
        <div className="flex justify-center">
          <div className="inline-flex items-center bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
            <Share2 size={16} className="text-gray-500 mr-2" />
            <span className="text-sm text-gray-700">Share this article</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogDetailPage

