//@ts-nocheck
import type { AfterChangeHook } from 'payload/dist/collections/config/types'

import type { Order } from '../../../payload-types'

export const updateUserPurchases: AfterChangeHook<Order> = async ({ doc, req, operation }) => {
  const { payload } = req

  if ((operation === 'create' || operation === 'update') && doc.orderedBy && doc.items) {
    const orderedBy = typeof doc.orderedBy === 'string' ? doc.orderedBy : doc.orderedBy.id

    const user = await payload.findByID({
      collection: 'users',
      id: orderedBy,
    })

    if (user) {
      await payload.update({
        collection: 'users',
        id: orderedBy,
        data: {
          purchases: [
            ...(user?.purchases?.map(purchase =>
              typeof purchase === 'string' ? purchase : purchase.id,
            ) || []), // eslint-disable-line function-paren-newline
            ...(doc?.items?.map(({ product }) =>
              typeof product === 'string' ? product : product.id,
            ) || []), // eslint-disable-line function-paren-newline
          ],
        },
      })
    }
  }

  return
}
