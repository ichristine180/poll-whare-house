'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronRight, ChevronLeft, BarChart3 } from 'lucide-react'

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

function timeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min${minutes !== 1 ? 's' : ''} ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`

  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`

  const months = Math.floor(days / 30)
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`

  const years = Math.floor(months / 12)
  return `${years} year${years !== 1 ? 's' : ''} ago`
}

export function RecentPolls() {
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

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const totalPages = pagination.totalPages

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) pages.push(i)
      }
      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div>
      <div className="inline-flex items-center gap-2 border-b-2 border-indigo-600 pb-1 mb-3">
        <BarChart3 className="w-5 h-5 text-indigo-600" />
        <span className="font-semibold text-base text-indigo-600">Recent Polls</span>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="mt-2">Loading polls...</p>
          </div>
        ) : polls.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No polls found.</div>
        ) : (
          <div>
            {polls.map((poll, index) => (
              <div key={poll.id} className={index > 0 ? 'border-t border-gray-200' : ''}>
                <Link
                  href={`/poll/${poll.slug}`}
                  className="block hover:bg-gray-50 transition-colors"
                >
                  <div className="px-3 sm:px-6 py-3">
                    <div className="flex items-center justify-between gap-2 sm:gap-4">
                      <div className="flex gap-2 sm:gap-4 items-start flex-1 min-w-0">
                        <span className="text-indigo-600 text-xs sm:text-sm shrink-0 pt-0.5 whitespace-nowrap">
                          {timeAgo(poll.createdAt)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-gray-900 font-medium text-sm sm:text-base leading-snug truncate">
                            {poll.question}
                          </h3>
                          {poll.category && (
                            <p className="text-xs text-gray-500 mt-0.5">{poll.category.title}</p>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
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
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            &laquo;
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={!pagination.hasPrevPage}
            className="w-8 h-8 flex items-center justify-center rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
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
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))}
            disabled={!pagination.hasNextPage}
            className="w-8 h-8 flex items-center justify-center rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage(pagination.totalPages)}
            disabled={currentPage === pagination.totalPages}
            className="w-8 h-8 flex items-center justify-center rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            &raquo;
          </button>
        </div>
      )}
    </div>
  )
}
