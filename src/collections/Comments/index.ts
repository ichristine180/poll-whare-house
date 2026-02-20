import type { CollectionConfig } from 'payload'
import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

export const Comments: CollectionConfig = {
  slug: 'comments',
  access: {
    admin: authenticated,
    create: anyone,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'comment',
    defaultColumns: ['poll', 'name', 'email', 'comment', 'approved', 'createdAt'],
    group: 'Content',
  },
  fields: [
    {
      name: 'poll',
      type: 'relationship',
      relationTo: 'polls',
      required: true,
      admin: {
        description: 'The poll this comment belongs to',
      },
    },
    {
      name: 'name',
      type: 'text',
      defaultValue: 'Anonymous',
      admin: {
        description: 'Display name (defaults to "Anonymous")',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      admin: {
        description: 'Email address (for spam prevention, not shown publicly)',
      },
    },
    {
      name: 'comment',
      type: 'textarea',
      required: true,
      maxLength: 500,
      admin: {
        description: 'The comment text (max 500 characters)',
      },
    },
    {
      name: 'approved',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Whether this comment is approved and visible',
      },
    },
  ],
  timestamps: true,
}
