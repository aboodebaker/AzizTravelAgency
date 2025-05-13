import React from 'react'

import { Product } from '../../../payload/payload-types'
import { AddToCartButton } from '../../_components/AddToCartButton'
import { Gutter } from '../../_components/Gutter'
import { Media } from '../../_components/Media'
import { Price } from '../../_components/Price'

import classes from './index.module.scss'

export const ProductHero: React.FC<{ product: Product }> = ({ product }) => {
  const { title, categories, meta: { image: metaImage, description } = {} } = product

  return (
    <Gutter className={classes.productHero}>
      {/* Media Section */}
      <div className={classes.mediaWrapper}>
        {!metaImage && <div className={classes.placeholder}>No image</div>}
        {metaImage && typeof metaImage !== 'string' && (
          <Media imgClassName={classes.image} resource={metaImage} fill />
        )}
      </div>

      {/* Product Details */}
      <div className={classes.details}>
        <h3 className={classes.title}>{title}</h3>

        <div className={classes.metaRow}>
          {/* Categories */}
          <div className={classes.categories}>
            {categories?.map((category, index) => {
              if (typeof category === 'object' && category !== null) {
                const name = category.title || 'Untitled category'
                const isLast = index === categories.length - 1

                return (
                  <span key={index} className={classes.category}>
                    {name}
                    {!isLast && <span className={classes.separator}>,&nbsp;</span>}
                  </span>
                )
              }
              return null
            })}
          </div>

          {/* Vertical Divider */}
          <div className={classes.verticalDivider} />

          {/* Stock Status */}
          <p className={classes.stock}>In stock</p>
        </div>

        {/* Price and Description */}
        <div className={classes.infoSection}>
          <div className={classes.actions}>
            <div className={classes.price}>
              <p>${product.price}</p>
            </div>
          </div>

          <div className={classes.description}>
            <h6>Description</h6>
            <p>{product.description}</p>
          </div>
          <div className={classes.benefitsWrapper}>
            {product.benefits.map((benefit, index) => (
              <div key={index} className={classes.benefitItem}>
                <img src="/assets/icons/tick.svg" alt="✓" />
                <span>{benefit.benefit}</span>
              </div>
            ))}
          </div>

          <AddToCartButton product={product} className={classes.addToCartButton} />
        </div>
      </div>
    </Gutter>
  )
}
