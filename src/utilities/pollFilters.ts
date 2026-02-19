import type { Where } from 'payload'

export function publishedPollFilter(): Where {
  return {
    or: [
      { status: { equals: 'active' } },
      {
        and: [
          { status: { equals: 'scheduled' } },
          { publishedAt: { less_than_equal: new Date().toISOString() } },
        ],
      },
    ],
  }
}
