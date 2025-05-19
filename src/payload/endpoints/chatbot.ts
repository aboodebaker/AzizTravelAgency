/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
//@ts-nocheck
import OpenAI from 'openai'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { PayloadHandler } from 'payload/config'

import { fetchDoc } from '../../app/_api/fetchDoc'
import { fetchDocs } from '../../app/_api/fetchDocs'
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})
import { marked } from 'marked'
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies'

// use this handler to get all Stripe customers
// prevents unauthorized or non-admin users from accessing all Stripe customers
// GET /api/customers
export const chatbot = async (req, res) => {
  // Set up the API keys and constants

  // Define available functions

  const functions = [
    {
      type: 'function',
      function: {
        name: 'add_to_newsletter',
        description: 'Add an email to the newsletter list',
        parameters: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              description: 'The email address to subscribe to the newsletter',
            },
            firstName: {
              type: 'string',
              description: 'The first name of the subscriber',
            },
            lastName: {
              type: 'string',
              description: 'The last name of the subscriber',
            },
          },
          required: ['email'],
          additionalProperties: false,
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'one_product',
        description: 'Gets all the details of one product',
        parameters: {
          type: 'object',
          properties: {
            slug: {
              type: 'string',
              description: 'The slug of the product you want to look for',
            },
          },
          required: ['slug'],
          additionalProperties: false,
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'all_products',
        description: 'Gets some details for all products',
        parameters: {
          type: 'object',
          properties: {
            products: {
              type: 'boolean',
              description: 'Whether to get all products or none',
            },
          },
          required: ['products'],
          additionalProperties: false,
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'customOrder',
        description: 'Creates a custom travel order with user preferences',
        parameters: {
          type: 'object',
          properties: {
            existingPackage: {
              type: 'string',
              description:
                'If they are looking for an existing package and what is the package called',
            },
            depatureCity: {
              type: 'string',
              description: 'The city they are looking at departing from',
            },
            destinations: {
              type: 'array',
              items: { type: 'string' },
              description: 'Places the user wants to visit (can be multiple)',
            },
            accommodations: {
              type: 'array',
              items: { type: 'string' },
              description: 'Types or names of accommodations (e.g., hotels, resorts)',
            },
            preferredAirlines: {
              type: 'array',
              items: { type: 'string' },
              description: 'Preferred airlines for travel',
            },
            numberOfPeople: {
              type: 'integer',
              description: 'How many people are traveling',
            },
            hotelStars: {
              type: 'integer',
              description: 'Preferred star rating for hotels (1–5)',
            },
            travelDates: {
              type: 'string',
              format: 'date',
              description: 'Preferred departure date',
            },
            duration: {
              type: 'string',
              description: 'How long the trip should last (e.g., "1 week", "10 days")',
            },
            additionalDetails: {
              type: 'string',
              description: 'Any additional notes or requests from the user',
            },
            email: {
              type: 'string',
              description: 'Email address of the customer',
            },
            name: {
              type: 'string',
              description: 'Full name of the customer',
            },
            phoneNumber: {
              type: 'string',
              description: 'Phone number of the customer',
            },
          },
          required: ['name', 'email'],
          additionalProperties: false,
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'update_order',
        description: 'Updates specific fields in an existing custom travel order',
        parameters: {
          type: 'object',
          properties: {
            orderId: {
              type: 'string',
              description: 'The unique ID of the order to be updated',
            },
            existingPackage: {
              type: 'string',
              description:
                'If they are looking for an existing package and what is the package called',
            },
            depatureCity: {
              type: 'string',
              description: 'The city they are looking at departing from',
            },
            destinations: {
              type: 'array',
              items: { type: 'string' },
              description: 'Updated destinations (optional)',
            },
            accommodations: {
              type: 'array',
              items: { type: 'string' },
              description: 'Updated accommodations (optional)',
            },
            preferredAirlines: {
              type: 'array',
              items: { type: 'string' },
              description: 'Updated preferred airlines (optional)',
            },
            numberOfPeople: {
              type: 'integer',
              description: 'Updated number of travelers (optional)',
            },
            hotelStars: {
              type: 'integer',
              description: 'Updated hotel star rating (optional)',
            },
            travelDates: {
              type: 'string',
              format: 'date',
              description: 'Updated departure date (optional)',
            },
            duration: {
              type: 'string',
              description: 'Updated duration of the trip (optional)',
            },
            additionalDetails: {
              type: 'string',
              description: 'Any additional updates or user requests',
            },
            email: {
              type: 'string',
              description: 'Email address of the customer',
            },
            name: {
              type: 'string',
              description: 'Full name of the customer',
            },
            phoneNumber: {
              type: 'string',
              description: 'Phone number of the customer',
            },
          },
          required: [
            'orderId',
            'destinations',
            'numberOfPeople',
            'travelDates',
            'duration',
            'customerDetails',
            'name',
            'email',
          ],
          additionalProperties: false,
        },
      },
    },
  ]

  // Function to add email to the newsletter
  const addToNewsletter = async ({ email, firstName, lastName }) => {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key':
          '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', // store securely in env file
      },
      body: JSON.stringify({
        email: email,
        attributes: {
          FIRSTNAME: firstName,
          LASTNAME: lastName,
        },
        listIds: [2], // Replace with your Brevo list ID
        updateEnabled: true,
      }),
    })

    console.log(response)

    //  // Replace with actual newsletter API URL
    console.log(`Adding email ${email} to the newsletter...`)
    return `Email ${email} successfully added to the newsletter!` // Return success message
  }
  const one_product = async ({ slug }: string) => {
    const product = await fetchDoc<Product>({
      collection: 'products',
      slug,
      draft: false,
    }) // Log the email being added
    return JSON.stringify(product) // Return success message
  }
  const all_products = async ({ products }: boolean) => {
    const allProducts = await fetchDocs<Product>('products')
    const filteredProducts = allProducts.map(product => ({
      slug: product.slug,
      travelDates: product.travelDetails?.travelDates,
      destinations: product.travelDetails?.destinations,
    }))
    return JSON.stringify(filteredProducts) // Return success message
  }

  const customOrderWithDetails = async ({
    email,
    name,
    phoneNumber,
    destinations,
    accommodations,
    preferredAirlines,
    numberOfPeople,
    hotelStars,
    travelDates,
    duration,
    additionalDetails,
    existingPackage,
    departureCity,
  }) => {
    const description = `
    Travel Request:
    Name: ${name}
    Email: ${email}
    PhoneNumber: ${phoneNumber ? phoneNumber : 'None provided'}
    Package: ${existingPackage ? existingPackage : 'Looking for a custom Package'}
    Destinations: ${
      destinations ? (destinations.length > 1 ? destinations : destinations[0]) : 'none provided'
    }
    Depature City ${departureCity}
    Accommodations: ${
      accommodations
        ? accommodations.length > 1
          ? accommodations
          : accommodations[0]
        : 'No specific preference'
    }

    Preferred Airlines: ${
      preferredAirlines
        ? preferredAirlines.length > 1
          ? preferredAirlines
          : preferredAirlines[0]
        : 'No specific preference'
    }
    Number of People: ${numberOfPeople}
    Hotel Star Rating: ${hotelStars ? hotelStars + ' stars' : 'No preference'}
    Travel Dates: ${travelDates}
    Duration: ${duration}
    Additional Notes: ${additionalDetails || 'None'}
  `
    console.log(description)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentStatus: 'custom',
          description,
          customerDetails: {
            email,
            name,
            phoneNumber: phoneNumber !== null ? phoneNumber : null,
          },
        }),
      })

      if (!response.ok) {
        console.error(`Failed to create order for ${email}`)
        return `Failed to create custom travel order.`
      }

      console.log(`Custom order created for ${email}`)
      const returnedData = await response.json()
      return `Custom travel order created successfully for ${email}! orderId is ${returnedData.id}`
    } catch (error: unknown) {
      console.log(error)
    }
  }

  const updateCustomOrderWithDetails = async ({
    orderId,
    email,
    name,
    phoneNumber,
    destinations,
    accommodations,
    preferredAirlines,
    numberOfPeople,
    hotelStars,
    travelDates,
    duration,
    additionalDetails,
    existingPackage,
    departureCity,
  }) => {
    const description = `
Travel Request:
Name: ${name}
Email: ${email}
PhoneNumber: ${phoneNumber ? phoneNumber : 'None provided'}
Package: ${existingPackage ? existingPackage : 'Looking for a custom Package'}
Destinations: ${destinations?.join(', ') || 'No update'}
Departure City: ${departureCity}
Accommodations: ${accommodations?.join(', ') || 'No update'}
Preferred Airlines: ${preferredAirlines?.join(', ') || 'No update'}
Number of People: ${numberOfPeople ?? 'No update'}
Hotel Star Rating: ${hotelStars ? hotelStars + ' stars' : 'No update'}
Travel Dates: ${travelDates || 'No update'}
Duration: ${duration || 'No update'}
Additional Notes: ${additionalDetails || 'No update'}
  `.trim()

    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: orderId,
        description,
        customerDetails: {
          email,
          name: name,
          phoneNumber: phoneNumber !== null ? phoneNumber : null,
        },
      }),
    })

    if (!response.ok) {
      console.error(`Failed to update order ${orderId}`)
      return `Failed to update custom travel order.`
    }

    console.log(`Custom order updated for ${email}`)
    return `Custom travel order updated successfully for ${email}!`
  }

  // Map function names to function implementations
  const functionMap = {
    add_to_newsletter: addToNewsletter,
    one_product: one_product,
    all_products: all_products,
    customOrder: customOrderWithDetails,
    update_order: updateCustomOrderWithDetails,
  }
  try {
    // Log the request body for debugging
    const messages = req.body.messages // Get the user message from the request body
    // if (!userMessage) {
    //   return res.status(400).json({ error: 'User message is required' })
    // }

    // Initialize messages for conversation
    // let messages = [
    //   {
    //     role: 'user',
    //     content: userMessage,
    //   },
    // ]

    // Make the first call to OpenAI's API
    let response = await openai.chat.completions.create({
      model: 'gpt-4.1',
      messages: messages,
      tools: functions,
      tool_choice: 'auto',
      parallel_tool_calls: false,
    })

    if (!response.choices[0].message.tool_calls) {
      const html = response.choices[0].message.content
        ? marked.parse(response.choices[0].message.content)
        : null

      messages.push({
        role: 'assistant',
        content: html ? html : response.choices[0].message.content,
      })
    }

    // Loop to process multiple function calls
    while (response.choices[0].message?.tool_calls) {
      const functionCall = response.choices[0].message.tool_calls[0]
      const functionName = functionCall.function.name
      const functionArgs = JSON.parse(functionCall.function.arguments) // Parse the function arguments

      console.log(functionArgs)

      // Call the function dynamically
      const functionResponse = await functionMap[functionName](functionArgs)

      // Append the function call and its response to the conversation
      messages.push(response.choices[0].message)
      messages.push({
        // append result message
        role: 'tool',
        tool_call_id: functionCall.id,
        content: functionResponse.toString(),
      })

      // Get the next response after function execution
      response = await openai.chat.completions.create({
        model: 'gpt-4.1',
        messages: messages,
        tools: functions,
        tool_choice: 'auto',
        parallel_tool_calls: false,
      })

      if (!response.choices[0].message.tool_calls) {
        const html = response.choices[0].message.content
          ? marked.parse(response.choices[0].message.content)
          : null

        messages.push({
          role: 'assistant',
          content: html ? html : response.choices[0].message.content,
        })
      }
    }

    // Final response from the assistant
    res.json({
      messages,
    })
  } catch (error: unknown) {
    console.error('Error during OpenAI API request:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
