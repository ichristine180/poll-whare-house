'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, BarChart3 } from 'lucide-react'

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

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const params = new URLSearchParams({
          page: '1',
          limit: '20',
          sort: '-createdAt',
          status: 'active',
        })

        const response = await fetch(`/api/polls-list?${params}`)
        const result = await response.json()

        if (response.ok) {
          setPolls(result.docs || [])
        }
      } catch (error) {
        console.error('Error fetching polls:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPolls()
  }, [])

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
    </div>
  )
}
