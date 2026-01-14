import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import type { Category } from '@/payload-types'
import { InterestHubPage } from '@/components/InterestHubPage'

interface PageProps {
  searchParams: Promise<{ page?: string; q?: string }>
}

async function getCategories(page: number = 1, search?: string) {
  const payload = await getPayload({ config: configPromise })

  const where: any = {}
  if (search && search.trim()) {
    where.title = { contains: search.trim() }
  }

  const categories = await payload.find({
    collection: 'categories',
    where,
    limit: 12,
    page,
    depth: 1,
  })

  return {
    categories: categories.docs as Category[],
    totalPages: categories.totalPages,
    totalDocs: categories.totalDocs,
    currentPage: categories.page || 1,
    hasNextPage: categories.hasNextPage,
    hasPrevPage: categories.hasPrevPage,
  }
}

export const metadata: Metadata = {
  title: 'Interest Hub - PollWarehouse',
  description: 'Browse polls by category. Explore topics that interest you.',
}

export default async function InterestPage({ searchParams }: PageProps) {
  const { page: pageParam, q: search } = await searchParams
  const page = pageParam ? parseInt(pageParam, 10) : 1

  const { categories, totalPages, totalDocs, currentPage, hasNextPage, hasPrevPage } =
    await getCategories(page, search)

  return (
    <InterestHubPage
      categories={categories}
      totalPages={totalPages}
      totalDocs={totalDocs}
      currentPage={currentPage}
      hasNextPage={hasNextPage}
      hasPrevPage={hasPrevPage}
      searchQuery={search || ''}
    />
  )
}

export const revalidate = 60
