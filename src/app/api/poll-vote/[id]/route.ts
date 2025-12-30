import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import crypto from 'crypto'

interface RouteParams {
  params: Promise<{ id: string }>
}

function createVoterIdentifier(ip: string, userAgent: string, pollId: string): string {
  return crypto
    .createHash('sha256')
    .update(`${ip}-${userAgent}-${pollId}`)
    .digest('hex')
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const payload = await getPayloadHMR({ config: configPromise })

    // Get the poll
    const poll = await payload.findByID({
      collection: 'polls',
      id,
    })

    if (!poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
    }

    // Create voter identifier from IP and user agent
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const voterIdentifier = createVoterIdentifier(ip, userAgent, id)

    // Check if user has already voted
    const existingVote = await payload.find({
      collection: 'poll-votes',
      where: {
        poll: { equals: id },
        voterIdentifier: { equals: voterIdentifier },
      },
      limit: 1,
    })

    const hasVoted = existingVote.docs.length > 0
    const votedOptionIndex = hasVoted ? existingVote.docs[0].optionIndex : null

    // Calculate results with percentages
    const totalVotes = poll.totalVotes || 0
    const results = poll.options?.map((option) => ({
      text: option.text,
      votes: option.votes || 0,
      percentage: totalVotes > 0 ? Math.round(((option.votes || 0) / totalVotes) * 100) : 0,
    })) || []

    return NextResponse.json({
      hasVoted,
      votedOptionIndex,
      results,
      totalVotes,
    })
  } catch (error: any) {
    console.error('Error checking vote status:', error)
    return NextResponse.json({ error: error.message || 'Failed to check vote status' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const payload = await getPayloadHMR({ config: configPromise })
    const body = await request.json()
    const { optionIndex } = body

    if (typeof optionIndex !== 'number') {
      return NextResponse.json({ error: 'Option index is required' }, { status: 400 })
    }

    // Get the poll
    const poll = await payload.findByID({
      collection: 'polls',
      id,
    })

    if (!poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
    }

    if (poll.status !== 'active') {
      return NextResponse.json({ error: 'Poll is not active' }, { status: 400 })
    }

    if (!poll.options || optionIndex < 0 || optionIndex >= poll.options.length) {
      return NextResponse.json({ error: 'Invalid option index' }, { status: 400 })
    }

    // Create voter identifier from IP and user agent
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const voterIdentifier = createVoterIdentifier(ip, userAgent, id)

    // Check if user has already voted
    const existingVote = await payload.find({
      collection: 'poll-votes',
      where: {
        poll: { equals: id },
        voterIdentifier: { equals: voterIdentifier },
      },
      limit: 1,
    })

    if (existingVote.docs.length > 0) {
      return NextResponse.json({ error: 'You have already voted on this poll' }, { status: 400 })
    }

    // Record the vote
    await payload.create({
      collection: 'poll-votes',
      data: {
        poll: id,
        optionIndex,
        voterIdentifier,
        userAgent,
      },
    })

    // Update the poll vote counts
    const updatedOptions = poll.options.map((option, index) => ({
      ...option,
      votes: index === optionIndex ? (option.votes || 0) + 1 : option.votes || 0,
    }))

    const updatedPoll = await payload.update({
      collection: 'polls',
      id,
      data: {
        options: updatedOptions,
        totalVotes: (poll.totalVotes || 0) + 1,
      },
    })

    // Calculate results with percentages
    const newTotalVotes = updatedPoll.totalVotes || 0
    const results = updatedPoll.options?.map((option) => ({
      text: option.text,
      votes: option.votes || 0,
      percentage: newTotalVotes > 0 ? Math.round(((option.votes || 0) / newTotalVotes) * 100) : 0,
    })) || []

    return NextResponse.json({
      success: true,
      results,
      totalVotes: newTotalVotes,
    })
  } catch (error: any) {
    console.error('Error voting:', error)
    return NextResponse.json({ error: error.message || 'Failed to vote' }, { status: 500 })
  }
}
