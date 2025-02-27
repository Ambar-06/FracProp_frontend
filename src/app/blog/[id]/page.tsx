"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DOMPurify from "dompurify"; // For sanitizing HTML
import Navbar from "@/components/Navbar"; // Import Navbar for consistency

const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blog details
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}beacon/blogs/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch blog.");

        const data = await res.json();
        if (data.success) {
          setBlog(data.data); // Set the blog data from the response
        } else {
          setError("Failed to fetch blog.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) return <p className="text-center mt-20 text-xl text-gray-600">Loading blog...</p>;
  if (error) return <p className="text-center text-red-500 mt-20">{error}</p>;

  // Sanitize HTML content to prevent XSS attacks
  const sanitizedContent = DOMPurify.sanitize(blog?.content || "");

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <Navbar /> {/* Add Navbar for consistency */}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto mt-20 p-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">{blog?.title}</h1>

        {/* Blog Content */}
        <div className="bg-white p-6 shadow-lg rounded-xl">
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </div>

        {/* Metadata Section */}
        <div className="mt-6 bg-white p-6 shadow-lg rounded-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Created At</p>
              <p className="text-xl font-bold text-green-600">
                {new Date(blog?.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Updated At</p>
              <p className="text-xl font-bold text-green-600">
                {new Date(blog?.updated_at).toLocaleDateString()}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Time to Read</p>
              <p className="text-xl font-bold text-green-600">
                {blog?.time_to_read_in_minutes} minutes
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Author</p>
              <p className="text-xl font-bold text-green-600">User {blog?.author}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;