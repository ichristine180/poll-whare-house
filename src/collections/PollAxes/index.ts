import type { CollectionConfig } from 'payload'
import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

export const PollAxes: CollectionConfig = {
  slug: 'poll-axes',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'createdAt'],
    group: 'Content',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Axis name (e.g., "Belonging vs Independence")',
      },
    },
    {
      name: 'badges',
      type: 'group',
      label: 'Badge Configuration',
      admin: {
        description: 'Configure badges for each vote/intensity combination',
      },
      fields: [
        // YES - Soft
        {
          name: 'yesSoft',
          type: 'group',
          label: 'YES - Soft',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: {
                description: 'Badge title for YES with soft intensity',
              },
            },
            {
              name: 'subtext',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Badge subtext/description',
              },
            },
          ],
        },
        // YES - Strong
        {
          name: 'yesStrong',
          type: 'group',
          label: 'YES - Strong',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: {
                description: 'Badge title for YES with strong intensity',
              },
            },
            {
              name: 'subtext',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Badge subtext/description',
              },
            },
          ],
        },
        // NO - Soft
        {
          name: 'noSoft',
          type: 'group',
          label: 'NO - Soft',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: {
                description: 'Badge title for NO with soft intensity',
              },
            },
            {
              name: 'subtext',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Badge subtext/description',
              },
            },
          ],
        },
        // NO - Strong
        {
          name: 'noStrong',
          type: 'group',
          label: 'NO - Strong',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: {
                description: 'Badge title for NO with strong intensity',
              },
            },
            {
              name: 'subtext',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Badge subtext/description',
              },
            },
          ],
        },
      ],
    },
  ],
}
