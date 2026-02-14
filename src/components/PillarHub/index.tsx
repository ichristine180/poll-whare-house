'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { PollCard } from '@/components/PollCard'
import type { Poll } from '@/payload-types'

const PILLAR_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  belief: { color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200' },
  boundary: { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  desire: { color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' },
  duty: { color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
}

interface PillarHubProps {
  pillar: string
  label: string
  description: string
  polls: Poll[]
  totalPages: number
  totalDocs: number
  currentPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export function PillarHub({
  pillar,
  label,
  description,
  polls,
  totalPages,
  totalDocs,
  currentPage,
  hasNextPage,
  hasPrevPage,
}: PillarHubProps) {
  const router = useRouter()
  const style = PILLAR_STYLES[pillar] || PILLAR_STYLES.belief

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams()
    params.set('page', page.toString())
    router.push(`/pillars/${pillar}?${params.toString()}`)
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
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
    <div className="bg-white">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-gray-700">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-indigo-600">{label}</span>
      </nav>

      {/* Page Title */}
      <div className={`text-center mb-6 p-6 rounded-lg ${style.bg} border ${style.border}`}>
        <div className="inline-flex items-center gap-2 mb-2">
          <svg className={`w-5 h-5 ${style.color}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <h1 className={`text-2xl sm:text-[20px] font-bold ${style.color}`}>
            {label}
          </h1>
        </div>
        <p className="text-gray-600 text-base">
          {description}
        </p>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
        <h2 className="text-lg font-semibold text-gray-900">All Polls</h2>
        <span className="text-sm text-gray-500">{totalDocs} polls</span>
      </div>

      {/* Polls Grid */}
      {polls.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {polls.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className={`w-16 h-16 ${style.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <svg className={`w-8 h-8 ${style.color}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No polls yet</h3>
          <p className="text-gray-500">No {label.toLowerCase()} polls have been published yet.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-6">
          <button onClick={() => handlePageChange(1)} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">&laquo;</button>
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={!hasPrevPage} className="w-8 h-8 flex items-center justify-center rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"><ChevronLeft className="w-4 h-4" /></button>
          {getPageNumbers().map((page, index) =>
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="w-8 h-8 flex items-center justify-center text-gray-500">...</span>
            ) : (
              <button key={page} onClick={() => handlePageChange(page as number)} className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${currentPage === page ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{page}</button>
            ),
          )}
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={!hasNextPage} className="w-8 h-8 flex items-center justify-center rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"><ChevronRight className="w-4 h-4" /></button>
          <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">&raquo;</button>
        </div>
      )}

      {/* Back to home */}
      <div className="text-center pt-4">
        <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium">
          <ChevronLeft className="w-4 h-4" />
          Back to home
        </Link>
      </div>
    </div>
  )
}
