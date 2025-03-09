"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import { Book, Calendar, Plus } from "lucide-react"

const BlogPage = () => {
  const { user } = useAuth()
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all blog posts
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}beacon/blogs/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (!res.ok) throw new Error("Failed to fetch blogs.")

        const data = await res.json()
        if (data.success) {
          setBlogs(data.data)
        } else {
          setError("Failed to fetch blogs.")
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <p className="text-red-500 text-center">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-28 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Blog & News</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest trends, insights, and news from the real estate investment world.
          </p>
        </div>

        {/* Add Blog Button (Visible only to Admins) */}
        {user?.is_admin && (
          <div className="text-right mb-8">
            <Link
              href="/blog/add"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
            >
              <Plus size={18} />
              Add Blog
            </Link>
          </div>
        )}

        {/* Blog Posts List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.uuid}
              className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl border border-gray-200"
            >
              <div className="p-6">
                <div className="flex items-center gap-2 text-purple-600 mb-2">
                  <Book size={16} />
                  <span className="text-sm font-medium">Article</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{blog.title}</h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{blog.content.substring(0, 150)}...</p>
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar size={14} className="mr-1" />
                    <span>{new Date(blog.created_at || Date.now()).toLocaleDateString()}</span>
                  </div>
                  <Link
                    href={`/blog/${blog.uuid}`}
                    className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {blogs.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Book size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Blog Posts Yet</h3>
            <p className="text-gray-500">Check back later for new content.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogPage

