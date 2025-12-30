import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const body = await request.json()

    const { question, options, pollSettings, endDate, status } = body

    if (!question || !options || options.length < 2) {
      return NextResponse.json(
        { error: 'Question and at least 2 options are required' },
        { status: 400 }
      )
    }

    // Create the poll (guest-created via public API)
    const poll = await payload.create({
      collection: 'polls',
      data: {
        question,
        options,
        pollSettings: pollSettings || {},
        endDate: endDate || null,
        status: status || 'active',
        totalVotes: 0,
        publishedAt: new Date().toISOString(),
        source: 'guest',
      },
    })

    return NextResponse.json(poll, { status: 201 })
  } catch (error: any) {
    console.error('Error creating poll:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create poll' },
      { status: 500 }
    )
  }
}
