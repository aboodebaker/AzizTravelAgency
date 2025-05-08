'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Star } from 'lucide-react'

import { Media } from '../../../payload/payload-types'
import TimelineItem from './TimelineItem'

// import { useIsMobile } from '@/hooks/use-mobile'
import classes from './index.module.scss'

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
  checkInDate?: string | null
  checkOutDate?: string | null
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
  departureTime?: string | null
  arrivalTime?: string | null
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
  pickupTime?: string | null
  dropoffTime?: string | null
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
    departureDate: string
    returnDate: string
    flexibility?: {
      beforeDays?: number | null
      afterDays?: number | null
    } | null
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
  title: string
  price: number
  isPackage?: boolean | null
  benefits?: BenefitType[] | null
  diamond?: boolean | null
  travelDetails?: TravelDetailsType
  description: string
  tag: string
}

const Index = ({ tripData }: { tripData: TripDataType }) => {
  // Reference for timeline items
  const timelineRef = useRef<HTMLDivElement>(null)
  const [activeTimelineItem, setActiveTimelineItem] = useState(0)

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
          date: transport.departureTime ? transport.departureTime.split(' ')[0] : '',
          time: transport.departureTime,
          location: 'Departure',
          locationDetail: `Baggage: ${transport.baggageAllowance?.bagNumber} x ${transport.baggageAllowance?.checkedInKg}kg`,
          sortDate: new Date(transport.departureTime || ''),
        })
      } else if (transport.blockType === 'ferry') {
        timelineEvents.push({
          type: 'ferry' as const,
          title: transport.ferryCompany || 'Ferry',
          subtitle: `${transport.departurePort} → ${transport.arrivalPort}`,
          date: transport.departureTime ? transport.departureTime.split(' ')[0] : '',
          time: transport.departureTime,
          location: 'Ferry Departure',
          locationDetail: transport.cabinType || '',
          sortDate: new Date(transport.departureTime || ''),
        })
      } else if (transport.blockType === 'car') {
        timelineEvents.push({
          type: 'car' as const,
          title: transport.provider || 'Car Transfer',
          subtitle: `${transport.pickupLocation} → ${transport.dropoffLocation}`,
          date: transport.pickupTime ? transport.pickupTime.split(' ')[0] : '',
          time: transport.pickupTime,
          location: 'Pickup',
          locationDetail: '',
          sortDate: new Date(transport.pickupTime || ''),
        })
      } else if (transport.blockType === 'train') {
        timelineEvents.push({
          type: 'train' as const,
          title: transport.trainCompany || 'Train',
          subtitle: `${transport.departureStation} → ${transport.arrivalStation}`,
          date: transport.departureTime ? transport.departureTime.split(' ')[0] : '',
          time: transport.departureTime,
          location: 'Train Departure',
          locationDetail: '',
          sortDate: new Date(transport.departureTime || ''),
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
          if (hotel.checkInDate) {
            timelineEvents.push({
              type: 'hotel' as const,
              title: hotel.name || 'Hotel',
              subtitle: `${destination.city}, ${destination.country} - ${hotel.stars} Stars`,
              date: hotel.checkInDate,
              location: 'Check-in',
              locationDetail: `${destination.city}, ${destination.country}`,
              sortDate: new Date(hotel.checkInDate),
            })
          }
          // Add check-out event
          if (hotel.checkOutDate) {
            timelineEvents.push({
              type: 'hotel' as const,
              title: hotel.name || 'Hotel',
              subtitle: `${destination.city}, ${destination.country} - ${hotel.stars} Stars`,
              date: hotel.checkOutDate,
              location: 'Check-out',
              locationDetail: `${destination.city}, ${destination.country}`,
              sortDate: new Date(hotel.checkOutDate),
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
  const hotelImage = destinations[0]?.hotels?.[0]?.hotelImage
  const hotelImageSrc =
    typeof hotelImage === 'string'
      ? hotelImage
      : hotelImage?.url || '/admin%20ui/categories/united-kingdom.jpg'

  return (
    <div className={classes.container}>
      {/* Hero Section */}
      <div className={classes.heroContainer}>
        <img
          src={hotelImageSrc}
          alt={destinations[0]?.city || 'Trip destination'}
          className={classes.heroImage}
        />
        <div className={classes.tagBadge}>{tripData.tag}</div>
        <div className={classes.heroGradient}>
          <div className={classes.heroContent}>
            <h1 className={classes.heroTitle}>{tripData.title}</h1>
            <p className={classes.heroDate}>
              {new Date(tripData.travelDetails?.travelDates?.departureDate).toLocaleTimeString()} -{' '}
              {new Date(tripData.travelDetails?.travelDates?.returnDate).toLocaleTimeString()}
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
                        (new Date(tripData.travelDetails?.travelDates?.returnDate || '').getTime() -
                          new Date(
                            tripData.travelDetails?.travelDates?.departureDate || '',
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
                                : hotel.hotelImage?.url || '/admin%20ui/categories/Australia.jpeg'
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
                            {hotel.checkInDate
                              ? new Date(hotel.checkInDate).toLocaleString(undefined, {
                                  dateStyle: 'medium',
                                  timeStyle: 'short',
                                })
                              : 'N/A'}
                            <br />
                            Check-out:{' '}
                            {hotel.checkOutDate
                              ? new Date(hotel.checkOutDate).toLocaleString(undefined, {
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
                              {flight.departureTime
                                ? new Date(flight.departureTime).toLocaleString(undefined, {
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
                              {flight.arrivalTime
                                ? new Date(flight.arrivalTime).toLocaleString(undefined, {
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
                                    {transport.departureTime}
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
                                    {transport.arrivalTime}
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
                                    {transport.departureTime}
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
                                    {transport.arrivalTime}
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
                                  <div className={classes.locationTime}>{transport.pickupTime}</div>
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
                                    {transport.dropoffTime}
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
                    {sortedTimeline.map((event, idx) => (
                      <div key={idx} className={classes.TimelineItem}>
                        <TimelineItem
                          type={event.type}
                          title={event.title}
                          subtitle={event.subtitle}
                          date={event.date}
                          time={event.time}
                          location={event.location}
                          locationDetail={event.locationDetail}
                          isActive={idx <= activeTimelineItem}
                          className={idx % 2 === 0 ? classes.fadeIn : classes.fadeInDelayed}
                        />
                      </div>
                    ))}
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
