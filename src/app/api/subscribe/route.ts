import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, source } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config: configPromise })

    // Check if email already exists
    const existing = await payload.find({
      collection: 'subscribers',
      where: {
        email: { equals: email.toLowerCase().trim() },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'You are already subscribed!',
      })
    }

    // Create new subscriber
    await payload.create({
      collection: 'subscribers',
      data: {
        email: email.toLowerCase().trim(),
        source: source || 'website',
        isActive: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed! Thank you for joining.',
    })
  } catch (error: any) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    )
  }
}
