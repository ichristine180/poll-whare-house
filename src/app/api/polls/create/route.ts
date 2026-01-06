import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { rateLimit, getClientIP } from '@/utilities/rateLimit'

// Rate limit config: 5 polls per 15 minutes per IP
const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
}

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const clientIP = getClientIP(request)
    const rateLimitResult = rateLimit(`create-poll:${clientIP}`, RATE_LIMIT_CONFIG)

    if (!rateLimitResult.success) {
      const retryAfter = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
      return NextResponse.json(
        {
          error: 'Too many poll creation requests. Please try again later.',
          retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateLimitResult.resetTime),
          },
        }
      )
    }

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

    return NextResponse.json(poll, {
      status: 201,
      headers: {
        'X-RateLimit-Remaining': String(rateLimitResult.remaining),
        'X-RateLimit-Reset': String(rateLimitResult.resetTime),
      },
    })
  } catch (error: any) {
    console.error('Error creating poll:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create poll' },
      { status: 500 }
    )
  }
}
