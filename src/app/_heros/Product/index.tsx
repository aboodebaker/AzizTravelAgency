'use client'
import React, { useState } from 'react'
import Image from 'next/image'

import { Product } from '../../../payload/payload-types'
import { AddToCartButton } from '../../_components/AddToCartButton'
import { Gutter } from '../../_components/Gutter'
import { Media } from '../../_components/Media'
import { Price } from '../../_components/Price'

import classes from './index.module.scss'

export const ProductHero: React.FC<{ product: Product; exhangeRate: number }> = ({
  product,
  exhangeRate,
}) => {
  const { title, categories, meta: { image: metaImage, description } = {} } = product

  const isPoints = product.title?.toLowerCase().includes('points')

  const [quantity, setQuantity] = useState(100000)

  const decrementQty = () => {
    const updatedQty = quantity > 100000 ? quantity - 10000 : 100000
    setQuantity(updatedQty)
  }

  const incrementQty = () => {
    const updatedQty = quantity < 500000 ? quantity + 10000 : 500000
    setQuantity(updatedQty)
  }

  const enterQty = e => {
    const updatedQty = e.target.value
    setQuantity(updatedQty)
  }

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
              <p>${isPoints ? `${product.price * 10000} per 10 000 points` : product.price}</p>
              <p>
                R
                {isPoints
                  ? `${Math.round(product.price * 10000 * exhangeRate)} per 10 000 points`
                  : Math.round(product.price * exhangeRate)}
              </p>
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
          {isPoints && (
            <div className={classes.quantity}>
              <div className={classes.quantityBtn} onClick={decrementQty}>
                <Image
                  src={'/assets/icons/minus.svg'}
                  alt="minus"
                  width={24}
                  height={24}
                  className={classes.qtnBt}
                />
              </div>

              <input type="text" className={classes.quantityInput} value={quantity} />

              <div className={classes.quantityBtn} onClick={incrementQty}>
                <Image
                  src={'/assets/icons/plus.svg'}
                  alt="plus"
                  width={24}
                  height={24}
                  className={classes.qtnBt}
                />
              </div>
            </div>
          )}
          <AddToCartButton
            product={product}
            className={classes.addToCartButton}
            quantity={quantity}
          />
        </div>
      </div>
    </Gutter>
  )
}
