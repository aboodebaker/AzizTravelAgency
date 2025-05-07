'use client'

import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import qs from 'qs'

import type { Product } from '../../../payload/payload-types'
import type { ArchiveBlockProps } from '../../_blocks/ArchiveBlock/types'
import { useFilter } from '../../_providers/Filter'
import { Card } from '../Card'
import { Gutter } from '../Gutter'
import { TravelCard } from '../LuxuryTravelCard'
import { PageRange } from '../PageRange'
import { Pagination } from '../Pagination'

import classes from './index.module.scss'

type Result = {
  docs: (Product | string)[]
  hasNextPage: boolean
  hasPrevPage: boolean
  nextPage: number
  page: number
  prevPage: number
  totalDocs: number
  totalPages: number
}

export type Props = {
  categories?: ArchiveBlockProps['categories']
  className?: string
  limit?: number
  onResultChange?: (result: Result) => void
  populateBy?: 'collection' | 'selection'
  populatedDocs?: ArchiveBlockProps['populatedDocs']
  populatedDocsTotal?: ArchiveBlockProps['populatedDocsTotal']
  relationTo?: 'products'
  selectedDocs?: ArchiveBlockProps['selectedDocs']
  showPageRange?: boolean
  sort?: string
}

export const CollectionArchive: React.FC<Props> = props => {
  const { categoryFilters, sort } = useFilter()

  const {
    className,
    limit = 10,
    onResultChange,
    populateBy,
    populatedDocs,
    populatedDocsTotal,
    relationTo,
    selectedDocs,
    showPageRange,
  } = props

  const [results, setResults] = useState<Result>({
    docs: (populateBy === 'collection'
      ? populatedDocs
      : populateBy === 'selection'
      ? selectedDocs
      : []
    )?.map(doc => doc.value),
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: 1,
    page: 1,
    prevPage: 1,
    totalDocs: typeof populatedDocsTotal === 'number' ? populatedDocsTotal : 0,
    totalPages: 1,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const scrollRef = useRef<HTMLDivElement>(null)
  const hasHydrated = useRef(false)
  const isRequesting = useRef(false)
  const [page, setPage] = useState(1)

  const scrollToRef = useCallback(() => {
    const { current } = scrollRef
    if (current) {
      // current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    if (!isLoading && typeof results.page !== 'undefined') {
      // scrollToRef()
    }
  }, [isLoading, scrollToRef, results])

  useEffect(() => {
    let timer: NodeJS.Timeout = null

    if (populateBy === 'collection' && !isRequesting.current) {
      isRequesting.current = true
      timer = setTimeout(() => {
        if (hasHydrated.current) {
          setIsLoading(true)
        }
      }, 500)

      const searchQuery = qs.stringify(
        {
          depth: 1,
          limit,
          page,
          sort,
          where: {
            ...(categoryFilters && categoryFilters?.length > 0
              ? {
                  categories: {
                    in:
                      typeof categoryFilters === 'string'
                        ? [categoryFilters]
                        : categoryFilters.map((cat: string) => cat).join(','),
                  },
                }
              : {}),
          },
        },
        { encode: false },
      )

      const makeRequest = async () => {
        try {
          const req = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/${relationTo}?${searchQuery}`,
          )

          const json = await req.json()
          clearTimeout(timer)

          const { docs } = json as { docs: Product[] }

          if (docs && Array.isArray(docs)) {
            setResults(json)
            setIsLoading(false)
            if (typeof onResultChange === 'function') {
              onResultChange(json)
            }
          }
        } catch (err) {
          // console.warn(err)
          setIsLoading(false)
          setError(`Unable to load "${relationTo} archive" data at this time.`)
        }

        isRequesting.current = false
        hasHydrated.current = true
      }

      void makeRequest()
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [page, categoryFilters, relationTo, onResultChange, sort, limit, populateBy])

  return (
    <div className={[classes.collectionArchive, className].filter(Boolean).join(' ')}>
      <div className={classes.scrollRef} ref={scrollRef} />

      {!isLoading && error && <div>{error}</div>}
      <Fragment>
        {showPageRange !== false && populateBy !== 'selection' && (
          <div className={classes.pageRange}>
            <PageRange
              collection={relationTo}
              currentPage={results.page}
              limit={limit}
              totalDocs={results.totalDocs}
            />
          </div>
        )}
        <div>
          <div className={classes.grid}>
            {results.docs?.map((result, index) => {
              if (typeof result === 'object' && result !== null) {
                const { slug, title, meta, price, travelDetails, benefits, isPackage } =
                  result as Product

                const imageUrl =
                  typeof meta.image !== 'string' && meta.image?.url
                    ? meta.image.url
                    : '/placeholder.jpg'

                const formatDate = (dateStr: string) => {
                  const date = new Date(dateStr)
                  return date.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                }

                // If travelDates are available
                const departureDateFormatted = travelDetails?.travelDates.departureDate
                  ? formatDate(travelDetails?.travelDates.departureDate)
                  : ''
                const arrivalDateFormatted = travelDetails?.travelDates.returnDate
                  ? formatDate(travelDetails?.travelDates.returnDate)
                  : ''

                return isPackage ? (
                  <TravelCard
                    key={slug}
                    slug={slug}
                    title={title}
                    imageUrl={imageUrl}
                    price={price}
                    originalPrice={travelDetails.originalPrice}
                    travelDates={`${departureDateFormatted} - ${arrivalDateFormatted}`}
                    destination={travelDetails.destinations.map(dest => dest.city).join(', ')}
                    hotel={travelDetails.destinations
                      .map(dest => dest.hotels.map(des => des.name))
                      .join(', ')}
                    hotelStars={travelDetails.destinations[0].hotels[0].stars}
                    tags={travelDetails.tags.slice(0, 2).map(item => item.tag)}
                    benefits={benefits.slice(0, 3).map(item => item.benefit)}
                  />
                ) : (
                  <Card doc={result} relationTo={relationTo} showCategories />
                )
              }
              return null
            })}
          </div>
          {results.totalPages > 1 && populateBy !== 'selection' && (
            <Pagination
              className={classes.pagination}
              onClick={setPage}
              page={results.page}
              totalPages={results.totalPages}
            />
          )}
        </div>
      </Fragment>
    </div>
  )
}
