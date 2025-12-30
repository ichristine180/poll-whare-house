import type { GlobalConfig } from 'payload'
import { revalidateHeader } from '../hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      type: 'group',
      label: 'Logo',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Logo Image',
        },
        {
          name: 'text',
          type: 'text',
          label: 'Logo Text',
          defaultValue: 'PollWarehouse',
          admin: {
            description: 'Alternative text logo (if no image)',
          },
        },
        {
          name: 'url',
          type: 'text',
          label: 'Logo Link URL',
          defaultValue: '/',
        },
      ],
    },
    {
      name: 'navItems',
      type: 'array',
      label: 'Navigation Items',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Menu Label',
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          required: true,
        },
      ],
      maxRows: 8,
      admin: {
        initCollapsed: true,
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
