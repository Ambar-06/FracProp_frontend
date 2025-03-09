"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import Navbar from "@/components/Navbar"
import { ArrowLeft, FileText, Type, AlertCircle } from "lucide-react"
import Link from "next/link"

const AddBlogPage = () => {
  const { user } = useAuth()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.is_admin) {
      setError("Only admins can add blogs.")
      return
    }

    if (!title.trim()) {
      setError("Please enter a title.")
      return
    }

    if (!content.trim()) {
      setError("Please enter content.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}beacon/blogs/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      })

      if (!res.ok) throw new Error("Failed to add blog.")

      const data = await res.json()
      if (data.success) {
        router.push("/blog") // Redirect to the blog page after adding
      } else {
        setError("Failed to add blog.")
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-28 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/blog" className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to Blogs
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Add New Blog Post</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Share your insights and knowledge with the FracProp community
          </p>
        </div>

        {/* Add Blog Form */}
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
          >
            <div className="p-6 md:p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                  <AlertCircle className="text-red-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="mb-6">
                <label htmlFor="title" className="flex items-center text-gray-700 text-sm font-medium mb-2">
                  <Type size={16} className="mr-2" />
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter blog title"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="content" className="flex items-center text-gray-700 text-sm font-medium mb-2">
                  <FileText size={16} className="mr-2" />
                  Content
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[300px]"
                  placeholder="Write your blog content here..."
                  required
                />
                <p className="mt-2 text-xs text-gray-500">
                  You can use HTML tags for formatting. For example, &lt;h2&gt;Heading&lt;/h2&gt; for headings,
                  &lt;p&gt;Paragraph&lt;/p&gt; for paragraphs, etc.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Publishing..." : "Publish Blog Post"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddBlogPage

