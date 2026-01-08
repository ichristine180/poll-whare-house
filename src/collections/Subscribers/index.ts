import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  access: {
    admin: authenticated,
    create: () => true, // Allow public subscriptions
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'source', 'createdAt'],
    group: 'Content',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'source',
      type: 'text',
      admin: {
        description: 'Where the subscription came from',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this subscriber is active',
      },
    },
  ],
}
