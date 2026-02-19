import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { publishedPollFilter } from '@/utilities/pollFilters'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { searchParams } = new URL(request.url)

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sort = searchParams.get('sort') || '-createdAt'
    const status = searchParams.get('status') || 'active'
    const category = searchParams.get('category')

    const where: any = status === 'active'
      ? { ...publishedPollFilter() }
      : { status: { equals: status } }

    if (category) {
      where.category = { equals: category }
    }

    const polls = await payload.find({
      collection: 'polls',
      where,
      sort,
      page,
      limit,
      depth: 1,
    })

    return NextResponse.json(polls)
  } catch (error: any) {
    console.error('Error fetching polls:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch polls' }, { status: 500 })
  }
}
