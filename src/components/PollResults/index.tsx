'use client'

import React from 'react'
import Link from 'next/link'
import { BarChart3, Users, Clock, ArrowLeft } from 'lucide-react'
import type { Poll, Media } from '@/payload-types'

interface PollResultsProps {
  poll: Poll
}

export function PollResults({ poll }: PollResultsProps) {
  const heroImage = poll.heroImage as Media | null

  const calculatePercentage = (votes: number) => {
    const total = poll.totalVotes || 0
    if (total === 0) return 0
    return Math.round((votes / total) * 100)
  }

  const getWinningOption = () => {
    if (!poll.options || poll.options.length === 0) return null
    return poll.options.reduce((prev, current) =>
      (prev.votes || 0) > (current.votes || 0) ? prev : current
    )
  }

  const winningOption = getWinningOption()

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back Link */}
      <Link
        href={`/poll/${poll.slug}`}
        className="flex items-center gap-2 text-[#6D4AF9] hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to poll
      </Link>

      {/* Poll Header */}
      <div className="text-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{poll.question}</h1>
        <p className="text-gray-600">Poll Results</p>
      </div>

      {/* Poll Image */}
      {heroImage?.url && (
        <div className="mb-6 rounded-lg overflow-hidden bg-gray-100 aspect-video">
          <img
            src={heroImage.sizes?.large?.url || heroImage.url}
            alt={poll.question}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <Users className="w-6 h-6 text-[#6D4AF9] mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{poll.totalVotes || 0}</p>
          <p className="text-xs text-gray-500">Total Votes</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <BarChart3 className="w-6 h-6 text-[#6D4AF9] mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{poll.options?.length || 0}</p>
          <p className="text-xs text-gray-500">Options</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <Clock className="w-6 h-6 text-[#6D4AF9] mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 capitalize">{poll.status}</p>
          <p className="text-xs text-gray-500">Status</p>
        </div>
      </div>

      {/* Results Breakdown */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Results Breakdown</h2>
        <div className="space-y-4">
          {poll.options?.map((option, index) => {
            const percentage = calculatePercentage(option.votes || 0)
            const isWinner = winningOption?.text === option.text

            return (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-900">
                    {option.text}
                    {isWinner && poll.totalVotes && poll.totalVotes > 0 && (
                      <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                        Winner
                      </span>
                    )}
                  </span>
                  <span className="text-sm text-gray-500">
                    {option.votes || 0} votes ({percentage}%)
                  </span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      index === 0 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Poll Info */}
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <p>
          <strong>Created:</strong>{' '}
          {new Date(poll.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        {poll.endDate && (
          <p className="mt-1">
            <strong>Ends:</strong>{' '}
            {new Date(poll.endDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        )}
      </div>
    </div>
  )
}
