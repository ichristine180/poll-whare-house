import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getServerSideURL } from '@/utilities/getURL'
import type { Poll, Category, Media } from '@/payload-types'
import { InterestHub } from '@/components/InterestHub'
import { publishedPollFilter } from '@/utilities/pollFilters'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ q?: string; page?: string }>
}

async function getCategoryWithPolls(slug: string, search?: string, page: number = 1) {
  const payload = await getPayload({ config: configPromise })

  // Get category
  const categoryResult = await payload.find({
    collection: 'categories',
    where: {
      slug: { equals: slug },
    },
    limit: 1,
    depth: 1,
  })

  const category = categoryResult.docs[0] as Category | undefined

  if (!category) {
    return { category: null, polls: [], totalPages: 0, totalDocs: 0 }
  }

  // Build query for polls
  const where: any = {
    and: [
      publishedPollFilter(),
      { category: { equals: category.id } },
    ],
  }

  // Add search filter if provided
  if (search && search.trim()) {
    where.and.push({ question: { contains: search.trim() } })
  }

  // Get polls in this category
  const pollsResult = await payload.find({
    collection: 'polls',
    where,
    sort: '-createdAt',
    limit: 12,
    page,
    depth: 1,
  })

  return {
    category,
    polls: pollsResult.docs as Poll[],
    totalPages: pollsResult.totalPages,
    totalDocs: pollsResult.totalDocs,
    currentPage: pollsResult.page || 1,
    hasNextPage: pollsResult.hasNextPage,
    hasPrevPage: pollsResult.hasPrevPage,
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const { category } = await getCategoryWithPolls(slug)

  if (!category) {
    return {
      title: 'Category Not Found - PollWarehouse',
    }
  }

  const siteUrl = getServerSideURL()
  const categoryImage = category.image as Media | null

  return {
    title: `${category.title} Polls - PollWarehouse`,
    description: category.description || `Browse and vote on ${category.title} polls`,
    alternates: {
      canonical: `${siteUrl}/categories/${slug}`,
    },
    openGraph: {
      title: `${category.title} Polls - PollWarehouse`,
      description: category.description || `Browse and vote on ${category.title} polls`,
      url: `${siteUrl}/categories/${slug}`,
      images: categoryImage?.url ? [{ url: categoryImage.url }] : undefined,
    },
  }
}

export default async function InterestPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { q: search, page: pageParam } = await searchParams
  const page = pageParam ? parseInt(pageParam, 10) : 1

  const { category, polls, totalPages, totalDocs, currentPage, hasNextPage, hasPrevPage } =
    await getCategoryWithPolls(slug, search, page)

  if (!category) {
    notFound()
  }

  return (
    <InterestHub
      category={category}
      polls={polls}
      totalPages={totalPages}
      totalDocs={totalDocs}
      currentPage={currentPage || 1}
      hasNextPage={hasNextPage || false}
      hasPrevPage={hasPrevPage || false}
      searchQuery={search || ''}
    />
  )
}

export const revalidate = 60
