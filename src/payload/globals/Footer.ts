import type { GlobalConfig } from 'payload/types'

import link from '../fields/link'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'copyright',
      label: 'Copyright',
      type: 'text',
      required: true,
    },
    {
      name: 'navItems',
      type: 'array',
      maxRows: 6,
      fields: [
        link({
          appearances: false,
        }),
      ],
    },
    {
      name: 'windowSeatTitle',
      type: 'text',
      label: 'Window Seat Section Title',
      defaultValue: 'New views from the Window Seat',
    },
    {
      name: 'windowSeatSubtitle',
      type: 'text',
      label: 'Window Seat Section Subtitle',
      defaultValue: 'Get the latest inspo before you touch down',
    },
    {
      name: 'windowSeatArticles',
      type: 'array',
      label: 'Window Seat Articles',
      minRows: 2,
      maxRows: 4,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}
