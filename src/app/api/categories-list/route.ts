import { NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { publishedPollFilter } from '@/utilities/pollFilters'

export async function GET() {
  try {
    const payload = await getPayloadHMR({ config: configPromise })

    const categories = await payload.find({
      collection: 'categories',
      where: {
        or: [
          { isActive: { equals: true } },
          { isActive: { exists: false } },
        ],
      },
      limit: 100,
      depth: 1,
    })

    // Sort by poll count
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

    return NextResponse.json({
      ...categories,
      docs: categoriesWithCounts,
    })
  } catch (error: any) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
