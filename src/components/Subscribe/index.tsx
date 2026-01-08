'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Mail, ChevronRight, ChevronLeft, Sparkles, Loader2, Send, BarChart3 } from 'lucide-react'

interface Poll {
  id: string
  question: string
  slug: string
  createdAt: string
  totalVotes?: number
  category?: {
    id: string
    title: string
    slug: string
  } | null
}

export function Subscribe() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  const [polls, setPolls] = useState<Poll[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalDocs: 0,
    hasNextPage: false,
    hasPrevPage: false,
  })

  const pollsPerPage = 5

  const fetchPolls = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pollsPerPage.toString(),
        sort: '-createdAt',
        status: 'active',
      })

      const response = await fetch(`/api/polls-list?${params}`)
      const result = await response.json()

      if (response.ok) {
        setPolls(result.docs || [])
        setPagination({
          totalPages: result.totalPages || 1,
          totalDocs: result.totalDocs || 0,
          hasNextPage: result.hasNextPage || false,
          hasPrevPage: result.hasPrevPage || false,
        })
      }
    } catch (error) {
      console.error('Error fetching polls:', error)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage])

  useEffect(() => {
    fetchPolls()
  }, [fetchPolls])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          source: 'subscribe-page',
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setMessageType('success')
        setMessage(data.message || 'Successfully subscribed!')
        setEmail('')
      } else {
        setMessageType('error')
        setMessage(data.error || 'Failed to subscribe. Please try again.')
      }
    } catch (error) {
      console.error('Subscription error:', error)
      setMessageType('error')
      setMessage('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const totalPages = pagination.totalPages

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (currentPage > 3) {
        pages.push('...')
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i)
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push('...')
      }

      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="bg-white">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-700">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-indigo-600">Subscribe</span>
        </nav>

        {/* Subscribe Header Section */}
        <div className="bg-[#F9FAFB] rounded-lg p-8 mb-8">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Subscribe To Updates!</h1>
            <p className="text-gray-600">
              Get the latest polls and trending topics delivered
              <br />
              straight to your inbox.
            </p>
          </div>

          {/* Subscribe Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="johndoe@gmail.com"
                required
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 text-white rounded-lg text-base font-medium hover:bg-indigo-700 transition-colors whitespace-nowrap"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Message */}
            {message && (
              <p
                className={`mt-2 text-sm ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}
              >
                {message}
              </p>
            )}

            {/* Links */}
            <div className="flex items-center justify-center gap-6 mt-4 text-xs">
              <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-900">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-gray-600 hover:text-gray-900">
                Terms Of Service
              </Link>
            </div>
          </form>
        </div>

        {/* Disclaimer Box */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-indigo-600">About PollWarehouse</h3>
          </div>
          <div className="space-y-3 text-[14px] text-gray-700">
            <p>
              PollWarehouse is a platform for creating and sharing polls. We aim to make it easy for
              anyone to gather opinions and engage with their audience.
            </p>
            <p>
              For questions or feedback, contact us at{' '}
              <a href="mailto:support@pollwarehouse.com" className="text-indigo-600 underline">
                support@pollwarehouse.com
              </a>
            </p>
          </div>
        </div>

        {/* Trending Polls Section */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 border-b-2 border-indigo-600 pb-1 mb-3">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            <span className="font-semibold text-lg sm:text-base text-indigo-600">Trending Polls</span>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-2">Loading polls...</p>
              </div>
            ) : polls.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No polls found.</div>
            ) : (
              <div>
                {polls.map((poll, index) => (
                  <div key={poll.id} className={index > 0 ? 'border-t border-gray-200 py-1' : ''}>
                    <Link
                      href={`/poll/${poll.slug}`}
                      className="block hover:bg-gray-50 transition-colors"
                    >
                      <div className="px-3 sm:px-6 py-3">
                        <div className="flex items-center justify-between gap-2 sm:gap-4">
                          <div className="flex gap-2 sm:gap-4 items-start flex-1 min-w-0">
                            <span className="text-indigo-600 text-sm sm:text-sm shrink-0 pt-0.5">
                              {formatDate(poll.createdAt)}
                            </span>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-gray-900 font-medium text-base sm:text-base leading-snug truncate">
                                {poll.question}
                              </h3>
                              {poll.category && (
                                <p className="text-sm text-gray-500 mt-1">{poll.category.title}</p>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 shrink-0" />
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {!isLoading && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-4">
              {/* First page */}
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                «
              </button>

              {/* Previous */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={!pagination.hasPrevPage}
                className="w-8 h-8 flex items-center justify-center rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page numbers */}
              {getPageNumbers().map((page, index) =>
                page === '...' ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="w-8 h-8 flex items-center justify-center text-gray-500"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page as number)}
                    className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              {/* Next */}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                disabled={!pagination.hasNextPage}
                className="w-8 h-8 flex items-center justify-center rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Last page */}
              <button
                onClick={() => setCurrentPage(pagination.totalPages)}
                disabled={currentPage === pagination.totalPages}
                className="w-8 h-8 flex items-center justify-center rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                »
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
