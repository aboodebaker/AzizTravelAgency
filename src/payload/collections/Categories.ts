import type { CollectionConfig } from 'payload/types'

const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'place',
      type: 'select', // Select dropdown for predefined options
      options: [
        { label: 'Half', value: 'half' },
        { label: 'Tall', value: 'tall' },
        { label: 'Horizontal', value: 'horizontal' },
        { label: 'Normal', value: 'normal' },
        { label: 'None', value: 'none' },
        { label: 'Hilton Status', value: 'hilton' },
      ],
      required: false, // Optional, per your interface
    },
  ],
}

export default Categories
