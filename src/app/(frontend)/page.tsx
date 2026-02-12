import { HomePage } from '@/components/HomePage'
import type { Metadata } from 'next'
import { getServerSideURL } from '@/utilities/getURL'

const siteUrl = getServerSideURL()

export const metadata: Metadata = {
  title: 'Free Yes or No Poll Maker | Create & Vote on Real Life Polls - Pollwarehouse',
  description:
    'Create and vote on Yes/No polls about relationships, pets, and life decisions. See live results instantly. Free, no sign-up. Join thousands.',
  keywords:
    'yes no poll, poll maker, free poll creator, online voting, relationship polls, pet polls, identity polls, real-time poll results, anonymous voting',
  robots: 'index, follow',
  alternates: {
    canonical: `${siteUrl}/`,
  },
  openGraph: {
    title: 'Free Yes or No Poll Maker - Pollwarehouse',
    description:
      'See how many people feel exactly like you do. Vote Yes or No on real questions about relationships, pets, and life.',
    type: 'website',
    url: `${siteUrl}/`,
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
      },
    ],
  },
}

export default function Home() {
  return <HomePage />
}

export const revalidate = 60
