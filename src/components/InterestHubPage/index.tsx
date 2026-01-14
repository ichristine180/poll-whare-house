'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Category, Media } from '@/payload-types'

interface InterestHubPageProps {
  categories: Category[]
  totalPages: number
  totalDocs: number
  currentPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
  searchQuery: string
}

export function InterestHubPage({
  categories,
  totalPages,
  totalDocs,
  currentPage,
  hasNextPage,
  hasPrevPage,
  searchQuery: initialSearch,
}: InterestHubPageProps) {
  const router = useRouter()
  const [search, setSearch] = useState(initialSearch)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search.trim()) {
      params.set('q', search.trim())
    }
    router.push(`/interest?${params.toString()}`)
  }

  const clearSearch = () => {
    setSearch('')
    router.push('/interest')
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams()
    if (initialSearch) {
      params.set('q', initialSearch)
    }
    params.set('page', page.toString())
    router.push(`/interest?${params.toString()}`)
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
    <div className="bg-white">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-indigo-600">Interest Hub</span>
      </nav>

      {/* Page Title */}
      <div className="text-center mb-6">
        <h1 className="text-gray-900 text-2xl sm:text-[20px] font-bold mb-2">
          Explore Topics That Interest You
          <span className="text-indigo-600">!</span>
        </h1>
        <p className="text-gray-600 text-lg sm:text-base">
          Browse polls by category. Discover what people think about various topics.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for a category..."
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-[15px]"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600 hover:text-indigo-700"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Search Results Info */}
      {initialSearch && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-600">
            {totalDocs} result{totalDocs !== 1 ? 's' : ''} for &quot;{initialSearch}&quot;
          </p>
          <button
            onClick={clearSearch}
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">All Categories</h2>
        </div>
        <span className="text-sm text-gray-500">{totalDocs} categories</span>
      </div>

      {/* Categories Grid */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => {
            const categoryImage = category.image as Media | null
            return (
              <Link
                key={category.id}
                href={`/interest/${category.slug}`}
                className="relative aspect-[4/3] rounded-lg overflow-hidden group"
              >
                {categoryImage?.url ? (
                  <Image
                    src={categoryImage.url}
                    alt={category.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600" />
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <span className="text-white font-semibold text-lg text-center">
                    {category.title}
                  </span>
                  {category.description && (
                    <span className="text-white/70 text-xs text-center mt-1 line-clamp-2">
                      {category.description}
                    </span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-500">
            {initialSearch
              ? `No categories matching "${initialSearch}"`
              : 'Categories will appear here once they are created.'}
          </p>
          {initialSearch && (
            <button
              onClick={clearSearch}
              className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View all categories
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-6">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            &laquo;
          </button>

          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPrevPage}
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

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className="w-8 h-8 flex items-center justify-center rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            &raquo;
          </button>
        </div>
      )}
    </div>
  )
}
