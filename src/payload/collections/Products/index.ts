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
              name: 'price',
              type: 'number',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              admin: {
                rows: 5,
              },
            },
            {
              name: 'isPackage',
              label: 'Is a Package?',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'benefits',
              label: 'Benefits (for hilton Promo or the package)',
              type: 'array',
              required: true,
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
              name: 'image',
              label: 'Header Image',
              type: 'upload',
              relationTo: 'media',
              required: true,
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
                      name: 'departureDateExample',
                      type: 'date',
                      required: true,
                      admin: {
                        date: {
                          pickerAppearance: 'dayAndTime', // optional: improves UI
                        },
                        // time: true,
                      },
                    },
                    {
                      name: 'returnDateExample',
                      type: 'date',
                      required: true,
                      admin: {
                        date: {
                          pickerAppearance: 'dayAndTime', // optional: improves UI
                        },
                        // time: true,
                      },
                    },
                    {
                      name: 'packageDates',
                      label: 'Package Dates between what dates does this package apply to leave',
                      type: 'group',
                      fields: [
                        {
                          name: 'firstDate',
                          type: 'date',
                          required: true,
                        },
                        {
                          name: 'lastDate',
                          label: 'Last Date Of Depature',
                          type: 'date',
                          required: true,
                        },
                      ],
                    },
                    {
                      name: 'validUntil',
                      label: 'When Is the last day of booking',
                      type: 'date',
                      required: true,
                    },
                    {
                      name: 'flexibility',
                      type: 'group',
                      admin: { condition: (_, siblingData) => siblingData?.isPackage === true },
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
                  name: 'tags',
                  type: 'array',
                  fields: [
                    {
                      name: 'tag',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'Adults Only', value: 'adults_only' },
                        { label: 'Family & Kids', value: 'family' },
                        { label: 'On Sale', value: 'sale' },
                        { label: 'Beach', value: 'beach' },
                        { label: 'Romantic & Honeymoon', value: 'romantic' },
                        { label: 'All Inclusive', value: 'all_inclusive' },
                        { label: 'Relax & Recharge', value: 'relax' },
                        { label: 'Adventure', value: 'adventure' },
                        { label: 'City Break', value: 'city' },
                      ],
                    },
                  ],
                },
                {
                  name: 'transport',
                  type: 'blocks',
                  blocks: [
                    {
                      slug: 'flight',
                      labels: {
                        singular: 'Flight',
                        plural: 'Flights',
                      },
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
                          name: 'departureTimeExample',
                          type: 'date',
                          required: true,
                          admin: {
                            date: {
                              pickerAppearance: 'dayAndTime', // optional: improves UI
                            },
                            // time: true,
                          },
                        },
                        {
                          name: 'arrivalTimeExample',
                          type: 'date',
                          required: true,
                          admin: {
                            date: {
                              pickerAppearance: 'dayAndTime', // optional: improves UI
                            },
                            // time: true,
                          },
                        },
                        {
                          name: 'airline',
                          type: 'text',
                        },
                        {
                          name: 'travelTimeHours',
                          type: 'number',
                          required: true,
                        },
                        {
                          name: 'transitTimeHours',
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
                      slug: 'car',
                      labels: {
                        singular: 'Car Ride',
                        plural: 'Car Rides',
                      },
                      fields: [
                        {
                          name: 'pickupLocation',
                          type: 'text',
                          required: true,
                        },
                        {
                          name: 'dropoffLocation',
                          type: 'text',
                          required: true,
                        },
                        {
                          name: 'pickupTimeExample',
                          type: 'date',
                          required: true,
                          admin: {
                            date: {
                              pickerAppearance: 'dayAndTime', // optional: improves UI
                            },
                            // time: true,
                          },
                        },
                        {
                          name: 'dropoffTimeExample',
                          type: 'date',
                          required: true,
                          admin: {
                            date: {
                              pickerAppearance: 'dayAndTime', // optional: improves UI
                            },
                            // time: true,
                          },
                        },
                        {
                          name: 'travelTimeHours',
                          type: 'number',
                          required: true,
                        },
                        {
                          name: 'provider',
                          type: 'text',
                        },
                      ],
                    },
                    {
                      slug: 'train',
                      labels: {
                        singular: 'Train Ride',
                        plural: 'Train Rides',
                      },
                      fields: [
                        {
                          name: 'departureStation',
                          type: 'text',
                          required: true,
                        },
                        {
                          name: 'arrivalStation',
                          type: 'text',
                          required: true,
                        },
                        {
                          name: 'departureTimeExample',
                          type: 'date',
                          required: true,
                          admin: {
                            date: {
                              pickerAppearance: 'dayAndTime', // optional: improves UI
                            },
                            // time: true,
                          },
                        },
                        {
                          name: 'arrivalTimeExample',
                          type: 'date',
                          required: true,
                          admin: {
                            date: {
                              pickerAppearance: 'dayAndTime', // optional: improves UI
                            },
                            // time: true,
                          },
                        },
                        {
                          name: 'travelTimeHours',
                          type: 'number',
                          required: true,
                        },
                        {
                          name: 'trainCompany',
                          type: 'text',
                        },
                      ],
                    },
                    {
                      slug: 'ferry',
                      labels: {
                        singular: 'Ferry Ride',
                        plural: 'Ferry Rides',
                      },
                      fields: [
                        {
                          name: 'departurePort',
                          type: 'text',
                          required: true,
                        },
                        {
                          name: 'arrivalPort',
                          type: 'text',
                          required: true,
                        },
                        {
                          name: 'departureTimeExample',
                          type: 'date',
                          required: true,
                          admin: {
                            date: {
                              pickerAppearance: 'dayAndTime', // optional: improves UI
                            },
                            // time: true,
                          },
                        },
                        {
                          name: 'arrivalTimeExample',
                          type: 'date',
                          required: true,
                          admin: {
                            date: {
                              pickerAppearance: 'dayAndTime', // optional: improves UI
                            },
                            // time: true,
                          },
                        },
                        {
                          name: 'travelTimeHours',
                          type: 'number',
                          required: true,
                        },
                        {
                          name: 'ferryCompany',
                          type: 'text',
                        },
                        {
                          name: 'cabinType',
                          type: 'text',
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
                        {
                          name: 'checkInDateExample',
                          type: 'date',
                          admin: {
                            date: {
                              pickerAppearance: 'dayAndTime', // optional: improves UI
                            },
                            // time: true,
                          },
                        },
                        {
                          name: 'checkOutDateExample',
                          type: 'date',
                          admin: {
                            date: {
                              pickerAppearance: 'dayAndTime', // optional: improves UI
                            },
                            // time: true,
                          },
                        },
                        {
                          name: 'hotelLink',
                          type: 'text',
                        },
                        {
                          name: 'hotelImage',
                          type: 'upload',
                          relationTo: 'media',
                        },
                        {
                          name: 'nights',
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
