import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { getServerSideURL } from '@/utilities/getURL'
import type { Poll } from '@/payload-types'
import { TagHub } from '@/components/TagHub'

interface PageProps {
  params: Promise<{ tag: string }>
  searchParams: Promise<{ page?: string }>
}

async function getPollsByTag(tag: string, page: number = 1) {
  const payload = await getPayload({ config: configPromise })
  const decodedTag = decodeURIComponent(tag)

  const result = await payload.find({
    collection: 'polls',
    where: {
      and: [
        { status: { equals: 'active' } },
        { 'tags.tag': { equals: decodedTag } },
      ],
    },
    sort: '-createdAt',
    limit: 12,
    page,
    depth: 1,
  })

  return {
    polls: result.docs as Poll[],
    totalPages: result.totalPages,
    totalDocs: result.totalDocs,
    currentPage: result.page || 1,
    hasNextPage: result.hasNextPage,
    hasPrevPage: result.hasPrevPage,
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  const siteUrl = getServerSideURL()
  const displayTag = decodedTag.charAt(0).toUpperCase() + decodedTag.slice(1)

  return {
    title: `${displayTag} Polls - PollWarehouse`,
    description: `Browse and vote on polls tagged "${displayTag}". See live results instantly on PollWarehouse.`,
    alternates: {
      canonical: `${siteUrl}/tags/${tag}`,
    },
    openGraph: {
      title: `${displayTag} Polls - PollWarehouse`,
      description: `Browse and vote on polls tagged "${displayTag}". See live results instantly.`,
      url: `${siteUrl}/tags/${tag}`,
    },
  }
}

export default async function TagPage({ params, searchParams }: PageProps) {
  const { tag } = await params
  const { page: pageParam } = await searchParams
  const page = pageParam ? parseInt(pageParam, 10) : 1
  const decodedTag = decodeURIComponent(tag)

  const { polls, totalPages, totalDocs, currentPage, hasNextPage, hasPrevPage } =
    await getPollsByTag(tag, page)

  return (
    <TagHub
      tag={decodedTag}
      polls={polls}
      totalPages={totalPages}
      totalDocs={totalDocs}
      currentPage={currentPage}
      hasNextPage={hasNextPage || false}
      hasPrevPage={hasPrevPage || false}
    />
  )
}

export const revalidate = 60
