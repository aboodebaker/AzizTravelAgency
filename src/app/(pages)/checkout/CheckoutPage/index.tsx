'use client'

import React, { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Settings } from '../../../../payload/payload-types'
import { Button } from '../../../_components/Button'
import { CheckoutItem } from '../../../_components/CheckoutItem'
import { HR } from '../../../_components/HR'
import { Input } from '../../../_components/Input'
import { LoadingShimmer } from '../../../_components/LoadingShimmer'
import { Media } from '../../../_components/Media'
import { Price } from '../../../_components/Price'
import { useAuth } from '../../../_providers/Auth'
import { useCart } from '../../../_providers/Cart'

import classes from './index.module.scss'

export const CheckoutPage = ({
  settings,
  exchangeRate,
}: {
  settings: Settings
  exchangeRate: number
}) => {
  const { productsPage } = settings
  const { user } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
  const [membership, setMembership] = useState<string | null>(null)

  const { cart, cartIsEmpty, cartTotal } = useCart()

  const rand = Math.round(cartTotal.raw * exchangeRate)

  useEffect(() => {
    if (user !== null && cartIsEmpty) {
      router.push('/cart')
    }
  }, [router, user, cartIsEmpty])

  const handleCheckoutClick = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/create-payment-intent`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json', // Tell the server that we're sending JSON
          },
          body: JSON.stringify({
            membershipId: membership,
            status: 'pending',
          }),
        },
      )

      const data = await response.json()

      if (data.redirectUrl) {
        setCheckoutUrl(data.redirectUrl)
        window.location.href = data.redirectUrl
      } else {
        setError('Failed to retrieve redirect URL.')
      }
    } catch (err) {
      setError('An error occurred while creating the checkout session.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Fragment>
      {cartIsEmpty && (
        <div>
          {'Your '}
          <Link href="/cart">cart</Link>
          {' is empty.'}
          {typeof productsPage === 'object' && productsPage?.slug && (
            <Fragment>
              {' '}
              <Link href={`/${productsPage.slug}`}>Continue shopping?</Link>
            </Fragment>
          )}
        </div>
      )}
      {!cartIsEmpty && (
        <div className={classes.items}>
          {cart?.items?.map((item, index) => {
            if (typeof item.product === 'object') {
              const {
                quantity,
                product,
                product: { title, meta },
              } = item
              if (!quantity) return null
              const isLast = index === (cart?.items?.length || 0) - 1
              const metaImage = meta?.image
              return (
                <Fragment key={index}>
                  <CheckoutItem
                    product={product}
                    title={title}
                    metaImage={metaImage}
                    quantity={quantity}
                    index={index}
                  />
                </Fragment>
              )
            }
            return null
          })}
          <div
            className={classes.orderTotal}
          >{`Order total: ${cartTotal.formatted}, R ${rand}.00`}</div>
          <label htmlFor="" className={classes.inputLabel}>
            Hilton Membership ID
          </label>
          <p className={classes.warningLabel}>
            *Please note that this is only for 1 membership, the quantity is equivalent to the how
            long the membership lasts
          </p>
          <input
            name="membershipId"
            onChange={e => setMembership(e.target.value)}
            value={membership}
            className={classes.modernInput}
            placeholder="1234567890"
            minLength={9}
          />

          {/* {loading && (
            <div className={classes.loading}>
              <LoadingShimmer number={2} />
            </div>
          )} */}

          {error && (
            <div className={classes.error}>
              <p>{`Error: ${error}`}</p>
              <Button label="Back to cart" href="/cart" appearance="secondary" />
            </div>
          )}

          {!loading && (
            <Button
              label="Proceed to Payment"
              onClick={handleCheckoutClick}
              appearance="secondary"
              disabled={membership === null || membership.length < 9}
            />
          )}

          {loading && (
            <Button
              label="Loading..."
              onClick={handleCheckoutClick}
              appearance="secondary"
              disabled={true}
            />
          )}
        </div>
      )}
    </Fragment>
  )
}
