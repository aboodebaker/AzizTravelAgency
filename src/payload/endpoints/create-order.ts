/* eslint-disable @typescript-eslint/no-implicit-any-catch */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { fetchDoc } from '../../app/_api/fetchDoc'
import type { Order } from '../payload-types'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const createOrder = async (req, res) => {
  const { user, payload } = req

  async function updateOrderWithRetry({
    id,
    paymentStatus,
    retries = 3,
  }: {
    id: string
    paymentStatus: string
    retries?: number
  }): Promise<any> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const updatedOrder = await payload.update({
          collection: 'orders',
          id,
          data: {
            ...(paymentStatus !== undefined && { status: paymentStatus }),
          },
        })
        return updatedOrder
      } catch (error: any) {
        if (attempt < retries && error?.code === 112 && error?.codeName === 'WriteConflict') {
          console.warn(`Write conflict on attempt ${attempt}. Retrying...`)
          // eslint-disable-next-line @typescript-eslint/no-shadow
          await new Promise(res => setTimeout(res, 100 * attempt)) // Exponential backoff
        } else {
          throw error // rethrow if not retriable or retries exhausted
        }
      }
    }
  }

  const { items, total, paymentStatus, membershipId, id } = req.body as {
    items?: Order['items']
    total?: number
    paymentStatus?: 'paid' | 'pending' | 'fulfilled'
    membershipId?: string
    id?: string
  }
  let newOrder = null

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    // if (!id) {
    //   newOrder = await payload.create({
    //     collection: 'orders',
    //     data: {
    //       orderedBy: user.id,
    //       items,
    //       total,
    //       status: paymentStatus || 'pending',
    //       membershipId,
    //     },
    //   })
    // } else {

    const order: Order = await payload.findByID({
      collection: 'orders',
      id,
    })

    console.log(order)

    if (order.status === paymentStatus) {
      return res.status(200).end()
    }

    try {
      const updatedOrder = await updateOrderWithRetry({ id, paymentStatus })
      return res.status(200).json(updatedOrder)
    } catch (err) {
      console.error('Failed to update order:', err)
      return res.status(500).json({ message: 'Failed to update order status 2' })
    }

    // }
    return res.status(200).json(newOrder)
  } catch (err: unknown) {
    console.log(err)
    req.payload.logger.error('Error creating order:', err)
    return res.status(200).json({ error: 'Failed to create order' })
  }
}
