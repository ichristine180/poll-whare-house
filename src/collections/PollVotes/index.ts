import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'

export const PollVotes: CollectionConfig = {
  slug: 'poll-votes',
  access: {
    admin: authenticated,
    create: anyone,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['poll', 'optionIndex', 'voterIdentifier', 'createdAt'],
    group: 'Content',
  },
  fields: [
    {
      name: 'poll',
      type: 'relationship',
      relationTo: 'polls',
      required: true,
      admin: {
        description: 'The poll this vote is for',
      },
    },
    {
      name: 'optionIndex',
      type: 'number',
      required: true,
      admin: {
        description: 'Index of the selected option (0-based)',
      },
    },
    {
      name: 'voterIdentifier',
      type: 'text',
      required: true,
      admin: {
        description: 'Anonymous identifier (IP hash or cookie) to prevent duplicate votes',
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      admin: {
        description: 'Browser user agent for analytics',
      },
    },
  ],
  timestamps: true,
}
