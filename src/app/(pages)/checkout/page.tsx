import React, { Fragment } from 'react'
import { Metadata } from 'next'

import { Settings } from '../../../payload/payload-types'
import { fetchSettings } from '../../_api/fetchGlobals'
import { Gutter } from '../../_components/Gutter'
import { Message } from '../../_components/Message'
import { LowImpactHero } from '../../_heros/LowImpact'
import { getMeUser } from '../../_utilities/getMeUser'
import { mergeOpenGraph } from '../../_utilities/mergeOpenGraph'
import { CheckoutPage } from './CheckoutPage'

import classes from './index.module.scss'

export default async function Checkout() {
  await getMeUser({
    nullUserRedirect: `/login?error=${encodeURIComponent(
      'You must be logged in to checkout.',
    )}&redirect=${encodeURIComponent('/checkout')}`,
  })

  let settings: Settings | null = null

  try {
    settings = await fetchSettings()
  } catch (error) {
    // no need to redirect to 404 here, just simply render the page with fallback data where necessary
    console.error(error) // eslint-disable-line no-console
  }

  async function convertCartTotalToZAR(): Promise<number | null> {
    try {
      const res = await fetch(
        'https://v6.exchangerate-api.com/v6/b5221dff56cd44bc2e30e2db/latest/USD',
      )
      const data = await res.json()
      const exchangeRate = data.conversion_rates.ZAR

      return exchangeRate
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching exchange rate:', error)
      const rand = 18
      return rand
    }
  }

  const exchangeRate = await convertCartTotalToZAR()

  return (
    <Fragment>
      <LowImpactHero
        type="lowImpact"
        media={null}
        richText={[
          {
            type: 'h1',
            children: [
              {
                text: 'Checkout',
              },
            ],
          },
        ]}
      />
      <Gutter className={classes.checkoutPage}>
        <CheckoutPage settings={settings} exchangeRate={exchangeRate} />
      </Gutter>
    </Fragment>
  )
}

export const metadata: Metadata = {
  title: 'Account',
  description: 'Create an account or log in to your existing account.',
  openGraph: mergeOpenGraph({
    title: 'Account',
    url: '/account',
  }),
}
