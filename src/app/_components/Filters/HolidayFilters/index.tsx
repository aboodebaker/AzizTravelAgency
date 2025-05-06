/* eslint-disable function-paren-newline */
import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import DateDropdown from '../DateDropdown'
import FilterButton from '../FilterButton'
import SortDropdown from '../SortDropdown'

const HolidayFilters = () => {
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
  const [sortValue, setSortValue] = useState('popular')
  const [dateValue, setDateValue] = useState('2025-06')

  // Handlers
  const handleFilterClick = filterValue => {
    setActiveFilters(prev =>
      prev.includes(filterValue) ? prev.filter(v => v !== filterValue) : [...prev, filterValue],
    )
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
          <SortDropdown options={sortOptions} value={sortValue} onChange={setSortValue} />
          <DateDropdown options={dateOptions} value={dateValue} onChange={setDateValue} />
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
