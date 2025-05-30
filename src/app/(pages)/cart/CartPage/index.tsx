'use client'

import React, { Fragment } from 'react'
import Link from 'next/link'

import { Page, Settings } from '../../../../payload/payload-types'
import { Button } from '../../../_components/Button'
import CartItem from '../../../_components/CartItem'
import { HR } from '../../../_components/HR'
import { LoadingShimmer } from '../../../_components/LoadingShimmer'
import { Media } from '../../../_components/Media'
import { Price } from '../../../_components/Price'
import { RemoveFromCartButton } from '../../../_components/RemoveFromCartButton'
import { useAuth } from '../../../_providers/Auth'
import { useCart } from '../../../_providers/Cart'

import classes from './index.module.scss'

export const CartPage: React.FC<{
  settings: Settings
  page: Page
  exchangeRate: number
}> = props => {
  const { settings, exchangeRate } = props
  const { productsPage } = settings || {}

  const { user } = useAuth()

  const { cart, cartIsEmpty, addItemToCart, cartTotal, hasInitializedCart } = useCart()

  return (
    <Fragment>
      <br />
      {!hasInitializedCart ? (
        <div className={classes.loading}>
          <LoadingShimmer />
        </div>
      ) : (
        <Fragment>
          {cartIsEmpty ? (
            <div className={classes.empty}>
              Your cart is empty.
              {typeof productsPage === 'object' && productsPage?.slug && (
                <Fragment>
                  {' '}
                  <Link href={`/${productsPage.slug}`}>Click here</Link>
                  {` to shop.`}
                </Fragment>
              )}
              {!user && (
                <Fragment>
                  {' '}
                  <Link href={`/login?redirect=%2Fcart`}>Log in</Link>
                  {` to view a saved cart.`}
                </Fragment>
              )}
            </div>
          ) : (
            <div className={classes.items}>
              <div className={classes.itemsTotal}>
                {`There ${cart?.items?.length === 1 ? 'is' : 'are'} ${cart?.items?.length} item${
                  cart?.items?.length === 1 ? '' : 's'
                } in your cart.`}
                {!user && (
                  <Fragment>
                    {' '}
                    <Link href={`/login?redirect=%2Fcart`}>Log in</Link>
                    {` to save your progress.`}
                  </Fragment>
                )}
              </div>
              <ul>
                {cart?.items?.map((item, index) => {
                  if (typeof item.product === 'object') {
                    const {
                      quantity,
                      product,
                      product: { id, title, meta, stripeProductID },
                    } = item

                    const isLast = index === (cart?.items?.length || 0) - 1

                    const metaImage = meta?.image

                    return (
                      <CartItem
                        product={product}
                        title={title}
                        metaImage={metaImage}
                        qty={quantity}
                        addItemToCart={addItemToCart}
                        q={title.toLowerCase().includes('points')}
                      />
                    )
                  }
                  return null
                })}
              </ul>

              <div className={classes.summary}>
                <div className={classes.row}>
                  <h6 className={classes.cartTotal}>Summary</h6>
                </div>
                <div className={classes.row}>
                  <div className={classes.rowItem}>
                    <h6 className={classes.cartTotal}>Total in Rands</h6>
                    <h6 className={classes.cartTotal}>
                      R{Math.round(cartTotal.raw * exchangeRate)}.00
                    </h6>
                  </div>
                </div>
                <div className={classes.row}>
                  <div className={classes.rowItem}>
                    <h6 className={classes.cartTotal}>Total in Dollars</h6>
                    <h6 className={classes.cartTotal}>{cartTotal.formatted}</h6>
                  </div>
                </div>

                <Button
                  className={classes.checkoutButton}
                  href={user ? '/checkout' : '/login?redirect=%2Fcheckout'}
                  label={user ? 'Checkout' : 'Login to checkout'}
                  appearance="primary"
                />
              </div>
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  )
}
