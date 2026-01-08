'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, ChevronRight, ChevronLeft, TrendingUp } from 'lucide-react'
import { PollCard } from '@/components/PollCard'
import type { Poll, Category, Media } from '@/payload-types'

interface InterestHubProps {
  category: Category
  polls: Poll[]
  totalPages: number
  totalDocs: number
  currentPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
  searchQuery: string
}

export function InterestHub({
  category,
  polls,
  totalPages,
  totalDocs,
  currentPage,
  hasNextPage,
  hasPrevPage,
  searchQuery,
}: InterestHubProps) {
  const router = useRouter()
  const [search, setSearch] = useState(searchQuery)
  const categoryImage = category.image as Media | null

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search.trim()) {
      params.set('q', search.trim())
    }
    router.push(`/interest/${category.slug}?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams()
    if (searchQuery) {
      params.set('q', searchQuery)
    }
    params.set('page', page.toString())
    router.push(`/interest/${category.slug}?${params.toString()}`)
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []

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
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/#interest" className="hover:text-gray-700">
          Interest
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-indigo-600">{category.title}</span>
      </nav>

      {/* Category Header */}
      <div className="relative rounded-xl overflow-hidden">
        {/* Background Image */}
        <div className="relative h-48 md:h-56">
          {categoryImage?.url ? (
            <Image
              src={categoryImage.url}
              alt={category.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600" />
          )}
          <div className="absolute inset-0 bg-black/50" />

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-6 h-6 text-white" />
              <span className="text-white/80 text-sm uppercase tracking-wide">Interest Hub</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{category.title}</h1>
            {category.description && (
              <p className="text-white/80 max-w-lg text-sm md:text-base">{category.description}</p>
            )}
            <p className="text-white/60 text-sm mt-2">{totalDocs} polls</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white border border-gray-200 rounded-lg mx-4 -mt-6 relative z-10 shadow-lg">
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="flex-1 flex items-center px-4">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${category.title} polls...`}
                className="flex-1 px-3 py-3 text-gray-900 placeholder-gray-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors rounded-r-lg"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            {totalDocs} result{totalDocs !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
          </p>
          <button
            onClick={() => {
              setSearch('')
              router.push(`/interest/${category.slug}`)
            }}
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Polls Grid */}
      {polls.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {polls.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No polls found</h3>
          <p className="text-gray-500">
            {searchQuery
              ? `No polls matching "${searchQuery}" in ${category.title}`
              : `No polls in ${category.title} yet`}
          </p>
          {searchQuery && (
            <button
              onClick={() => {
                setSearch('')
                router.push(`/interest/${category.slug}`)
              }}
              className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View all {category.title} polls
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-6">
          {/* First page */}
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            «
          </button>

          {/* Previous */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPrevPage}
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
                onClick={() => handlePageChange(page as number)}
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
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className="w-8 h-8 flex items-center justify-center rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Last page */}
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            »
          </button>
        </div>
      )}

      {/* Back to all categories */}
      <div className="text-center pt-4">
        <Link
          href="/#interest"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to all categories
        </Link>
      </div>
    </div>
  )
}
