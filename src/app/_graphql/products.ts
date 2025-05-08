import { ARCHIVE_BLOCK, CALL_TO_ACTION, CONTENT, MEDIA_BLOCK } from './blocks'
import { PRODUCT_CATEGORIES } from './categories'
import { MEDIA_FIELDS } from './media'
import { META } from './meta'

export const PRODUCT_DETAILS = `
  travelDetails {
    travelDates {
      departureDate
      returnDate
      flexibility {
        beforeDays
        afterDays
        }
      }
    originalPrice
    amountSaved {
      value
    }
    multiCountry
    visaRequired
    visaIncluded
    travelInsuranceIncluded
    transport {
    ... on Flight {
      blockType
      flightNumber
      departureAirport
      arrivalAirport
      departureTime
      arrivalTime
      airline
      travelTimeHours
      transitTimeHours
      baggageAllowance {
        checkedInKg
        cabinKg
        bagNumber
      }
    }
    ... on Car {
      blockType
      pickupLocation
      dropoffLocation
      pickupTime
      dropoffTime
      travelTimeHours
      provider
    }
    ... on Train {
      blockType
      departureStation
      arrivalStation
      departureTime
      arrivalTime
      travelTimeHours
      trainCompany
    }
    ... on Ferry {
      blockType
      departurePort
      arrivalPort
      departureTime
      arrivalTime
      travelTimeHours
      ferryCompany
      cabinType
    }
  }
    destinations {
      city
      country
      hotels {
        name
        stars
        checkInDate
        checkOutDate
        hotelLink
        hotelImage {
        ${MEDIA_FIELDS}
        }
        nights
      }
    }
    tags {
      tag
      id
    }
  }
`

export const PRODUCTS = `
  query Products {
    Products(limit: 300) {
      docs {
        slug
        isPackage
        benefits {
          benefit
          id
        }
        ${META}
        diamond
        ${PRODUCT_DETAILS}
      }
    }
  }
`

export const PRODUCT = `
  query Product($slug: String, $draft: Boolean) {
    Products(where: { slug: { equals: $slug}}, limit: 1, draft: $draft) {
      docs {
        id
        slug
        title
        stripeProductID
        isPackage
        benefits {
          benefit
          id
        }
        price
        description
        diamond
        ${PRODUCT_DETAILS}
        ${PRODUCT_CATEGORIES}
        layout {
          ${CALL_TO_ACTION}
          ${CONTENT}
          ${MEDIA_BLOCK}
          ${ARCHIVE_BLOCK}
        }
        priceJSON
        enablePaywall
        relatedProducts {
          id
          slug
          title
          ${META}
        }
        ${META}
      }
    }
  }
`

export const PRODUCT_PAYWALL = `
  query Product($slug: String, $draft: Boolean) {
    Products(where: { slug: { equals: $slug}}, limit: 1, draft: $draft) {
      docs {
        paywall {
          ${CALL_TO_ACTION}
          ${CONTENT}
          ${MEDIA_BLOCK}
          ${ARCHIVE_BLOCK}
        }
      }
    }
  }
`
