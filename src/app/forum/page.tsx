"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import {
  MessageSquare,
  Users,
  TrendingUp,
  Search,
  Filter,
  PlusCircle,
  Clock,
  ThumbsUp,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Tag,
} from "lucide-react"

// Mock data for forum categories
const forumCategories = [
  {
    id: 1,
    name: "Investment Strategies",
    icon: <TrendingUp className="text-blue-500" />,
    posts: 124,
    description: "Discuss various property investment strategies and approaches",
  },
  {
    id: 2,
    name: "Market Trends",
    icon: <TrendingUp className="text-green-500" />,
    posts: 87,
    description: "Analysis and discussions about current real estate market trends",
  },
  {
    id: 3,
    name: "Property Questions",
    icon: <MessageSquare className="text-purple-500" />,
    posts: 203,
    description: "Ask questions about specific properties or property types",
  },
  {
    id: 4,
    name: "Investor Networking",
    icon: <Users className="text-amber-500" />,
    posts: 56,
    description: "Connect with other investors for potential partnerships",
  },
  {
    id: 5,
    name: "Legal & Regulatory",
    icon: <MessageSquare className="text-red-500" />,
    posts: 42,
    description: "Discussions about legal aspects of property investment",
  },
]

// Mock data for forum posts
const forumPosts = [
  {
    id: 1,
    title: "What's your experience with commercial property investments?",
    author: "JaneInvestor",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    category: "Investment Strategies",
    date: "2 hours ago",
    likes: 24,
    comments: 8,
    tags: ["Commercial", "ROI", "Beginner"],
    excerpt:
      "I'm considering investing in my first commercial property and would love to hear about others' experiences...",
  },
  {
    id: 2,
    title: "Market analysis: Are property prices going to drop in 2025?",
    author: "MarketGuru",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    category: "Market Trends",
    date: "Yesterday",
    likes: 56,
    comments: 32,
    tags: ["Market Analysis", "Predictions", "Prices"],
    excerpt:
      "Based on current economic indicators and historical patterns, I've been analyzing whether we might see a correction in property prices...",
  },
  {
    id: 3,
    title: "Tax implications of fractional property ownership",
    author: "TaxSavvy",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    category: "Legal & Regulatory",
    date: "3 days ago",
    likes: 42,
    comments: 15,
    tags: ["Taxes", "Legal", "Fractional"],
    excerpt:
      "I've been researching the tax implications of fractional property ownership and wanted to share some findings...",
  },
  {
    id: 4,
    title: "Looking for co-investors for a multi-family property in Austin",
    author: "TexasInvestor",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    category: "Investor Networking",
    date: "1 week ago",
    likes: 18,
    comments: 27,
    tags: ["Partnership", "Multi-family", "Texas"],
    excerpt:
      "I've found a promising multi-family property in Austin and I'm looking for co-investors to join me in this opportunity...",
  },
  {
    id: 5,
    title: "How to evaluate property management companies?",
    author: "NewOwner",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    category: "Property Questions",
    date: "2 weeks ago",
    likes: 31,
    comments: 22,
    tags: ["Management", "Services", "Evaluation"],
    excerpt:
      "As a new property owner, I'm trying to figure out how to properly evaluate property management companies...",
  },
]

const Forum = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("discussions")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedCategory, setExpandedCategory] = useState(null)
  const [sortBy, setSortBy] = useState("recent")

  const toggleCategory = (categoryId) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null)
    } else {
      setExpandedCategory(categoryId)
    }
  }

  const filteredPosts = forumPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === "recent") {
      // Simple sort by id for mock data (higher id = more recent)
      return b.id - a.id
    } else if (sortBy === "popular") {
      // Sort by combined likes and comments
      return b.likes + b.comments - (a.likes + a.comments)
    }
    return 0
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />
      <div className="pt-28 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              Investor Community
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Connect, learn, and grow with fellow property investors
            </p>
          </div>
          <button
            onClick={() => alert("Create post functionality would go here")}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg flex items-center gap-2 hover:shadow-lg transition-all"
          >
            <PlusCircle size={18} />
            New Discussion
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "discussions"
                ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("discussions")}
          >
            Discussions
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "categories"
                ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("categories")}
          >
            Categories
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <select
                className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 pr-8"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
            <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>

        {activeTab === "discussions" ? (
          <div className="space-y-4">
            {sortedPosts.length > 0 ? (
              sortedPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-100 dark:border-gray-700"
                  onClick={() => alert(`Navigate to post ${post.id}`)}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={post.authorAvatar || "/placeholder.svg"}
                      alt={post.author}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer">
                        {post.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <span className="font-medium text-gray-700 dark:text-gray-300">{post.author}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> {post.date}
                        </span>
                        <span>•</span>
                        <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-xs">
                          {post.category}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-2">{post.excerpt}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center gap-4">
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No discussions found</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {forumCategories.map((category) => (
              <div
                key={category.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <div
                  className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">{category.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{category.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{category.posts} posts</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    {expandedCategory === category.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {expandedCategory === category.id && (
                  <div className="px-4 pb-4 pt-0 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{category.description}</p>
                    <button
                      className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                      onClick={() => alert(`Navigate to ${category.name} category`)}
                    >
                      Browse discussions →
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Forum

