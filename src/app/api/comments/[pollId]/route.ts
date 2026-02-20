import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { rateLimit, getClientIP } from '@/utilities/rateLimit'

interface RouteParams {
  params: Promise<{ pollId: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { pollId } = await params
    const payload = await getPayloadHMR({ config: configPromise })

    const comments = await payload.find({
      collection: 'comments',
      where: {
        poll: { equals: pollId },
        approved: { equals: true },
      },
      sort: '-createdAt',
      limit: 50,
    })

    const sanitized = comments.docs.map((doc) => ({
      id: doc.id,
      name: doc.name || 'Anonymous',
      comment: doc.comment,
      createdAt: doc.createdAt,
    }))

    return NextResponse.json({ comments: sanitized })
  } catch (error: any) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { pollId } = await params
    const payload = await getPayloadHMR({ config: configPromise })
    const body = await request.json()

    const { name, email, comment } = body

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Validate comment
    if (!comment || typeof comment !== 'string' || !comment.trim()) {
      return NextResponse.json({ error: 'Comment is required' }, { status: 400 })
    }
    if (comment.trim().length > 500) {
      return NextResponse.json({ error: 'Comment must be 500 characters or less' }, { status: 400 })
    }

    // Rate limit: 5 comments per 10 minutes per IP
    const ip = getClientIP(request)
    const rateLimitResult = rateLimit(`comment:${ip}`, {
      windowMs: 10 * 60 * 1000,
      maxRequests: 5,
    })

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many comments. Please try again later.' },
        { status: 429 },
      )
    }

    // Verify the poll exists
    const poll = await payload.findByID({
      collection: 'polls',
      id: pollId,
    })

    if (!poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
    }

    // Create the comment
    const doc = await payload.create({
      collection: 'comments',
      data: {
        poll: pollId,
        name: name?.trim() || 'Anonymous',
        email: email.trim(),
        comment: comment.trim(),
      },
    })

    return NextResponse.json({
      success: true,
      comment: {
        id: doc.id,
        name: doc.name || 'Anonymous',
        comment: doc.comment,
        createdAt: doc.createdAt,
      },
    })
  } catch (error: any) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}
