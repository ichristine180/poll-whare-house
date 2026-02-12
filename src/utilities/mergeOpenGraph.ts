import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description:
    'Create and vote on Yes/No polls about relationships, pets, and life decisions. See live results instantly. Free, no sign-up. Join thousands.',
  images: [
    {
      url: `${getServerSideURL()}/og-image.jpg`,
      width: 1200,
      height: 630,
    },
  ],
  siteName: 'Pollwarehouse',
  title: 'Free Yes or No Poll Maker - Pollwarehouse',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
