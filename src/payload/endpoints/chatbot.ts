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
        description: 'gets all the details of one product',
        parameters: {
          type: 'object',
          properties: {
            slug: {
              type: 'string',
              description: 'the slug of the product you want to look for',
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
        description: 'gets some details for all products',
        parameters: {
          type: 'object',
          properties: {
            products: {
              type: 'boolean',
              description: 'whether to get all products or none',
            },
          },
          required: ['products'],
          additionalProperties: false,
        },
      },
    },
  ]

  // Function to add email to the newsletter
  const addToNewsletter = async (email, firstName, lastName) => {
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
  const one_product = async (slug: string) => {
    const product = await fetchDoc<Product>({
      collection: 'products',
      slug,
      draft: false,
    }) // Log the email being added
    return `${product}` // Return success message
  }
  const all_products = async (products: boolean) => {
    const allProducts = await fetchDocs<Product>('products')
    const filteredProducts = allProducts.map(product => ({
      slug: product.slug,
      travelDates: product.travelDetails?.travelDates,
      destinations: product.travelDetails?.destinations,
    }))
    return JSON.stringify(filteredProducts) // Return success message
  }

  // Map function names to function implementations
  const functionMap = {
    add_to_newsletter: addToNewsletter,
    one_product: one_product,
    all_products: all_products,
  }
  try {
    // Log the request body for debugging
    const messages = req.body.messages // Get the user message from the request body
    console.log(messages)
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
      model: 'gpt-4.1-nano',
      messages: messages,
      tools: functions,
      tool_choice: 'auto',
      parallel_tool_calls: false,
    })

    console.log(response.choices[0].message)

    if (response.choices[0].message?.tool_calls === undefined) {
      messages.push(response.choices[0].message)
    }

    // Loop to process multiple function calls
    while (response.choices[0].message?.tool_calls) {
      const functionCall = response.choices[0].message.tool_calls[0]
      const functionName = functionCall.function.name
      const functionArgs = JSON.parse(functionCall.function.arguments) // Parse the function arguments

      // Call the function dynamically
      const functionResponse = await functionMap[functionName](...Object.values(functionArgs))

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
        model: 'gpt-4.1-nano',
        messages: messages,
        tools: functions,
        tool_choice: 'auto',
        parallel_tool_calls: false,
      })

      console.log(response)
      const html = marked.parse(response.choices[0].message.content)

      messages.push({
        role: 'assistant',
        content: html ? html : response.choices[0].message.content,
      })

      console.log(messages)
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
