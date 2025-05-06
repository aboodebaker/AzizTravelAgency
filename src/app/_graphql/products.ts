import { ARCHIVE_BLOCK, CALL_TO_ACTION, CONTENT, MEDIA_BLOCK } from './blocks'
import { PRODUCT_CATEGORIES } from './categories'
import { META } from './meta'

export const PRODUCTS = `
  query Products {
    Products(limit: 300) {
      docs {
        slug
        isPackage
        benefits # Will return only if not a package
        travelDetails { # Will return only if it's a package
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
          flights {
            flightNumber
            departureAirport
            arrivalAirport
            departureTime
            arrivalTime
            airline
            travelTimeMinutes
            transitTimeMinutes
            baggageAllowance {
              checkedInKg
              cabinKg
              bagNumber
            }
          }
          destinations {
            city
            country
            hotels {
              name
              stars
            }
          }
        }
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
        benefits
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
          flights {
            flightNumber
            departureAirport
            arrivalAirport
            departureTime
            arrivalTime
            airline
            travelTimeMinutes
            transitTimeMinutes
            baggageAllowance {
              checkedInKg
              cabinKg
              bagNumber
            }
          }
          destinations {
            city
            country
            hotels {
              name
              stars
            }
          }
        }
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
