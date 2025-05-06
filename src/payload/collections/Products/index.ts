import type { CollectionConfig } from 'payload/types'

import { admins } from '../../access/admins'
import { Archive } from '../../blocks/ArchiveBlock'
import { CallToAction } from '../../blocks/CallToAction'
import { Content } from '../../blocks/Content'
import { MediaBlock } from '../../blocks/MediaBlock'
import { slugField } from '../../fields/slug'
import { populateArchiveBlock } from '../../hooks/populateArchiveBlock'
import { checkUserPurchases } from './access/checkUserPurchases'
import { beforeProductChange } from './hooks/beforeChange'
import { deleteProductFromCarts } from './hooks/deleteProductFromCarts'
import { revalidateProduct } from './hooks/revalidateProduct'
import { ProductSelect } from './ui/ProductSelect'

const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'stripeProductID', '_status'],
    preview: doc => {
      return `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/preview?url=${encodeURIComponent(
        `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/products/${doc.slug}`,
      )}&secret=${process.env.PAYLOAD_PUBLIC_DRAFT_SECRET}`
    },
  },
  hooks: {
    beforeChange: [beforeProductChange],
    afterChange: [revalidateProduct],
    afterRead: [populateArchiveBlock],
    afterDelete: [deleteProductFromCarts],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: () => true,
    create: admins,
    update: admins,
    delete: admins,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'publishedOn',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              required: true,
              blocks: [CallToAction, Content, MediaBlock, Archive],
            },
            {
              name: 'isPackage',
              label: 'Is a Package?',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'benefits',
              label: 'Benefits (for hilton Promo)',
              type: 'array',
              admin: {
                condition: (_, siblingData) => siblingData?.isPackage === false, // Only shows if it's NOT a package
              },
              fields: [
                {
                  name: 'benefit',
                  type: 'text',
                  required: true, // Ensures that each benefit is a string
                },
              ],
            },
            {
              name: 'diamond',
              label: 'Diamond (for hilton Promo)',
              type: 'checkbox',
              admin: {
                condition: (_, siblingData) => siblingData?.isPackage === false, // Only shows if it's NOT a package
              },
            },
            {
              name: 'travelDetails',
              label: 'Travel Details',
              type: 'group',
              admin: {
                condition: (_, siblingData) => siblingData?.isPackage === true,
              },
              fields: [
                {
                  name: 'travelDates',
                  type: 'group',
                  fields: [
                    {
                      name: 'departureDate',
                      type: 'date',
                      required: true,
                    },
                    {
                      name: 'returnDate',
                      type: 'date',
                      required: true,
                    },
                    {
                      name: 'flexibility',
                      type: 'group',
                      fields: [
                        {
                          name: 'beforeDays',
                          type: 'number',
                        },
                        {
                          name: 'afterDays',
                          type: 'number',
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'originalPrice',
                  type: 'number',
                },
                {
                  name: 'amountSaved',
                  type: 'group',
                  fields: [
                    {
                      name: 'value',
                      type: 'number',
                    },
                  ],
                },
                {
                  name: 'multiCountry',
                  type: 'checkbox',
                },
                {
                  name: 'visaRequired',
                  type: 'checkbox',
                },
                {
                  name: 'visaIncluded',
                  type: 'checkbox',
                },
                {
                  name: 'travelInsuranceIncluded',
                  type: 'checkbox',
                },
                {
                  name: 'flights',
                  type: 'array',
                  fields: [
                    {
                      name: 'flightNumber',
                      type: 'text',
                    },
                    {
                      name: 'departureAirport',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'arrivalAirport',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'departureTime',
                      type: 'date',
                      required: true,
                    },
                    {
                      name: 'arrivalTime',
                      type: 'date',
                      required: true,
                    },
                    {
                      name: 'airline',
                      type: 'text',
                    },
                    {
                      name: 'travelTimeMinutes',
                      type: 'number',
                      required: true,
                    },
                    {
                      name: 'transitTimeMinutes',
                      type: 'number',
                    },
                    {
                      name: 'baggageAllowance',
                      type: 'group',
                      fields: [
                        {
                          name: 'checkedInKg',
                          type: 'number',
                        },
                        {
                          name: 'cabinKg',
                          type: 'number',
                        },
                        {
                          name: 'bagNumber',
                          type: 'number',
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'destinations',
                  type: 'array',
                  fields: [
                    {
                      name: 'city',
                      type: 'text',
                    },
                    {
                      name: 'country',
                      type: 'text',
                    },
                    {
                      name: 'hotels',
                      type: 'array',
                      fields: [
                        {
                          name: 'name',
                          type: 'text',
                        },
                        {
                          name: 'stars',
                          type: 'number',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Product Details',
          fields: [
            {
              name: 'stripeProductID',
              label: 'Stripe Product',
              type: 'text',
              admin: {
                components: {
                  Field: ProductSelect,
                },
              },
            },
            {
              name: 'priceJSON',
              label: 'Price JSON',
              type: 'textarea',
              admin: {
                readOnly: true,
                hidden: true,
                rows: 10,
              },
            },
            {
              name: 'enablePaywall',
              label: 'Enable Paywall',
              type: 'checkbox',
            },
            {
              name: 'paywall',
              label: 'Paywall',
              type: 'blocks',
              access: {
                read: checkUserPurchases,
              },
              blocks: [CallToAction, Content, MediaBlock, Archive],
            },
          ],
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      filterOptions: ({ id }) => {
        return {
          id: {
            not_in: [id],
          },
        }
      },
    },
    slugField(),
    {
      name: 'skipSync',
      label: 'Skip Sync',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
        readOnly: true,
        hidden: true,
      },
    },
  ],
}

export default Products
