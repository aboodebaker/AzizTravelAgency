/* eslint-disable function-paren-newline */
import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { useFilter } from '../../../_providers/Filter'
import DateDropdown from '../DateDropdown'
import FilterButton from '../FilterButton'
import SortDropdown from '../SortDropdown'

const HolidayFilters = () => {
  const { date, setDate, sort, setSort, tags, setTags } = useFilter()
  // Filter data
  const sortOptions = [
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Most Popular', value: 'popular' },
    { label: 'Best Rated', value: 'rating' },
    { label: 'Duration: Short to Long', value: 'duration_asc' },
    { label: 'Duration: Long to Short', value: 'duration_desc' },
  ]

  const dateOptions = [
    { label: 'June 2025', value: '2025-06' },
    { label: 'July 2025', value: '2025-07' },
    { label: 'August 2025', value: '2025-08' },
    { label: 'September 2025', value: '2025-09' },
    { label: 'October 2025', value: '2025-10' },
    { label: 'November 2025', value: '2025-11' },
    { label: 'December 2025', value: '2025-12' },
    { label: 'January 2026', value: '2026-01' },
  ]

  const filterOptions = [
    { label: 'Adults Only', value: 'adults_only' },
    { label: 'Family & Kids', value: 'family' },
    { label: 'On Sale', value: 'sale' },
    { label: 'Beach', value: 'beach' },
    { label: 'Romantic & Honeymoon', value: 'romantic' },
    { label: 'All Inclusive', value: 'all_inclusive' },
    { label: 'Relax & Recharge', value: 'relax' },
    { label: 'Adventure', value: 'adventure' },
    { label: 'City Break', value: 'city' },
  ]

  // State
  const [activeFilters, setActiveFilters] = useState([])

  // Handlers
  const handleFilterClick = (value: string) => {
    setActiveFilters(prevFilters => {
      if (prevFilters.includes(value)) {
        return prevFilters.filter(filter => filter !== value) // Remove tag if it's already active
      } else {
        return [...prevFilters, value] // Add tag to active filters
      }
    })

    // Update the tags in context
    setTags(prevTags => {
      if (prevTags.includes(value)) {
        return prevTags.filter(tag => tag !== value)
      } else {
        return [...prevTags, value]
      }
    })
  }

  // Styles
  const styles = {
    container: {
      width: '100%',
      fontFamily: 'Arial, sans-serif',
    },
    title: {
      fontSize: '36px',
      fontWeight: 'bold',
      marginBottom: '24px',
    },
    filtersContainer: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      alignItems: 'center',
      gap: '12px',
      marginBottom: '24px',
    },
    dropdownsContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    filtersScrollContainer: {
      display: 'flex',
      gap: '8px',
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
      scrollbarWidth: 'thin', // For Firefox
      msOverflowStyle: '-ms-autohiding-scrollbar', // For IE and Edge
      padding: '4px 0', // Add some padding for better UX
      // Custom scrollbar styling
      '::-webkit-scrollbar': {
        height: '6px',
      },
      '::-webkit-scrollbar-track': {
        background: '#f1f1f1',
        borderRadius: '10px',
      },
      '::-webkit-scrollbar-thumb': {
        background: '#cccccc',
        borderRadius: '10px',
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: '#999999',
      },
    },
    statusText: {
      fontSize: '14px',
      color: '#718096',
    },
  }

  return (
    <div style={styles.container}>
      <div style={styles.filtersContainer}>
        <div style={styles.dropdownsContainer}>
          <SortDropdown options={sortOptions} value={sort} onChange={setSort} />
          <DateDropdown options={dateOptions} value={date} onChange={setDate} />
        </div>

        {/* Naturally scrollable filter buttons container */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'thin',
            msOverflowStyle: '-ms-autohiding-scrollbar',
            padding: '4px 0',
            maxWidth: '100%', // Make room for the dropdowns
            flexGrow: 1,
          }}
        >
          {filterOptions.map(option => (
            <FilterButton
              key={option.value}
              label={option.label}
              active={activeFilters.includes(option.value)}
              onClick={() => handleFilterClick(option.value)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default HolidayFilters
