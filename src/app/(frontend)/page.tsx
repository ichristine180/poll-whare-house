import { HomePage } from '@/components/HomePage'
import type { Metadata } from 'next'
import { getServerSideURL } from '@/utilities/getURL'

const siteUrl = getServerSideURL()

export const metadata: Metadata = {
  title: 'PollWarehouse - Create a Yes/No Poll in Seconds',
  description:
    'Create simple, real-time polls anyone can answer - no accounts, no friction.',
  alternates: {
    canonical: `${siteUrl}/`,
  },
  openGraph: {
    title: 'PollWarehouse - Create a Yes/No Poll in Seconds',
    description:
      'Create simple, real-time polls anyone can answer - no accounts, no friction.',
    url: `${siteUrl}/`,
  },
}

export default function Home() {
  return <HomePage />
}

export const revalidate = 60
