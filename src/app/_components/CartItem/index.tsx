'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Media } from '../Media'
import { Price } from '../Price'
import { RemoveFromCartButton } from '../RemoveFromCartButton'
import QuantityPoints from './QuantityPoints'

import classes from './index.module.scss'

const CartItem = ({ product, title, metaImage, qty, addItemToCart, q }) => {
  const [quantity, setQuantity] = useState(qty)
  const decrementQty = () => {
    const updatedQty = quantity > 1 ? quantity - 1 : 1
    setQuantity(updatedQty)
    addItemToCart({ product, quantity: Number(updatedQty) })
  }
  const incrementQty = () => {
    const updatedQty = quantity + 1
    setQuantity(updatedQty)
    addItemToCart({ product, quantity: Number(updatedQty) })
  }
  const enterQty = e => {
    const updatedQty = e.target.value
    setQuantity(updatedQty)
    addItemToCart({ product, quantity: Number(updatedQty) })
  }

  const addingItemToCart = ({ product, quantity }) => {
    addItemToCart({ product, quantity })
  }

  return (
    <li className={classes.item} key={title}>
      <Link href={`/product/${product.slug}`} className={classes.mediaWrapper}>
        {!metaImage && <span>No Image</span>}
        {metaImage && typeof metaImage !== 'string' && (
          <Media className={classes.media} imgClassName={classes.image} resource={metaImage} fill />
        )}
      </Link>
      <div className={classes.itemDetails}>
        <div className={classes.titleWrapper}>
          <h6>{title}</h6>
          <Price product={product} button={false} quantity={1} />
        </div>

        {q ? (
          <QuantityPoints addItemToCart={addingItemToCart} product={product} quant={qty} />
        ) : (
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

            <input
              type="text"
              className={classes.quantityInput}
              value={quantity}
              onChange={enterQty}
            />

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

        <div className={classes.subtotalWrapper}>
          <p>
            Subtotal:
            <Price product={product} button={false} quantity={quantity} />
          </p>
          <RemoveFromCartButton product={product} />
        </div>
      </div>
    </li>
  )
}

export default CartItem
