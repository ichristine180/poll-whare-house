import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getServerSideURL } from '@/utilities/getURL'
import type { Poll } from '@/payload-types'
import { PillarHub } from '@/components/PillarHub'

const PILLARS: Record<string, { label: string; description: string }> = {
  belief: {
    label: 'Belief',
    description: 'Polls exploring what people believe in — values, faith, convictions, and worldviews.',
  },
  boundary: {
    label: 'Boundary',
    description: 'Polls about personal limits — where you draw the line in relationships, work, and life.',
  },
  desire: {
    label: 'Desire',
    description: 'Polls about wants, ambitions, and what people truly wish for.',
  },
  duty: {
    label: 'Duty',
    description: 'Polls about responsibility, obligation, and doing what you feel you must.',
  },
}

interface PageProps {
  params: Promise<{ pillar: string }>
  searchParams: Promise<{ page?: string }>
}

async function getPollsByPillar(pillar: string, page: number = 1) {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'polls',
    where: {
      and: [
        { status: { equals: 'active' } },
        { pillar: { equals: pillar } },
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
  const { pillar } = await params
  const config = PILLARS[pillar]

  if (!config) {
    return { title: 'Not Found - PollWarehouse' }
  }

  const siteUrl = getServerSideURL()

  return {
    title: `${config.label} Polls - PollWarehouse`,
    description: config.description,
    alternates: {
      canonical: `${siteUrl}/pillars/${pillar}`,
    },
    openGraph: {
      title: `${config.label} Polls - PollWarehouse`,
      description: config.description,
      url: `${siteUrl}/pillars/${pillar}`,
    },
  }
}

export default async function PillarPage({ params, searchParams }: PageProps) {
  const { pillar } = await params
  const config = PILLARS[pillar]

  if (!config) {
    notFound()
  }

  const { page: pageParam } = await searchParams
  const page = pageParam ? parseInt(pageParam, 10) : 1

  const { polls, totalPages, totalDocs, currentPage, hasNextPage, hasPrevPage } =
    await getPollsByPillar(pillar, page)

  return (
    <PillarHub
      pillar={pillar}
      label={config.label}
      description={config.description}
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
