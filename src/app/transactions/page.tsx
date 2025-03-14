"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
import { ArrowLeft, ArrowRight, Calendar, CreditCard, Download, Filter, Search, SlidersHorizontal } from "lucide-react"
import Link from "next/link"

// Transaction type definition
type Transaction = {
    id: string
    user: string
    amount: number
    type: "DEPOSIT" | "WITHDRAWAL"
    remarks: string
    created_at: string
}

// Pagination metadata type
type PaginationMeta = {
    currentPage: number
    totalPages: number
    totalItems: number
    perPage: number
}

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(10)
    const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null)
    const [filterType, setFilterType] = useState<string>("")
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
        from: "",
        to: "",
    })

    // Fetch transactions with pagination and filters
    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true)
            setError(null)

            try {
                let url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}payments/transactions?page=${page}&perPage=${perPage}`

                // Add filters if they exist
                if (filterType) url += `&type=${filterType}`
                if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`
                if (dateRange.from) url += `&from=${dateRange.from}`
                if (dateRange.to) url += `&to=${dateRange.to}`

                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                })

                if (response.status === 401 || response.status === 408) {
                    localStorage.removeItem("token")
                    window.location.href = "/login"
                    throw new Error("Unauthorized")
                }

                if (!response.ok) {
                    throw new Error("Failed to fetch transactions")
                }

                const data = await response.json()

                if (data.success) {
                    setTransactions(data.data)

                    // Set pagination metadata if available
                    if (data.meta && data.meta.pagination) {
                        setPaginationMeta({
                            currentPage: data.meta.pagination.currentPage,
                            totalPages: data.meta.pagination.totalPages,
                            totalItems: data.meta.pagination.totalItems,
                            perPage: data.meta.pagination.perPage,
                        })
                    }
                } else {
                    throw new Error(data.message || "Failed to fetch transactions")
                }
            } catch (err) {
                setError(err.message || "An error occurred while fetching transactions")
            } finally {
                setLoading(false)
            }
        }

        fetchTransactions()
    }, [page, perPage, filterType, searchQuery, dateRange])

    // Handle page change
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && (!paginationMeta || newPage <= paginationMeta.totalPages)) {
            setPage(newPage)
        }
    }

    // Handle per page change
    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPerPage(Number(e.target.value))
        setPage(1) // Reset to first page when changing items per page
    }

    // Handle filter change
    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterType(e.target.value)
        setPage(1) // Reset to first page when applying filters
    }

    // Handle search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        // Search is already handled by the useEffect dependency
    }

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    }

    // Export transactions as CSV
    const exportTransactions = () => {
        if (!transactions.length) return

        const headers = ["ID", "Type", "Amount", "Remarks", "Date"]
        const csvData = transactions.map((tx) => [
            tx.id,
            tx.type,
            tx.amount.toString(),
            tx.remarks || "",
            new Date(tx.created_at).toISOString(),
        ])

        const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `transactions_${new Date().toISOString().split("T")[0]}.csv`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="grid-background min-h-screen pb-20">
            <Navbar />

            <div className="pt-28 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Transactions</h1>
                            <p className="text-gray-400">View and manage all your financial transactions</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <button
                                onClick={exportTransactions}
                                disabled={!transactions.length}
                                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Download size={18} />
                                <span>Export CSV</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-xl p-4 mb-8 shadow-lg">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <form onSubmit={handleSearch} className="w-full">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search transactions..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-10 pr-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </form>
                        </div>
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-lg transition-colors border border-gray-200"
                        >
                            <SlidersHorizontal size={18} />
                            <span>Filters</span>
                        </button>
                        <div className="relative">
                            <select
                                onChange={handleFilterChange}
                                value={filterType}
                                className="appearance-none bg-gray-50 border border-gray-200 rounded-lg py-3 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="">All Types</option>
                                <option value="DEPOSIT">Deposits</option>
                                <option value="WITHDRAWAL">Withdrawals</option>
                            </select>
                            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Expanded Filters */}
                    {isFilterOpen && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="date"
                                        value={dateRange.from}
                                        onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-10 pr-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="date"
                                        value={dateRange.to}
                                        onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-10 pr-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Items Per Page</label>
                                <select
                                    value={perPage}
                                    onChange={handlePerPageChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value={5}>5 per page</option>
                                    <option value={10}>10 per page</option>
                                    <option value={25}>25 per page</option>
                                    <option value={50}>50 per page</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Transactions Table */}
                <div className="glass-effect rounded-xl overflow-hidden mb-8">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20">
                            <p className="text-red-400 mb-4">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-400 mb-4">No transactions found</p>
                            <Link href="/dashboard">
                                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                                    Back to Dashboard
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-800 border-b border-gray-700">
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Transaction ID
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {transactions.map((transaction, index) => (
                                        <tr key={index} className="hover:bg-gray-800 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                <div className="flex items-center">
                                                    <CreditCard
                                                        size={16}
                                                        className={`mr-2 ${transaction.type === "DEPOSIT" ? "text-green-400" : "text-red-400"}`}
                                                    />
                                                    <span>{transaction.id?.substring(0, 8) || "N/A"}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${transaction.type === "DEPOSIT"
                                                            ? "bg-green-900 bg-opacity-30 text-green-400"
                                                            : "bg-red-900 bg-opacity-30 text-red-400"
                                                        }`}
                                                >
                                                    {transaction.type}
                                                </span>
                                            </td>
                                            <td
                                                className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${transaction.type === "DEPOSIT" ? "text-green-400" : "text-red-400"
                                                    }`}
                                            >
                                                {transaction.type === "DEPOSIT" ? "+" : "-"}₹{transaction.amount.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {transaction.remarks || "Transaction"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {formatDate(transaction.created_at)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination Controls */}
                {!loading && !error && transactions.length > 0 && paginationMeta && (
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-gray-400 text-sm mb-4 md:mb-0">
                            Showing {(paginationMeta.currentPage - 1) * paginationMeta.perPage + 1} to{" "}
                            {Math.min(paginationMeta.currentPage * paginationMeta.perPage, paginationMeta.totalItems)} of{" "}
                            {paginationMeta.totalItems} transactions
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${page === 1
                                        ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                                        : "bg-gray-800 text-white hover:bg-gray-700"
                                    } transition-colors`}
                            >
                                <ArrowLeft size={16} />
                                <span>Previous</span>
                            </button>
                            <div className="glass-effect px-4 py-2 rounded-lg">
                                <span className="text-white">
                                    Page {paginationMeta.currentPage} of {paginationMeta.totalPages}
                                </span>
                            </div>
                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === paginationMeta.totalPages}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${page === paginationMeta.totalPages
                                        ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                                        : "bg-gray-800 text-white hover:bg-gray-700"
                                    } transition-colors`}
                            >
                                <span>Next</span>
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TransactionsPage

