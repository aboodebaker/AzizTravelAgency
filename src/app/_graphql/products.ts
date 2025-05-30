import { ARCHIVE_BLOCK, CALL_TO_ACTION, CONTENT, MEDIA_BLOCK } from './blocks'
import { PRODUCT_CATEGORIES } from './categories'
import { MEDIA_FIELDS } from './media'
import { META } from './meta'

export const PRODUCT_DETAILS = `
  travelDetails {
    travelDates {
      departureDateExample
      returnDateExample
      packageDates {
        firstDate
        lastDate
      }
      validUntil
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
      departureTimeExample
      arrivalTimeExample
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
      pickupTimeExample
      dropoffTimeExample
      travelTimeHours
      provider
    }
    ... on Train {
      blockType
      departureStation
      arrivalStation
      departureTimeExample
      arrivalTimeExample
      travelTimeHours
      trainCompany
    }
    ... on Ferry {
      blockType
      departurePort
      arrivalPort
      departureTimeExample
      arrivalTimeExample
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
        checkInDateExample
        checkOutDateExample
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
        image {
        ${MEDIA_FIELDS}
        }
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
        image {
        ${MEDIA_FIELDS}
        }
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
