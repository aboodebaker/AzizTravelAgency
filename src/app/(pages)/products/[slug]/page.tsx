import React from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import type { Media, Product } from '../../../../payload/payload-types'
import { Product as ProductType } from '../../../../payload/payload-types'
import { fetchDoc } from '../../../_api/fetchDoc'
import { fetchDocs } from '../../../_api/fetchDocs'
import { Blocks } from '../../../_components/Blocks'
import HiltonPromo from '../../../_components/HiltonPromo'
import { PaywallBlocks } from '../../../_components/PaywallBlocks'
import TravelProductPage from '../../../_components/TravelPage'
import { ProductHero } from '../../../_heros/Product'
import { generateMeta } from '../../../_utilities/generateMeta'

// Force this page to be dynamic so that Next.js does not cache it
// See the note in '../../../[slug]/page.tsx' about this
export interface ProductDetails {
  title?: string | null
  description?: string | null
  isPackage?: boolean | null
  benefits?:
    | {
        benefit: string
        id?: string | null
      }[]
    | null
  diamond?: boolean | null
  price?: number | null
  travelDetails?: {
    travelDates: {
      departureDateExample: string
      returnDateExample: string
      packageDates: {
        firstDate: string
        lastDate: string
      }
      validUntil: string
      flexibility?: {
        beforeDays?: number | null
        afterDays?: number | null
      }
    } | null
    originalPrice?: number | null
    amountSaved?: {
      value?: number | null
    }
    multiCountry?: boolean | null
    visaRequired?: boolean | null
    visaIncluded?: boolean | null
    travelInsuranceIncluded?: boolean | null
    tags?:
      | {
          tag:
            | 'adults_only'
            | 'family'
            | 'sale'
            | 'beach'
            | 'romantic'
            | 'all_inclusive'
            | 'relax'
            | 'adventure'
            | 'city'
          id?: string | null
        }[]
      | null
    transport?:
      | (
          | {
              flightNumber?: string | null
              departureAirport: string
              arrivalAirport: string
              departureTimeExample: string
              arrivalTimeExample: string
              airline?: string | null
              travelTimeHours: number
              transitTimeHours?: number | null
              baggageAllowance?: {
                checkedInKg?: number | null
                cabinKg?: number | null
                bagNumber?: number | null
              }
              id?: string | null
              blockName?: string | null
              blockType: 'flight'
            }
          | {
              pickupLocation: string
              dropoffLocation: string
              pickupTimeExample: string
              dropoffTimeExample: string
              travelTimeHours: number
              provider?: string | null
              id?: string | null
              blockName?: string | null
              blockType: 'car'
            }
          | {
              departureStation: string
              arrivalStation: string
              departureTimeExample: string
              arrivalTimeExample: string
              travelTimeHours: number
              trainCompany?: string | null
              id?: string | null
              blockName?: string | null
              blockType: 'train'
            }
          | {
              departurePort: string
              arrivalPort: string
              departureTimeExample: string
              arrivalTimeExample: string
              travelTimeHours: number
              ferryCompany?: string | null
              cabinType?: string | null
              id?: string | null
              blockName?: string | null
              blockType: 'ferry'
            }
        )[]
      | null
    destinations?:
      | {
          city?: string | null
          country?: string | null
          hotels?:
            | {
                name?: string | null
                stars?: number | null
                checkInDateExample?: string | null
                checkOutDateExample?: string | null
                hotelLink?: string | null
                hotelImage?: string | Media | null
                nights?: number | null
                id?: string | null
              }[]
            | null
          id?: string | null
        }[]
      | null
  }
  tag?:
    | 'ADULTS_ONLY'
    | 'FAMILY'
    | 'SALE'
    | 'BEACH'
    | 'ROMANTIC'
    | 'ALL_INCLUSIVE'
    | 'RELAX'
    | 'ADVENTURE'
    | 'CITY'
    | null
  image?: string | Media | null
  slug?: string | null
}

export const dynamic = 'force-dynamic'

export default async function Product({ params: { slug } }) {
  const { isEnabled: isDraftMode } = draftMode()

  let product: Product | null = null
  let ProductDetails: ProductDetails = {}

  try {
    product = await fetchDoc<Product>({
      collection: 'products',
      slug,
      draft: isDraftMode,
    })
  } catch (error) {
    console.error(error) // eslint-disable-line no-console
  }

  if (!product) {
    notFound()
  }

  const { layout, relatedProducts } = product

  if (product.isPackage === true) {
    ProductDetails = {
      title: product.title,
      description: product.description,
      isPackage: product.isPackage,
      benefits: product.benefits,
      diamond: product.diamond,
      price: product.price,
      travelDetails: product.travelDetails,
      tag: product.travelDetails.tags[0].tag.toUpperCase() as ProductDetails['tag'],
      image: product.image,
      slug: product.slug,
    }
  }

  return (
    <React.Fragment>
      {product.isPackage ? (
        <TravelProductPage tripData={ProductDetails} />
      ) : (
        <ProductHero product={product} />
      )}

      {/* <ProductHero product={product} /> */}
      {/* <Blocks blocks={layout} />
      {product?.enablePaywall && <PaywallBlocks productSlug={slug as string} disableTopPadding />}
      <Blocks
        disableTopPadding
        blocks={[
          {
            blockType: 'relatedProducts',
            blockName: 'Related Product',
            relationTo: 'products',
            introContent: [
              {
                type: 'h4',
                children: [
                  {
                    text: 'Related Products',
                  },
                ],
              },
              {
                type: 'p',
                children: [
                  {
                    text: 'The products displayed here are individually selected for this page. Admins can select any number of related products to display here and the layout will adjust accordingly. Alternatively, you could swap this out for the "Archive" block to automatically populate products by category complete with pagination. To manage related posts, ',
                  },
                  {
                    type: 'link',
                    url: `/admin/collections/products/${product.id}`,
                    children: [
                      {
                        text: 'navigate to the admin dashboard',
                      },
                    ],
                  },
                  {
                    text: '.',
                  },
                ],
              },
            ],
            docs: relatedProducts,
          },
        ]}

      /> */}
    </React.Fragment>
  )
}

export async function generateStaticParams() {
  try {
    const products = await fetchDocs<ProductType>('products')
    return products?.map(({ slug }) => slug)
  } catch (error) {
    return []
  }
}

export async function generateMetadata({ params: { slug } }): Promise<Metadata> {
  const { isEnabled: isDraftMode } = draftMode()

  let product: Product | null = null

  try {
    product = await fetchDoc<Product>({
      collection: 'products',
      slug,
      draft: isDraftMode,
    })
  } catch (error) {}

  return generateMeta({ doc: product })
}
