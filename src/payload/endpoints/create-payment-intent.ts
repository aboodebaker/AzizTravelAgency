// import type { PayloadHandler } from 'payload/config'

async function convertCartTotalToZAR(): Promise<number | null> {
  try {
    const res = await fetch(
      'https://v6.exchangerate-api.com/v6/b5221dff56cd44bc2e30e2db/latest/USD',
    )
    const data = await res.json()
    const exchangeRate = data.conversion_rates.ZAR

    return exchangeRate
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error('Error fetching exchange rate:', error)
    const rand = 18
    return rand
  }
}

export const createYocoCheckoutSession = async (req, res): Promise<void> => {
  const { user, payload } = req
  let newOrder = null
  const exchangeRate = await convertCartTotalToZAR()

  const { paymentStatus, membershipId } = req.body as {
    paymentStatus?: 'paid' | 'pending' | 'fulfilled'
    membershipId?: string
  }

  if (!user) {
    res.status(401).send('Unauthorized')
    return
  }

  const fullUser = await payload.findByID({
    collection: 'users',
    id: user.id,
  })

  if (!fullUser) {
    res.status(404).json({ error: 'User not found' })
    return
  }

  if (!membershipId) {
    res.status(400).json({ error: 'Missing order detail, your MembershipID' })
    return
  }

  try {
    const cartItems = fullUser.cart?.items || []

    if (cartItems.length === 0) {
      res.status(400).json({ error: 'No items in cart' })
      return
    }

    let totalAmount = 0
    const lineItems = []

    for (const item of cartItems) {
      const { product, quantity } = item

      if (!quantity || typeof product === 'string' || !product.price) {
        continue
      }

      const priceInCents = Math.round(product.price * exchangeRate) * 100 // Assuming price is in ZAR
      totalAmount += priceInCents * quantity

      lineItems.push({
        displayName: product.title,
        quantity,
        pricingDetails: {
          price: priceInCents,
        },
      })
    }

    if (totalAmount === 0) {
      res.status(400).json({ error: 'Cart total is zero' })
      return
    }

    try {
      newOrder = await payload.create({
        collection: 'orders',
        data: {
          orderedBy: user.id, // The ID of the user placing the order
          items: cartItems
            .filter(item => item.product && typeof item.product !== 'string') // Ensure product exists
            .map(item => ({
              product: typeof item.product === 'string' ? item.product : item.product.id, // Pass only the product ID
              price: item.price || null, // Include price if available, else null
              quantity: item.quantity || null, // Include quantity if available, else null
              id: item.id || null, // Include item ID if available, else null
            })),
          total: totalAmount, // Total amount for the order
          status: paymentStatus || 'pending', // Status of the payment, default is 'pending'
          membershipId: membershipId, // Membership ID for the order
          updatedAt: new Date().toISOString(), // Current timestamp when the order is created
          createdAt: new Date().toISOString(), // Current timestamp when the order is created
        },
      })
      // eslint-disable-next-line no-console
      console.log(newOrder)
    } catch (err: unknown) {
      req.payload.logger.error('Error creating order:', err)
      res.status(500).json({ error: 'Failed to create order' })
      return
    }

    const response = await fetch('https://payments.yoco.com/api/checkouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.YOCO_SECRET_KEY}`,
      },
      body: JSON.stringify({
        amount: totalAmount,
        currency: 'ZAR',
        lineItems,
        successUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/order-confirmation?order_id=${newOrder.id}`,
        cancelUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
        failureUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
        metadata: {
          userId: user.id,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      res.status(response.status).json({ error: data })
      return
    }

    res.status(200).json({ redirectUrl: data.redirectUrl })
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error('Error creating Yoco checkout session:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
