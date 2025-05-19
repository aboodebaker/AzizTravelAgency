'use client'
import React, { useState } from 'react'
import Image from 'next/image'

import classes from './index.module.scss'

const QuantityPoints = ({ addItemToCart, product, quant }) => {
  const [quantity, setQuantity] = useState(quant)

  const decrementQty = () => {
    const updatedQty = quantity > 100000 ? quantity - 10000 : 100000
    setQuantity(updatedQty)
    addItemToCart({ product, quantity: Number(updatedQty) })
  }

  const incrementQty = () => {
    const updatedQty = quantity < 500000 ? quantity + 10000 : 500000
    setQuantity(updatedQty)
    addItemToCart({ product, quantity: Number(updatedQty) })
  }

  const enterQty = e => {
    const updatedQty = e.target.value
    setQuantity(updatedQty)
    addItemToCart({ product, quantity: Number(updatedQty) })
  }

  return (
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

      <input type="text" className={classes.quantityInput} value={quantity} onChange={enterQty} />

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
  )
}

export default QuantityPoints
