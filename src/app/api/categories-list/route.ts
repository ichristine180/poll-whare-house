import { NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayloadHMR({ config: configPromise })

    const categories = await payload.find({
      collection: 'categories',
      limit: 12,
      depth: 1,
    })

    return NextResponse.json(categories)
  } catch (error: any) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
