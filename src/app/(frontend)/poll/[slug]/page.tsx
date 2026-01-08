import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { VotePoll } from '@/components/VotePoll'
import type { Metadata } from 'next'
import { getServerSideURL } from '@/utilities/getURL'
import type { Poll } from '@/payload-types'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ voted?: string }>
}

async function getPoll(slug: string): Promise<Poll | null> {
  const payload = await getPayloadHMR({ config: configPromise })

  const result = await payload.find({
    collection: 'polls',
    where: {
      slug: { equals: slug },
    },
    limit: 1,
  })

  return result.docs[0] as Poll | null
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const { voted } = await searchParams
  const poll = await getPoll(slug)

  if (!poll) {
    return {
      title: 'Poll Not Found - PollWarehouse',
    }
  }

  const siteUrl = getServerSideURL()
  // Include voted parameter in OG image URL if present
  const ogImageUrl = voted
    ? `${siteUrl}/api/og/poll?id=${slug}&voted=${encodeURIComponent(voted)}`
    : `${siteUrl}/api/og/poll?id=${slug}`

  const description = voted
    ? `I voted ${voted}. What about you?`
    : poll.description || `Vote on: ${poll.question}`

  return {
    title: `${poll.question} - PollWarehouse`,
    description,
    alternates: {
      canonical: `${siteUrl}/poll/${slug}`,
    },
    openGraph: {
      title: poll.question,
      description,
      url: voted ? `${siteUrl}/poll/${slug}?voted=${encodeURIComponent(voted)}` : `${siteUrl}/poll/${slug}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: poll.question,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: poll.question,
      description,
      images: [ogImageUrl],
    },
  }
}

export default async function PollPage({ params }: PageProps) {
  const { slug } = await params
  const poll = await getPoll(slug)

  if (!poll) {
    notFound()
  }

  return <VotePoll poll={poll} />
}

export const revalidate = 30
