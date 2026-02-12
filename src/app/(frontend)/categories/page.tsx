import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import type { Category } from '@/payload-types'
import { InterestHubPage } from '@/components/InterestHubPage'
import { getServerSideURL } from '@/utilities/getURL'

const siteUrl = getServerSideURL()

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
