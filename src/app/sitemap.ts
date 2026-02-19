import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getServerSideURL } from '@/utilities/getURL'
import { publishedPollFilter } from '@/utilities/pollFilters'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getServerSideURL()
  const payload = await getPayload({ config: configPromise })

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/create`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/subscribe`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Fetch all active polls
  const polls = await payload.find({
    collection: 'polls',
    where: publishedPollFilter(),
    limit: 10000,
    depth: 0,
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  const pollPages: MetadataRoute.Sitemap = polls.docs.map((poll) => ({
    url: `${siteUrl}/poll/${poll.slug}`,
    lastModified: new Date(poll.updatedAt),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  // Fetch all categories
  const categories = await payload.find({
    collection: 'categories',
    where: {
      or: [
        { isActive: { equals: true } },
        { isActive: { exists: false } },
      ],
    },
    limit: 1000,
    depth: 0,
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  const categoryPages: MetadataRoute.Sitemap = categories.docs.map((cat) => ({
    url: `${siteUrl}/categories/${cat.slug}`,
    lastModified: new Date(cat.updatedAt),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  // Collect unique tags from polls
  const allPolls = await payload.find({
    collection: 'polls',
    where: publishedPollFilter(),
    limit: 10000,
    depth: 0,
    select: {
      tags: true,
    },
  })

  const uniqueTags = new Set<string>()
  allPolls.docs.forEach((poll) => {
    poll.tags?.forEach((t) => {
      if (t.tag) uniqueTags.add(t.tag.toLowerCase().trim())
    })
  })

  const tagPages: MetadataRoute.Sitemap = Array.from(uniqueTags).map((tag) => ({
    url: `${siteUrl}/tags/${encodeURIComponent(tag)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...pollPages, ...categoryPages, ...tagPages]
}
