'use client'

import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { Button } from '../../../_components/Button'
import { Message } from '../../../_components/Message'
import { useCart } from '../../../_providers/Cart'

import classes from './index.module.scss'

export const OrderConfirmationPage: React.FC<{}> = () => {
  const searchParams = useSearchParams()
  const orderID = searchParams.get('order_id')
  const { clearCart } = useCart()
  const [error, setError] = useState<string | null>(null)
  const hasFulfilledRef = useRef(false)

  useEffect(() => {
    clearCart()
  }, [clearCart])

  useEffect(() => {
    const fulfillOrder = async () => {
      if (!orderID || hasFulfilledRef.current) return

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/create-order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: orderID, paymentStatus: 'paid' }),
        })

        if (!res.ok) {
          throw new Error('Failed to update order status')
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err)
        window.location.reload()
        setError('There was an issue updating your order status. Please contact support.')
        // eslint-disable-next-line no-console
        console.error(err)
      }
    }

    fulfillOrder()
  }, [orderID])

  return (
    <div>
      {error ? (
        <Fragment>
          <Message error={error} />
          <p>
            {`Your payment was successful but there was an error processing your order. Please contact us to resolve this issue.`}
          </p>
          <div className={classes.actions}>
            <Button href="/account" label="View account" appearance="primary" />
            <Button
              href={`${process.env.NEXT_PUBLIC_SERVER_URL}/orders`}
              label="View all orders"
              appearance="secondary"
            />
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <h1>Thank you for your order!</h1>
          <p>
            {`Your order has been confirmed. You will receive an email confirmation shortly. Your order ID is ${orderID}.`}
          </p>
          <div className={classes.actions}>
            <Button href={`/orders/${orderID}`} label="View order" appearance="primary" />
            <Button
              href={`${process.env.NEXT_PUBLIC_SERVER_URL}/orders`}
              label="View all orders"
              appearance="secondary"
            />
          </div>
        </Fragment>
      )}
    </div>
  )
}
