/* eslint-disable function-paren-newline */
/* eslint-disable prettier/prettier */
import React from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import type { Category, Page, Product } from '../../../payload/payload-types'
import { staticHome } from '../../../payload/seed/home-static'
import { fetchDoc } from '../../_api/fetchDoc'
import { fetchDocs } from '../../_api/fetchDocs'
import { Blocks } from '../../_components/Blocks'
import Categories from '../../_components/Categories'
import { Gutter } from '../../_components/Gutter'
import { Hero } from '../../_components/Hero'
import HiltonPromo from '../../_components/HiltonPromo'
import { generateMeta } from '../../_utilities/generateMeta'

import classes from './index.module.scss'

// Payload Cloud caches all files through Cloudflare, so we don't need Next.js to cache them as well
// This means that we can turn off Next.js data caching and instead rely solely on the Cloudflare CDN
// To do this, we include the `no-cache` header on the fetch requests used to get the data for this page
// But we also need to force Next.js to dynamically render this page on each request for preview mode to work
// See https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic
// If you are not using Payload Cloud then this line can be removed, see `../../../README.md#cache`
export const dynamic = 'force-dynamic'

export default async function Page({ params: { slug = 'home' } }) {
  const { isEnabled: isDraftMode } = draftMode()

  let page: Page | null = null

  let catergories: Category[] | null = null

  let productsInCategory: Product[] = []

  try {
    page = await fetchDoc<Page>({
      collection: 'pages',
      slug,
      draft: isDraftMode,
    })

    catergories = await fetchDocs<Category>('categories')

    const targetCategorySlug = 'none'
    const targetCategory = catergories.find(cat => cat.place === targetCategorySlug)

    if (!targetCategory) throw new Error('Category not found')

    const allProducts = (await fetchDocs<Product>('products'))
     productsInCategory = allProducts.filter(
      product => product.isPackage === false)

      
  } catch (error) {
    // when deploying this template on Payload Cloud, this page needs to build before the APIs are live
    // so swallow the error here and simply render the page with fallback data where necessary
    // in production you may want to redirect to a 404  page or at least log the error somewhere
    // console.error(error)
  }

  // if no `home` page exists, render a static one using dummy content
  // you should delete this code once you have a home page in the CMS
  // this is really only useful for those who are demoing this template
  if (!page && slug === 'home') {
    page = staticHome
  }

  if (!page) {
    return notFound()
  }
  console.log(productsInCategory)

  const benefits = [
    '100% Points earning Bonus on stays',
    'Space-available room upgrades',
    'Executive lounge access',
    '48-hour room guarantee',
    'Daily F&B Credit or Continental Breakfast',
    'Fifth night free on reward stays',
  ]

  const { hero, layout } = page

  return (
    <React.Fragment>
      {slug === 'home' ? (
        <section>
          <Hero {...hero} />

          <Gutter className={classes.home}>
            <Categories categories={catergories} />
            <HiltonPromo
              benefits={benefits}
              source={'/media/Leonardo_Phoenix_10_A_sleek_highquality_image_of_a_Hilton_Diam_1.jpg'}
              title={'Diamond Tier Benefits'}
              href="https://www.hilton.com/en/hilton-honors/elite-status/diamond/"
              product={productsInCategory[0]}
            />
            <HiltonPromo
              benefits={benefits}
              source={'/media/Leonardo_Phoenix_10_A_sleek_highquality_image_of_a_Hilton_Gold_2.jpg'}
              title={'Gold Tier Benefits'}
              href="https://www.hilton.com/en/hilton-honors/elite-status/gold/"
              product={productsInCategory[1]}
            />
          </Gutter>
        </section>
      ) : (
        <>
          <Hero {...hero} />
          <Blocks
            blocks={layout}
            disableTopPadding={!hero || hero?.type === 'none' || hero?.type === 'lowImpact'}
          />
        </>
      )}
    </React.Fragment>
  )
}

export async function generateStaticParams() {
  try {
    const pages = await fetchDocs<Page>('pages')
    return pages?.map(({ slug }) => slug)
  } catch (error) {
    return []
  }
}

export async function generateMetadata({ params: { slug = 'home' } }): Promise<Metadata> {
  const { isEnabled: isDraftMode } = draftMode()

  let page: Page | null = null

  try {
    page = await fetchDoc<Page>({
      collection: 'pages',
      slug,
      draft: isDraftMode,
    })
  } catch (error) {
    // don't throw an error if the fetch fails
    // this is so that we can render a static home page for the demo
    // when deploying this template on Payload Cloud, this page needs to build before the APIs are live
    // in production you may want to redirect to a 404  page or at least log the error somewhere
  }

  if (!page && slug === 'home') {
    page = staticHome
  }

  return generateMeta({ doc: page })
}
