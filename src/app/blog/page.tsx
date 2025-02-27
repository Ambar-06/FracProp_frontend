"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const BlogPage = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all blog posts
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}beacon/blogs/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch blogs.");

        const data = await res.json();
        if (data.success) {
          setBlogs(data.data);
        } else {
          setError("Failed to fetch blogs.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <p className="text-center mt-20 text-xl text-gray-600">Loading blogs...</p>;
  if (error) return <p className="text-center text-red-500 mt-20">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">Blog & News</h1>

        {/* Add Blog Button (Visible only to Admins) */}
        {user?.is_admin && (
          <div className="text-right mb-6">
            <Link
              href="/blog/add"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            >
              Add Blog
            </Link>
          </div>
        )}

        {/* Blog Posts List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div key={blog.uuid} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{blog.title}</h2>
                <p className="text-gray-600 text-sm mb-4">{blog.content.substring(0, 100)}...</p>
                <Link
                  href={`/blog/${blog.uuid}`}
                  className="text-blue-500 hover:underline"
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;