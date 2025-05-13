import React from 'react'
import { draftMode } from 'next/headers'

import { Category, Page, Product } from '../../../payload/payload-types'
import { fetchDoc } from '../../_api/fetchDoc'
import { fetchDocs } from '../../_api/fetchDocs'
import { Blocks } from '../../_components/Blocks'
import Filters from '../../_components/Filters'
import { Gutter } from '../../_components/Gutter'
import HiltonPromo from '../../_components/HiltonPromo'
import { HR } from '../../_components/HR'

import classes from './index.module.scss'

const Products = async () => {
  const { isEnabled: isDraftMode } = draftMode()
  let page: Page | null = null
  let categories: Category[] | null = null
  let productsInCategory = []

  try {
    page = await fetchDoc<Page>({
      collection: 'pages',
      slug: 'products',
      draft: isDraftMode,
    })

    categories = await fetchDocs<Category>('categories')
    const allProducts = await fetchDocs<Product>('products')
    productsInCategory = allProducts.filter(product => product.isPackage === false)
  } catch (error) {
    // console.error('Error fetching data:', error)
  }

  const diamondProduct = productsInCategory.find(product => product.diamond === true)
  const goldProduct = productsInCategory.find(product => product.diamond !== true)
  return (
    <div className={classes.container}>
      <Gutter className={classes.gutter}>
        <Filters categories={categories} />
        <Blocks blocks={page.layout} disableTopPadding={true} />
        {diamondProduct && (
          <HiltonPromo
            benefits={diamondProduct?.benefits?.map(b => b?.benefit) || []}
            source={
              diamondProduct?.meta?.image?.filename
                ? `/media/${diamondProduct.meta.image.filename}`
                : '/fallback.jpg'
            }
            title="Diamond Tier Benefits"
            href="https://www.hilton.com/en/hilton-honors/elite-status/diamond/"
            product={diamondProduct}
          />
        )}
        <div style={{ height: '30px' }}></div>

        {goldProduct && (
          <HiltonPromo
            benefits={goldProduct?.benefits?.map(b => b?.benefit) || []}
            source={
              goldProduct?.meta?.image?.filename
                ? `/media/${goldProduct.meta.image.filename}`
                : '/fallback.jpg'
            }
            title="Gold Tier Benefits"
            href="https://www.hilton.com/en/hilton-honors/elite-status/gold/"
            product={goldProduct}
          />
        )}
      </Gutter>
      <HR />
    </div>
  )
}

export default Products
