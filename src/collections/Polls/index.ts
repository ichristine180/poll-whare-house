import type { CollectionConfig } from 'payload'
import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { slugField } from '@/fields/slug'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Polls: CollectionConfig = {
  slug: 'polls',
  access: {
    admin: authenticated,
    create: anyone, // Allow anyone to create polls
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'source', 'status', 'totalVotes', 'createdAt'],
    group: 'Content',
    components: {
      beforeList: ['@/collections/Polls/PollsListTabs'],
    },
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      admin: {
        description: 'The poll question (e.g., "Do you support this policy?")',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Featured image for the poll (optional)',
      },
    },
    {
      name: 'imageSource',
      type: 'text',
      admin: {
        description: 'Source/credit for the hero image (e.g., "Photo by John Doe")',
        condition: (data) => Boolean(data?.heroImage),
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional description shown with the poll',
      },
    },
    {
      name: 'contentBlocks',
      type: 'array',
      label: 'Content Blocks',
      maxRows: 4,
      admin: {
        description: 'Add up to 4 content blocks with title and content (displayed before voting options)',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Block title (e.g., "Context", "The Tension")',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optional image for this block (displayed below the title)',
          },
        },
        {
          name: 'content',
          type: 'textarea',
          admin: {
            description: 'Block content (displayed below the image, optional)',
          },
        },
      ],
    },
    {
      name: 'options',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 10,
      defaultValue: [
        { text: 'Yes', votes: 0 },
        { text: 'No', votes: 0 },
      ],
      admin: {
        description: 'Poll options (minimum 2, maximum 10)',
        components: {
          RowLabel: '@/collections/Polls/OptionRowLabel',
        },
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          admin: {
            description: 'Option text (e.g., "Yes", "No", "Maybe")',
          },
        },
        {
          name: 'votes',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
            description: 'Number of votes for this option',
          },
        },
      ],
    },
    {
      name: 'totalVotes',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Total number of votes',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        position: 'sidebar',
        description: 'Category this poll belongs to',
      },
    },
    {
      name: 'pillar',
      type: 'select',
      options: [
        { label: 'Belief', value: 'belief' },
        { label: 'Boundary', value: 'boundary' },
        { label: 'Desire', value: 'desire' },
        { label: 'Duty', value: 'duty' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Content pillar this poll belongs to',
      },
    },
    {
      name: 'pollAxis',
      type: 'relationship',
      relationTo: 'poll-axes',
      admin: {
        position: 'sidebar',
        description: 'Badge axis for this poll (determines badge titles/subtexts based on vote)',
      },
    },
    {
      name: 'tags',
      type: 'array',
      admin: {
        description: 'Tags for the poll',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Closed', value: 'closed' },
        { label: 'Draft', value: 'draft' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Poll status',
      },
    },
    // Poll Options (settings)
    {
      name: 'pollSettings',
      type: 'group',
      label: 'Poll Settings',
      admin: {
        description: 'Configure poll behavior',
      },
      fields: [
        {
          name: 'loginToVote',
          type: 'checkbox',
          defaultValue: false,
          label: 'Login to Vote',
          admin: {
            description: 'Require users to login before voting',
          },
        },
        {
          name: 'addComments',
          type: 'checkbox',
          defaultValue: false,
          label: 'Add Comments',
          admin: {
            description: 'Allow users to add comments',
          },
        },
        {
          name: 'enableCaptcha',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enable Captcha',
          admin: {
            description: 'Enable captcha verification',
          },
        },
        {
          name: 'hideShareOptions',
          type: 'checkbox',
          defaultValue: false,
          label: 'Hide Share Options',
          admin: {
            description: 'Hide social sharing options',
          },
        },
        {
          name: 'hidePollResults',
          type: 'checkbox',
          defaultValue: false,
          label: 'Hide Poll Results',
          admin: {
            description: 'Hide results until poll is closed',
          },
        },
      ],
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'When the poll will close (optional)',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'When the poll was published',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData.status === 'active' && !value) {
              return new Date()
            }
            // Auto-set status to scheduled if publishedAt is in the future
            if (value && new Date(value) > new Date()) {
              siblingData.status = 'scheduled'
            }
            return value
          },
        ],
      },
      validate: (value, { siblingData }) => {
        if ((siblingData as any)?.status === 'scheduled' && !value) {
          return 'publishedAt is required when status is Scheduled'
        }
        return true
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Feature this poll on homepage',
      },
    },
    {
      name: 'popular',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Mark this poll as popular',
      },
    },
    {
      name: 'creatorEmail',
      type: 'email',
      admin: {
        position: 'sidebar',
        description: 'Email to notify when poll reaches 10 votes',
      },
    },
    {
      name: 'statsEmailSent',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Whether the 10-vote stats email has been sent',
      },
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'admin',
      index: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Guest', value: 'guest' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Who created this poll',
      },
    },
    {
      name: 'meta',
      label: 'SEO',
      type: 'group',
      fields: [
        OverviewField({
          titlePath: 'meta.title',
          descriptionPath: 'meta.description',
          imagePath: 'meta.image',
        }),
        MetaTitleField({
          hasGenerateFn: true,
        }),
        MetaImageField({
          relationTo: 'media',
        }),
        MetaDescriptionField({}),
        PreviewField({
          hasGenerateFn: true,
          titlePath: 'meta.title',
          descriptionPath: 'meta.description',
        }),
      ],
    },
    ...slugField('question'),
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Calculate total votes from options
        if (data.options && Array.isArray(data.options)) {
          data.totalVotes = data.options.reduce((sum: number, option: any) => {
            return sum + (option.votes || 0)
          }, 0)
        }
        return data
      },
    ],
  },
}
