import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { PollResults } from '@/components/PollResults'
import type { Metadata } from 'next'
import { getServerSideURL } from '@/utilities/getURL'
import type { Poll } from '@/payload-types'

interface PageProps {
  params: Promise<{ slug: string }>
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const poll = await getPoll(slug)

  if (!poll) {
    return {
      title: 'Results Not Found - PollWarehouse',
    }
  }

  const siteUrl = getServerSideURL()

  return {
    title: `Results: ${poll.question} - PollWarehouse`,
    description: `See the results for: ${poll.question}`,
    alternates: {
      canonical: `${siteUrl}/results/${slug}`,
    },
  }
}

export default async function ResultsPage({ params }: PageProps) {
  const { slug } = await params
  const poll = await getPoll(slug)

  if (!poll) {
    notFound()
  }

  return <PollResults poll={poll} />
}

export const revalidate = 30
