import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import type { Category } from '@/payload-types'
import { InterestHubPage } from '@/components/InterestHubPage'
import { getServerSideURL } from '@/utilities/getURL'
import { publishedPollFilter } from '@/utilities/pollFilters'

const siteUrl = getServerSideURL()

interface PageProps {
  searchParams: Promise<{ page?: string; q?: string }>
}

async function getCategories(page: number = 1, search?: string) {
  const payload = await getPayload({ config: configPromise })

  const where: any = {
    or: [
      { isActive: { equals: true } },
      { isActive: { exists: false } },
    ],
  }
  if (search && search.trim()) {
    where.title = { contains: search.trim() }
  }

  const categories = await payload.find({
    collection: 'categories',
    where,
    limit: 100,
    page: 1,
    depth: 1,
  })

  // Sort by poll count (most polls first)
  const categoriesWithCounts = await Promise.all(
    categories.docs.map(async (category) => {
      const pollCount = await payload.count({
        collection: 'polls',
        where: {
          and: [
            publishedPollFilter(),
            { category: { equals: category.id } },
          ],
        },
      })
      return { ...category, pollCount: pollCount.totalDocs }
    })
  )

  categoriesWithCounts.sort((a, b) => b.pollCount - a.pollCount)

  // Manual pagination after sorting
  const limit = 12
  const start = (page - 1) * limit
  const paginated = categoriesWithCounts.slice(start, start + limit)
  const totalDocs = categoriesWithCounts.length
  const totalPages = Math.ceil(totalDocs / limit)

  return {
    categories: paginated as Category[],
    totalPages,
    totalDocs,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
}

export const metadata: Metadata = {
  title: 'Poll Categories | Browse Yes/No Polls by Topic - Pollwarehouse',
  description:
    'Browse poll categories including relationships, pets, astrology, lifestyle, and more. Vote on yes/no questions and see live results instantly.',
  alternates: {
    canonical: `${siteUrl}/categories`,
  },
  openGraph: {
    title: 'Poll Categories | Browse Yes/No Polls by Topic',
    description:
      'Browse poll categories including relationships, pets, astrology, lifestyle, and more. Vote on yes/no questions and see live results instantly.',
    url: `${siteUrl}/categories`,
    type: 'website',
  },
}

export default async function InterestPage({ searchParams }: PageProps) {
  const { page: pageParam, q: search } = await searchParams
  const page = pageParam ? parseInt(pageParam, 10) : 1

  const { categories, totalPages, totalDocs, currentPage, hasNextPage, hasPrevPage } =
    await getCategories(page, search)

  const categoriesSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Poll Categories',
    description:
      'Browse yes/no polls across relationships, pets, astrology, lifestyle, identity, and more. Vote and see live results from thousands of people.',
    url: `${siteUrl}/categories`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: siteUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Categories',
          item: `${siteUrl}/categories`,
        },
      ],
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: categories.length,
      itemListElement: categories.map((cat, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: cat.title,
      })),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoriesSchema) }}
      />
      <InterestHubPage
        categories={categories}
        totalPages={totalPages}
        totalDocs={totalDocs}
        currentPage={currentPage}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        searchQuery={search || ''}
      />
    </>
  )
}

export const revalidate = 60
