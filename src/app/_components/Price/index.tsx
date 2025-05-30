'use client'

import React, { useEffect, useState } from 'react'

import { Product } from '../../../payload/payload-types'
import { AddToCartButton } from '../AddToCartButton'
import { RemoveFromCartButton } from '../RemoveFromCartButton'

import classes from './index.module.scss'

export const priceFromJSON = (priceJSON: string, quantity: number = 1, raw?: boolean): string => {
  const defaultPriceCents = 50000 // $500 in cents
  let price = ''

  try {
    const parsed = priceJSON ? JSON.parse(priceJSON)?.data[0] : null
    const priceValue = parsed?.unit_amount
      ? parsed.unit_amount * quantity
      : defaultPriceCents * quantity
    const priceType = parsed?.type

    if (raw) return priceValue.toString()

    price = (priceValue / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    })

    if (priceType === 'recurring') {
      price += `/${
        parsed.recurring.interval_count > 1
          ? `${parsed.recurring.interval_count} ${parsed.recurring.interval}`
          : parsed.recurring.interval
      }`
    }
  } catch (e) {
    console.error(`Cannot parse priceJSON`) // eslint-disable-line no-console
    // Fallback to default $500
    const priceValue = defaultPriceCents * quantity
    if (raw) return priceValue.toString()
    price = (priceValue / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    })
  }

  return price
}

export const Price: React.FC<{
  product: Product
  quantity?: number
  button?: 'addToCart' | 'removeFromCart' | false
}> = props => {
  const { product, product: { priceJSON } = {}, button = 'addToCart', quantity } = props

  return (
    <div className={classes.actions}>
      <div className={classes.price}>
        <p>${product.price * quantity}</p>
      </div>
    </div>
  )
}
