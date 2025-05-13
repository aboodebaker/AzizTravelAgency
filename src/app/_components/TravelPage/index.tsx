/* eslint-disable no-console */
/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Star } from 'lucide-react'

import { Media } from '../../../payload/payload-types'
import { Button } from '../Button'
import { DatePickerDemo } from './DatePicker'
import TimelineItem from './TimelineItem'

// import { useIsMobile } from '@/hooks/use-mobile'
import classes from './index.module.scss'

function adjustEventTimeByInputDate(
  eventTime: string | undefined,
  inputDate: Date,
  departureDate: Date,
): string {
  if (!eventTime) return ''

  const originalDate = new Date(eventTime)
  if (isNaN(originalDate.getTime())) return eventTime

  const baseDate = inputDate ?? departureDate
  const dayOffset = Math.ceil(
    (baseDate.getTime() - departureDate.getTime()) / (1000 * 60 * 60 * 24),
  )

  const shiftedDate = new Date(originalDate)
  shiftedDate.setDate(shiftedDate.getDate() + dayOffset)

  return shiftedDate.toISOString().slice(0, 16).replace('T', ' ')
}

// Typescript types based on the provided schema
type BenefitType = {
  benefit: string
  id?: string | null
}

type TagType = {
  tag:
    | 'adults_only'
    | 'family'
    | 'sale'
    | 'beach'
    | 'romantic'
    | 'all_inclusive'
    | 'relax'
    | 'adventure'
    | 'city'
  id?: string | null
}

type HotelType = {
  name?: string | null
  stars?: number | null
  checkInDateExample?: string | null
  checkOutDateExample?: string | null
  hotelLink?: string | null
  hotelImage?: string | null | Media
  nights?: number | null
  id?: string | null
}

type DestinationType = {
  city?: string | null
  country?: string | null
  hotels?: HotelType[] | null
  id?: string | null
}

type TransportType = {
  blockType: 'flight' | 'car' | 'train' | 'ferry'
  id?: string | null
  blockName?: string | null
  // Flight specific
  flightNumber?: string | null
  departureAirport?: string | null
  arrivalAirport?: string | null
  departureTimeExample?: string | null
  arrivalTimeExample?: string | null
  airline?: string | null
  travelTimeHours?: number | null
  transitTimeHours?: number | null
  baggageAllowance?: {
    checkedInKg?: number | null
    cabinKg?: number | null
    bagNumber?: number | null
  } | null
  // Car specific
  pickupLocation?: string | null
  dropoffLocation?: string | null
  pickupTimeExample?: string | null
  dropoffTimeExample?: string | null
  provider?: string | null
  // Train specific
  departureStation?: string | null
  arrivalStation?: string | null
  trainCompany?: string | null
  // Ferry specific
  departurePort?: string | null
  arrivalPort?: string | null
  ferryCompany?: string | null
  cabinType?: string | null
}

type TravelDetailsType = {
  travelDates: {
    departureDateExample: string
    returnDateExample: string
    flexibility?: {
      beforeDays?: number | null
      afterDays?: number | null
    } | null
    packageDates: {
      firstDate: string
      lastDate: string
    }
  }
  originalPrice?: number | null
  amountSaved?: {
    value?: number | null
  } | null
  multiCountry?: boolean | null
  visaRequired?: boolean | null
  visaIncluded?: boolean | null
  travelInsuranceIncluded?: boolean | null
  tags?: TagType[] | null
  transport?: TransportType[] | null
  destinations?: DestinationType[] | null
}

type TripDataType = {
  title?: string
  price?: number
  isPackage?: boolean | null
  benefits?: BenefitType[] | null
  diamond?: boolean | null
  travelDetails?: TravelDetailsType
  description?: string
  tag?: string
  image?: Media | string
  slug?: string | null
}

const Index = ({ tripData }: { tripData: TripDataType }) => {
  // Reference for timeline items
  const timelineRef = useRef<HTMLDivElement>(null)
  const [activeTimelineItem, setActiveTimelineItem] = useState(0)

  const depatureDate = new Date(tripData.travelDetails.travelDates.departureDateExample)

  const [date, setDate] = useState<Date | null>(depatureDate)

  // Initialize timeline events array
  const timelineEvents = []

  // Add transport events (flights, car, train, ferry)
  if (tripData.travelDetails?.transport) {
    tripData.travelDetails.transport.forEach(transport => {
      // For flights
      if (transport.blockType === 'flight') {
        timelineEvents.push({
          type: 'flight' as const,
          title: `${transport.airline} ${transport.flightNumber}`,
          subtitle: `${transport.departureAirport} → ${transport.arrivalAirport}`,
          date: transport.departureTimeExample ? transport.departureTimeExample.split(' ')[0] : '',
          time: transport.departureTimeExample,
          location: 'Departure',
          locationDetail: `Baggage: ${transport.baggageAllowance?.bagNumber} x ${transport.baggageAllowance?.checkedInKg}kg`,
          sortDate: new Date(transport.departureTimeExample || ''),
        })
      } else if (transport.blockType === 'ferry') {
        timelineEvents.push({
          type: 'ferry' as const,
          title: transport.ferryCompany || 'Ferry',
          subtitle: `${transport.departurePort} → ${transport.arrivalPort}`,
          date: transport.departureTimeExample ? transport.departureTimeExample.split(' ')[0] : '',
          time: transport.departureTimeExample,
          location: 'Ferry Departure',
          locationDetail: transport.cabinType || '',
          sortDate: new Date(transport.departureTimeExample || ''),
        })
      } else if (transport.blockType === 'car') {
        timelineEvents.push({
          type: 'car' as const,
          title: transport.provider || 'Car Transfer',
          subtitle: `${transport.pickupLocation} → ${transport.dropoffLocation}`,
          date: transport.pickupTimeExample ? transport.pickupTimeExample.split(' ')[0] : '',
          time: transport.pickupTimeExample,
          location: 'Pickup',
          locationDetail: '',
          sortDate: new Date(transport.pickupTimeExample || ''),
        })
      } else if (transport.blockType === 'train') {
        timelineEvents.push({
          type: 'train' as const,
          title: transport.trainCompany || 'Train',
          subtitle: `${transport.departureStation} → ${transport.arrivalStation}`,
          date: transport.departureTimeExample ? transport.departureTimeExample.split(' ')[0] : '',
          time: transport.departureTimeExample,
          location: 'Train Departure',
          locationDetail: '',
          sortDate: new Date(transport.departureTimeExample || ''),
        })
      }
    })
  }

  // Add hotel check-in and check-out events
  if (tripData.travelDetails?.destinations) {
    tripData.travelDetails.destinations.forEach(destination => {
      if (destination.hotels) {
        destination.hotels.forEach(hotel => {
          // Add check-in event
          if (hotel.checkInDateExample) {
            timelineEvents.push({
              type: 'hotel' as const,
              title: hotel.name || 'Hotel',
              subtitle: `${destination.city}, ${destination.country} - ${hotel.stars} Stars`,
              date: hotel.checkInDateExample ? hotel.checkInDateExample.split(' ')[0] : '',
              time: hotel.checkInDateExample,
              location: 'Check-in',
              locationDetail: `${destination.city}, ${destination.country}`,
              sortDate: new Date(hotel.checkInDateExample),
            })
          }
          // Add check-out event
          if (hotel.checkOutDateExample) {
            timelineEvents.push({
              type: 'hotel' as const,
              title: hotel.name || 'Hotel',
              subtitle: `${destination.city}, ${destination.country} - ${hotel.stars} Stars`,
              date: hotel.checkOutDateExample ? hotel.checkOutDateExample.split(' ')[0] : '',
              time: hotel.checkOutDateExample,
              location: 'Check-out',
              locationDetail: `${destination.city}, ${destination.country}`,
              sortDate: new Date(hotel.checkOutDateExample),
            })
          }
        })
      }
    })
  }

  // Sort timeline events chronologically
  const sortedTimeline = [...timelineEvents].sort(
    (a, b) => a.sortDate.getTime() - b.sortDate.getTime(),
  )

  // Scroll effect for timeline
  useEffect(() => {
    const handleScroll = () => {
      if (timelineRef.current) {
        const timelineItems = timelineRef.current.querySelectorAll('.timeline-item')
        const timelineRect = timelineRef.current.getBoundingClientRect()
        const windowHeight = window.innerHeight

        // Update active timeline item when in view
        timelineItems.forEach((item, index) => {
          const rect = item.getBoundingClientRect()
          const isInView = rect.top < windowHeight * 0.75 && rect.bottom > windowHeight * 0.25
          if (isInView) {
            setActiveTimelineItem(index)
          }
        })
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Trigger on first render

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Format price
  const formatPrice = (price: number) => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  // Extract destinations and countries
  const destinations = tripData.travelDetails?.destinations || []
  const countrySet = new Set<string>()
  destinations.forEach(dest => {
    if (dest.country) countrySet.add(dest.country)
  })
  const destinationCount = destinations.length
  const countryCount = countrySet.size

  // Hotel image handling
  const headerImg = tripData.image
  const headerSource = typeof headerImg === 'string' ? headerImg : `/media/${headerImg?.filename}`

  return (
    <div className={classes.container}>
      {/* Hero Section */}
      <div className={classes.heroContainer}>
        <img
          src={headerSource}
          alt={destinations[0]?.city || 'Trip destination'}
          className={classes.heroImage}
        />
        <div className={classes.tagBadge}>{tripData.tag}</div>
        <div className={classes.heroGradient}>
          <div className={classes.heroContent}>
            <h1 className={classes.heroTitle}>{tripData.title}</h1>
            <p className={classes.heroDate}>
              {'Valid to book between '}{' '}
              {new Date(tripData.travelDetails?.travelDates.packageDates.firstDate).toLocaleString(
                undefined,
                {
                  dateStyle: 'medium',
                },
              )}{' '}
              until{' '}
              {new Date(tripData.travelDetails?.travelDates?.packageDates.lastDate).toLocaleString(
                undefined,
                {
                  dateStyle: 'medium',
                },
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className={classes.mainContent}>
        <div className={classes.gridContainer}>
          {/* Left Column - Details */}
          <div className={classes.leftColumn}>
            {/* Price and Benefits Section */}
            <div className={classes.card}>
              <div className={classes.priceWrapper}>
                <span className={classes.currentPrice}>${formatPrice(tripData.price)}</span>
                {tripData.travelDetails?.originalPrice && (
                  <span className={classes.originalPrice}>
                    ${formatPrice(tripData.travelDetails.originalPrice)}
                  </span>
                )}
                {tripData.travelDetails?.amountSaved?.value && (
                  <span className={classes.savedAmount}>
                    Save ${formatPrice(tripData.travelDetails.amountSaved.value)}
                  </span>
                )}
              </div>

              {/* {tripData.isPackage && (
                <div className={classes.packageAlert}>
                  <span className="font-medium">Package deal:</span> All flights, accommodations and
                  transportation included
                </div>
              )} */}

              <div className={classes.tripDetailsSection}>
                <h3 className={classes.sectionTitle}>Trip Details</h3>
                <div className={classes.detailsGrid}>
                  <div className={classes.detailItem}>
                    <span className={classes.detailLabel}>Duration</span>
                    <p className={classes.detailValue}>
                      {Math.round(
                        (new Date(
                          tripData.travelDetails?.travelDates?.returnDateExample || '',
                        ).getTime() -
                          new Date(
                            tripData.travelDetails?.travelDates?.departureDateExample || '',
                          ).getTime()) /
                          (1000 * 60 * 60 * 24),
                      )}{' '}
                      days
                    </p>
                  </div>
                  <div className={classes.detailItem}>
                    <span className={classes.detailLabel}>Destinations</span>
                    <p className={classes.detailValue}>
                      {destinationCount} cities in {countryCount}{' '}
                      {countryCount > 1 ? 'countries' : 'country'}
                    </p>
                  </div>
                  {tripData.travelDetails?.visaRequired !== null && (
                    <div className={classes.detailItem}>
                      <span className={classes.detailLabel}>Visa</span>
                      <p className={classes.detailValue}>
                        {tripData.travelDetails?.visaRequired
                          ? tripData.travelDetails?.visaIncluded
                            ? 'Required (Included)'
                            : 'Required'
                          : 'Not Required'}
                      </p>
                    </div>
                  )}
                  {tripData.travelDetails?.travelInsuranceIncluded && (
                    <div className={classes.detailItem}>
                      <span className={classes.detailLabel}>Insurance</span>
                      <p className={classes.detailValue}>Included</p>
                    </div>
                  )}
                </div>
              </div>

              {tripData.benefits && tripData.benefits.length > 0 && (
                <div>
                  <h3 className={classes.sectionTitle}>What's Included</h3>
                  <ul className={classes.benefitsList}>
                    {tripData.benefits.map((benefit, idx) => (
                      <li key={idx} className={classes.benefitItem}>
                        <span className={classes.checkIcon}>✓</span>
                        {benefit.benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {tripData.travelDetails?.tags && tripData.travelDetails.tags.length > 0 && (
                <div className={classes.tagsList}>
                  {tripData.travelDetails.tags.map((tag, idx) => (
                    <span key={idx} className={classes.tag}>
                      {tag.tag.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              )}

              <p className={classes.detailLabel}>
                * These are example dates so please put your depature date here:
              </p>
              <input
                type="date"
                id="StartDate"
                name=""
                min={depatureDate.toISOString().slice(0, 10)}
                max={tripData.travelDetails.travelDates.packageDates.lastDate.slice(0, 10)}
                className={classes.modernDateInput}
                value={date?.toISOString().split('T')[0] || ''}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const newDate = new Date(event.target.value)
                  setDate(newDate)
                }}
                aria-label="Depature Date"
              ></input>
              <Button
                appearance="primary"
                onClick={async () => {
                  window.dispatchEvent(new CustomEvent('openChat')) // 👈 Open the chat immediately

                  let messages: any[] = []

                  const existing = localStorage.getItem('chatMessages')
                  try {
                    messages = existing ? JSON.parse(existing) : []
                  } catch (e) {
                    console.error('Failed to parse localStorage chatMessages:', e)
                  }

                  if (messages.length === 0 || messages[0].role !== 'system') {
                    messages.unshift({
                      role: 'system',
                      content: "I'm your helpful assistant. How can I help you today?",
                    })
                  }

                  const userMessage: any = {
                    role: 'user',
                    content: `Hi, I am interested in your package: ${
                      tripData.title
                    } and I would like to leave on the ${new Date(date).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}. `, //The product slug is ${tripData.slug}
                  }
                  const typingPlaceholder: any = { role: 'assistant', content: '...' }

                  const intermediateMessages = [...messages, userMessage, typingPlaceholder]

                  localStorage.setItem('chatMessages', JSON.stringify(intermediateMessages))
                  window.dispatchEvent(new CustomEvent('chatMessagesUpdated'))

                  try {
                    const response = await axios.post('/api/chatbot', {
                      messages: [...messages, userMessage],
                    })

                    const fullConversation = response.data.messages
                    localStorage.setItem('chatMessages', JSON.stringify(fullConversation))
                    window.dispatchEvent(new CustomEvent('chatMessagesUpdated'))
                  } catch (err: any) {
                    console.error('Chatbot API error:', err)
                    const fallback = [
                      ...messages,
                      userMessage,
                      { role: 'assistant', content: 'Sorry, something went wrong.' },
                    ]
                    localStorage.setItem('chatMessages', JSON.stringify(fallback))
                    window.dispatchEvent(new CustomEvent('chatMessagesUpdated'))
                  }
                }}
              >
                Contact Us
              </Button>
            </div>

            {/* Description Section */}
            <div className={classes.card}>
              <h2 className={classes.cardTitle}>Description</h2>
              <p className={classes.cardDescription}>{tripData.description}</p>
            </div>

            {/* Hotels Section */}
            <div className={classes.card}>
              <h2 className={classes.cardTitle}>Accommodations</h2>
              <div className={classes.accommodationsGrid}>
                {tripData.travelDetails?.destinations?.flatMap(
                  (destination, destIdx) =>
                    destination.hotels?.map((hotel, hotelIdx) => (
                      <div key={`${destIdx}-${hotelIdx}`} className={classes.hotelCard}>
                        <div className={classes.hotelImageContainer}>
                          <img
                            src={
                              typeof hotel.hotelImage === 'string'
                                ? hotel.hotelImage
                                : typeof hotel.hotelImage !== 'string' && hotel.hotelImage?.filename
                                ? `/media/${hotel.hotelImage.filename}`
                                : ''
                            }
                            alt={hotel.name || ''}
                            className={classes.hotelImage}
                          />
                        </div>
                        <div className={classes.hotelContent}>
                          <h3 className={classes.hotelName}>{hotel.name}</h3>
                          <div className={classes.hotelLocation}>
                            <span className={classes.hotelCity}>
                              {destination.city}, {destination.country}
                            </span>
                            <div className={classes.starsContainer}>
                              {Array(hotel.stars || 0)
                                .fill(0)
                                .map((_, i) => (
                                  <Star key={i} className={classes.starIcon} />
                                ))}
                            </div>
                          </div>
                          <div className={classes.hotelDates}>
                            Check-in:{' '}
                            {hotel.checkInDateExample
                              ? new Date(
                                  adjustEventTimeByInputDate(
                                    hotel.checkInDateExample,
                                    date,
                                    depatureDate,
                                  ),
                                ).toLocaleString(undefined, {
                                  dateStyle: 'medium',
                                  timeStyle: 'short',
                                })
                              : 'N/A'}
                            <br />
                            Check-out:{' '}
                            {hotel.checkOutDateExample
                              ? new Date(
                                  adjustEventTimeByInputDate(
                                    hotel.checkOutDateExample,
                                    date,
                                    depatureDate,
                                  ),
                                ).toLocaleString(undefined, {
                                  dateStyle: 'medium',
                                  timeStyle: 'short',
                                })
                              : 'N/A'}
                            <br />
                            {hotel.nights && `${hotel.nights} nights`}
                          </div>
                        </div>
                      </div>
                    )) || [],
                )}
              </div>
            </div>

            {/* Flights Section */}
            <div className={classes.card}>
              <h2 className={classes.cardTitle}>Flights</h2>
              <div className="space-y-6">
                {tripData.travelDetails?.transport
                  ?.filter(t => t.blockType === 'flight')
                  .map((flight, idx) => (
                    <div key={idx} className={classes.transportCard}>
                      <div className={classes.transportSection}>
                        <div className={classes.transportInfo}>
                          <div className={classes.transportTitle}>
                            {flight.airline} {flight.flightNumber}
                          </div>
                          <div className={classes.transportSubtitle}>
                            Baggage Allowance: {flight.baggageAllowance?.bagNumber} x{' '}
                            {flight.baggageAllowance?.checkedInKg}kg
                          </div>
                        </div>
                        <div className={classes.journeyDisplay}>
                          <div className={classes.locationPoint}>
                            <div className={classes.locationTime}>
                              {flight.departureTimeExample
                                ? new Date(
                                    adjustEventTimeByInputDate(
                                      flight.departureTimeExample,
                                      date,
                                      depatureDate,
                                    ),
                                  ).toLocaleString(undefined, {
                                    dateStyle: 'medium',
                                    timeStyle: 'short',
                                  })
                                : 'N/A'}
                            </div>
                            <div className={classes.locationName}>{flight.departureAirport}</div>
                          </div>
                          <div className={classes.journeyConnector}>
                            <div className={classes.connectorArrow}>→</div>
                            <div className={classes.connectorLine}></div>
                          </div>
                          <div className={classes.locationPoint}>
                            <div className={classes.locationTime}>
                              {flight.arrivalTimeExample
                                ? new Date(
                                    adjustEventTimeByInputDate(
                                      flight.arrivalTimeExample,
                                      date,
                                      depatureDate,
                                    ),
                                  ).toLocaleString(undefined, {
                                    dateStyle: 'medium',
                                    timeStyle: 'short',
                                  })
                                : 'N/A'}
                            </div>
                            <div className={classes.locationName}>{flight.arrivalAirport}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Other Transport Section */}
            {tripData.travelDetails?.transport?.some(t => t.blockType !== 'flight') && (
              <div className={classes.card}>
                <h2 className={classes.cardTitle}>Other Transport</h2>
                <div className="space-y-6">
                  {tripData.travelDetails?.transport
                    ?.filter(t => t.blockType !== 'flight')
                    .map((transport, idx) => {
                      if (transport.blockType === 'ferry') {
                        return (
                          <div key={idx} className={classes.transportCard}>
                            <div className={classes.transportSection}>
                              <div className={classes.transportInfo}>
                                <div className={classes.transportTitle}>
                                  {transport.ferryCompany}
                                </div>
                                <div className={classes.transportSubtitle}>
                                  {transport.cabinType}
                                </div>
                              </div>
                              <div className={classes.journeyDisplay}>
                                <div className={classes.locationPoint}>
                                  <div className={classes.locationTime}>
                                    {transport.departureTimeExample
                                      ? new Date(
                                          adjustEventTimeByInputDate(
                                            transport.departureTimeExample,
                                            date,
                                            depatureDate,
                                          ),
                                        ).toLocaleString(undefined, {
                                          dateStyle: 'medium',
                                          timeStyle: 'short',
                                        })
                                      : 'N/A'}
                                  </div>
                                  <div className={classes.locationName}>
                                    {transport.departurePort}
                                  </div>
                                </div>
                                <div className={classes.journeyConnector}>
                                  <div className={classes.connectorArrow}>→</div>
                                  <div className={classes.connectorLine}></div>
                                </div>
                                <div className={classes.locationPoint}>
                                  <div className={classes.locationTime}>
                                    {transport.arrivalTimeExample
                                      ? new Date(
                                          adjustEventTimeByInputDate(
                                            transport.arrivalTimeExample,
                                            date,
                                            depatureDate,
                                          ),
                                        ).toLocaleString(undefined, {
                                          dateStyle: 'medium',
                                          timeStyle: 'short',
                                        })
                                      : 'N/A'}
                                  </div>
                                  <div className={classes.locationName}>
                                    {transport.arrivalPort}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      } else if (transport.blockType === 'train') {
                        return (
                          <div key={idx} className={classes.transportCard}>
                            <div className={classes.transportSection}>
                              <div className={classes.transportInfo}>
                                <div className={classes.transportTitle}>
                                  {transport.trainCompany}
                                </div>
                              </div>
                              <div className={classes.journeyDisplay}>
                                <div className={classes.locationPoint}>
                                  <div className={classes.locationTime}>
                                    {transport.departureTimeExample
                                      ? new Date(transport.departureTimeExample).toLocaleString(
                                          undefined,
                                          {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                          },
                                        )
                                      : 'N/A'}
                                  </div>
                                  <div className={classes.locationName}>
                                    {transport.departureStation}
                                  </div>
                                </div>
                                <div className={classes.journeyConnector}>
                                  <div className={classes.connectorArrow}>→</div>
                                  <div className={classes.connectorLine}></div>
                                </div>
                                <div className={classes.locationPoint}>
                                  <div className={classes.locationTime}>
                                    {transport.arrivalTimeExample
                                      ? new Date(transport.arrivalTimeExample).toLocaleString(
                                          undefined,
                                          {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                          },
                                        )
                                      : 'N/A'}
                                  </div>
                                  <div className={classes.locationName}>
                                    {transport.arrivalStation}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      } else if (transport.blockType === 'car') {
                        return (
                          <div key={idx} className={classes.transportCard}>
                            <div className={classes.transportSection}>
                              <div className={classes.transportInfo}>
                                <div className={classes.transportTitle}>
                                  {transport.provider || 'Car Transfer'}
                                </div>
                              </div>
                              <div className={classes.journeyDisplay}>
                                <div className={classes.locationPoint}>
                                  <div className={classes.locationTime}>
                                    {transport.pickupTimeExample
                                      ? new Date(transport.pickupTimeExample).toLocaleString(
                                          undefined,
                                          {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                          },
                                        )
                                      : 'N/A'}
                                  </div>
                                  <div className={classes.locationName}>
                                    {transport.pickupLocation}
                                  </div>
                                </div>
                                <div className={classes.journeyConnector}>
                                  <div className={classes.connectorArrow}>→</div>
                                  <div className={classes.connectorLine}></div>
                                </div>
                                <div className={classes.locationPoint}>
                                  <div className={classes.locationTime}>
                                    {transport.dropoffTimeExample
                                      ? new Date(transport.dropoffTimeExample).toLocaleString(
                                          undefined,
                                          {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                          },
                                        )
                                      : 'N/A'}
                                  </div>
                                  <div className={classes.locationName}>
                                    {transport.dropoffLocation}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      return null
                    })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Timeline */}
          <div className={classes.rightColumn}>
            <div className={classes.stickyContainer}>
              {/* Full Travel Timeline Section */}
              <div className={classes.timelineCard}>
                <h2 className={classes.timelineHeading}>Complete Travel Timeline</h2>
                <p className={classes.detailLabel}>
                  * These are example dates so please put your depature date here:
                </p>
                <input
                  type="date"
                  id="StartDate"
                  name=""
                  min={depatureDate.toISOString().slice(0, 10)}
                  max={tripData.travelDetails.travelDates.packageDates.lastDate.slice(0, 10)}
                  className={classes.modernDateInput}
                  value={date?.toISOString().split('T')[0] || ''}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const newDate = new Date(event.target.value)
                    setDate(newDate)
                  }}
                  aria-label="Depature Date"
                ></input>
                {/* <DatePickerDemo /> */}

                <div ref={timelineRef} className={classes.timelineContainer}>
                  {/* Timeline connector line with animation */}
                  <div className={classes.timelineLine}></div>
                  <div
                    className={classes.timelineProgress}
                    style={{
                      height: `${((activeTimelineItem + 1) / sortedTimeline.length) * 100}%`,
                      maxHeight: 'calc(100% - 60px)',
                    }}
                  ></div>

                  {/* Timeline items */}
                  <div className={classes.timelineItemsContainer}>
                    {sortedTimeline.map((event, idx) => {
                      const adjustedTime = adjustEventTimeByInputDate(
                        event.time,
                        date,
                        depatureDate,
                      )

                      return (
                        <div key={idx} className={classes.TimelineItem}>
                          <TimelineItem
                            type={event.type}
                            title={event.title}
                            subtitle={event.subtitle}
                            date={adjustedTime?.split(' ')[0] || event.date}
                            time={adjustedTime || event.time}
                            location={event.location}
                            locationDetail={event.locationDetail}
                            isActive={idx <= activeTimelineItem}
                            className={idx % 2 === 0 ? classes.fadeIn : classes.fadeInDelayed}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
