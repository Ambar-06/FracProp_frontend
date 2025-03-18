"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  DollarSign,
  MessageSquare,
  Calendar,
  Clock,
  ChevronDown,
  Filter,
  Search,
  X,
} from "lucide-react"

// Mock notification data
const mockNotifications = [
  {
    id: 1,
    type: "transaction",
    title: "Investment Confirmed",
    message: "Your investment of $5,000 in Property #1234 has been confirmed.",
    date: "2023-11-15T10:30:00",
    read: false,
    icon: <DollarSign className="text-green-500" />,
    actionUrl: "/transactions",
  },
  {
    id: 2,
    type: "property",
    title: "Property Approved",
    message: 'Your property listing "Luxury Apartment in Downtown" has been approved.',
    date: "2023-11-14T14:45:00",
    read: true,
    icon: <CheckCircle className="text-green-500" />,
    actionUrl: "/properties/123",
  },
  {
    id: 3,
    type: "message",
    title: "New Message",
    message: "You have received a new message from John regarding Property #5678.",
    date: "2023-11-13T09:15:00",
    read: false,
    icon: <MessageSquare className="text-blue-500" />,
    actionUrl: "/messages/456",
  },
  {
    id: 4,
    type: "alert",
    title: "Payment Due",
    message: "Your monthly payment for Property #9012 is due in 3 days.",
    date: "2023-11-12T16:20:00",
    read: false,
    icon: <AlertCircle className="text-amber-500" />,
    actionUrl: "/payments",
  },
  {
    id: 5,
    type: "system",
    title: "System Maintenance",
    message: "FracProp will be undergoing maintenance on November 20th from 2:00 AM to 4:00 AM UTC.",
    date: "2023-11-10T11:00:00",
    read: true,
    icon: <Info className="text-purple-500" />,
    actionUrl: "/announcements",
  },
  {
    id: 6,
    type: "event",
    title: "Upcoming Webinar",
    message: 'Don\'t miss our webinar on "Fractional Property Investment Strategies" this Friday at 3 PM.',
    date: "2023-11-08T13:30:00",
    read: true,
    icon: <Calendar className="text-blue-500" />,
    actionUrl: "/events",
  },
  {
    id: 7,
    type: "transaction",
    title: "Dividend Payment",
    message: "A dividend of $320 from Property #3456 has been deposited to your account.",
    date: "2023-11-05T10:15:00",
    read: false,
    icon: <DollarSign className="text-green-500" />,
    actionUrl: "/transactions",
  },
  {
    id: 8,
    type: "property",
    title: "Price Change",
    message: 'The property "Commercial Space in Tech Hub" has decreased in price by 5%.',
    date: "2023-11-03T09:45:00",
    read: true,
    icon: <Info className="text-purple-500" />,
    actionUrl: "/properties/789",
  },
  {
    id: 9,
    type: "alert",
    title: "Document Verification Required",
    message: "Please verify your identity document to continue with your investment.",
    date: "2023-11-01T14:20:00",
    read: false,
    icon: <AlertCircle className="text-red-500" />,
    actionUrl: "/profile/documents",
  },
  {
    id: 10,
    type: "system",
    title: "New Feature Available",
    message: "Check out our new portfolio analytics dashboard for better investment tracking.",
    date: "2023-10-28T16:10:00",
    read: true,
    icon: <Info className="text-blue-500" />,
    actionUrl: "/dashboard",
  },
]

const NotificationCenter = () => {
  const router = useRouter()
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedNotification, setExpandedNotification] = useState(null)

  const toggleNotificationExpand = (id) => {
    if (expandedNotification === id) {
      setExpandedNotification(null)
    } else {
      setExpandedNotification(id)
      // Mark as read when expanded
      setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
    }
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const deleteNotification = (id, e) => {
    e.stopPropagation()
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const filteredNotifications = notifications.filter((notif) => {
    // Apply type filter
    if (filter !== "all" && notif.type !== filter) return false

    // Apply search filter
    if (
      searchQuery &&
      !notif.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !notif.message.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    return true
  })

  const unreadCount = notifications.filter((notif) => !notif.read).length

  // Format date to relative time (e.g., "2 days ago")
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return "just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`

    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />
      <div className="pt-28 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <Bell className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                Notifications
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Stay updated with your investments and properties</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              disabled={unreadCount === 0}
            >
              Mark all as read
            </button>
            <button
              onClick={() => alert("Settings would open here")}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Settings
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <select
                className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 pr-8"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Notifications</option>
                <option value="transaction">Transactions</option>
                <option value="property">Properties</option>
                <option value="message">Messages</option>
                <option value="alert">Alerts</option>
                <option value="system">System</option>
                <option value="event">Events</option>
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

        {/* Notification Count */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? "s" : ""}
            {unreadCount > 0 && ` (${unreadCount} unread)`}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Clock className="h-4 w-4" /> Sorted by newest
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border ${
                  notification.read
                    ? "border-gray-100 dark:border-gray-700"
                    : "border-l-4 border-l-purple-500 border-t border-r border-b border-gray-100 dark:border-gray-700"
                }`}
              >
                <div
                  className="p-4 flex items-start gap-3 cursor-pointer"
                  onClick={() => toggleNotificationExpand(notification.id)}
                >
                  <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 flex-shrink-0">{notification.icon}</div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3
                        className={`font-semibold ${notification.read ? "text-gray-700 dark:text-gray-300" : "text-gray-900 dark:text-white"}`}
                      >
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatRelativeTime(notification.date)}
                        </span>
                        <button
                          onClick={(e) => deleteNotification(notification.id, e)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                          aria-label="Delete notification"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p
                      className={`mt-1 ${
                        notification.read ? "text-gray-500 dark:text-gray-400" : "text-gray-700 dark:text-gray-300"
                      } ${expandedNotification === notification.id ? "" : "line-clamp-2"}`}
                    >
                      {notification.message}
                    </p>
                    {expandedNotification === notification.id && (
                      <button
                        className="mt-3 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                        onClick={(e) => {
                          e.stopPropagation()
                          alert(`Navigate to: ${notification.actionUrl}`)
                        }}
                      >
                        View details →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
              <Bell className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No notifications found</h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                {searchQuery
                  ? "Try adjusting your search or filter to find what you're looking for."
                  : "You're all caught up! Check back later for new notifications."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NotificationCenter

