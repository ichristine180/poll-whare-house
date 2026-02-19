import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { publishedPollFilter } from '@/utilities/pollFilters'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { searchParams } = new URL(request.url)
    const excludeId = searchParams.get('exclude')

    // Fetch all active/scheduled polls excluding the current one
    const where: any = {
      ...publishedPollFilter(),
    }

    if (excludeId) {
      where.id = { not_equals: excludeId }
    }

    const polls = await payload.find({
      collection: 'polls',
      where,
      limit: 100,
      depth: 1,
    })

    if (polls.docs.length === 0) {
      return NextResponse.json({ poll: null, message: 'No more polls available' })
    }

    // Select a random poll from the available ones
    const randomIndex = Math.floor(Math.random() * polls.docs.length)
    const randomPoll = polls.docs[randomIndex]

    return NextResponse.json({ poll: randomPoll })
  } catch (error: any) {
    console.error('Error fetching random poll:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch random poll' },
      { status: 500 }
    )
  }
}
