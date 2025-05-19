/* eslint-disable @typescript-eslint/no-implicit-any-catch */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { fetchDoc } from '../../app/_api/fetchDoc'
import type { Order } from '../payload-types'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const createOrder = async (req, res) => {
  const { payload } = req

  const {
    items,
    total,
    paymentStatus = 'pending',
    membershipId,
    id,
    description,
    customerDetails,
  } = req.body as {
    items?: Order['items']
    total?: number
    paymentStatus?: 'paid' | 'pending' | 'fulfilled' | 'custom'
    membershipId?: string
    id?: string
    description?: string
    customerDetails?: { email?: string; name?: string; phoneNumber?: string }
  }

  console.log('Request body:', req.body)

  const updateOrderWithRetry = async ({
    // eslint-disable-next-line @typescript-eslint/no-shadow
    id,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    paymentStatus,
    retries = 3,
  }: {
    id: string
    paymentStatus: string
    retries?: number
  }): Promise<any> => {
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
          await new Promise(res => setTimeout(res, 100 * attempt)) // exponential backoff
        } else {
          throw error
        }
      }
    }
  }

  try {
    // === CREATE ===
    if (!id) {
      console.log('Creating new order...')
      const newOrder = await payload.create({
        collection: 'orders',
        data: {
          orderedBy: '681693c7541e19bb057ef826',
          items: items || null,
          total: total || 0,
          status: paymentStatus || 'custom',
          description,
          membershipId,
          customerDetails,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
      })

      console.log(newOrder)

      return res.status(200).json({ id: newOrder.id })
    }

    // === UPDATE ===
    console.log('Updating existing order...')

    const order: Order = await payload.findByID({
      collection: 'orders',
      id,
    })

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // If payment status is already the same, return early
    if (order.status === paymentStatus) {
      return res.status(200).end()
    }

    // Update description and/or customer details if provided
    if (description || customerDetails) {
      const updatedOrder = await payload.update({
        collection: 'orders',
        id,
        data: {
          ...(description && { description }),
          ...(customerDetails && { customerDetails }),
        },
      })

      return res.status(200).json({ updatedOrder })
    }

    // Otherwise, just update status
    const updatedOrder = await updateOrderWithRetry({ id, paymentStatus })
    return res.status(200).json(updatedOrder)
  } catch (err) {
    console.error('Error processing order:', err)
    req.payload.logger.error('Error creating or updating order:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
