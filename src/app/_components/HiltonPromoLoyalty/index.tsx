import React from 'react'
import Image from 'next/image'

import { Product } from '../../../payload/payload-types'
import { AddToCartButton } from '../AddToCartButton'
import { Button } from '../Button'

import classes from './index.module.scss'

const HiltonPromoLoyalty = ({
  source,
  title,
  benefits,
  href,
  product,
  left,
}: {
  source: string
  title: string
  benefits: string[]
  href: string
  product: Product
  left: 'image' | 'text'
}) => {
  return (
    <div className={classes.hiltonPromo}>
      {left === 'image' ? (
        <div className={classes.card}>
          <div className={classes.imageContainer}>
            <Image
              src={source}
              alt="Hilton Promo"
              width={1200}
              height={800}
              className={classes.image}
            />
          </div>
          <div className={classes.textContainer}>
            <h2>{title}</h2>
            <div className={classes.benefitsWrapper}>
              {benefits.map((benefit, index) => (
                <div key={index} className={classes.benefitItem}>
                  <img src="/assets/icons/tick.svg" alt="✓" />
                  <span>{benefit}</span>
                </div>
              ))}
              <Button label="Learn More" appearance="primary" href={`/products/${product.slug}`} />
            </div>
          </div>
        </div>
      ) : (
        <div className={classes.cardRight}>
          <div className={(classes.imageContainer, classes.imageContainerMobile)}>
            <Image
              src={source}
              alt="Hilton Promo"
              width={1200}
              height={800}
              className={classes.image}
            />
          </div>
          <div className={classes.textContainer}>
            <h2>{title}</h2>
            <div className={classes.benefitsWrapper}>
              {benefits.map((benefit, index) => (
                <div key={index} className={classes.benefitItem}>
                  <img src="/assets/icons/tick.svg" alt="✓" />
                  <span>{benefit}</span>
                </div>
              ))}
              <Button
                label="Learn More"
                appearance="primary"
                invert={true}
                href={`/products/${product.slug}`}
              />
            </div>
          </div>
          <div className={(classes.imageContainer, classes.imageContainerMobile2)}>
            <Image
              src={source}
              alt="Hilton Promo"
              width={1200}
              height={800}
              className={classes.image}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default HiltonPromoLoyalty
