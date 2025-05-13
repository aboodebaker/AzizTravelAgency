'use client'

import React, { useState } from 'react'

import { useFilter } from '../../../_providers/Filter'
import DateDropdown from '../DateDropdown'
import FilterButton from '../FilterButton'
import SortDropdown from '../SortDropdown'

import classes from '../index.module.scss' // Create this to match category styles if needed

const HolidayFilters = () => {
  const { date, setDate, sort, setSort, tags, setTags } = useFilter()

  const [selectedTags, setSelectedTags] = useState<string[]>(tags)
  const [searchTerm, setSearchTerm] = useState('')

  const allTagOptions = [
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

  const handleTagToggle = (value: string) => {
    const updated = selectedTags.includes(value)
      ? selectedTags.filter(tag => tag !== value)
      : [...selectedTags, value]

    setSelectedTags(updated)
    setTags(updated)
  }

  const selected = allTagOptions.filter(tag => selectedTags.includes(tag.value))
  const unselected = allTagOptions

  return (
    <div className={classes.tagFilters}>
      <h3 className={classes.title}>Tags</h3>
      <input
        type="text"
        placeholder="Search tags..."
        className={classes.searchInput}
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      <div className={classes.tags}>
        {unselected.map(tag => (
          <FilterButton
            key={tag.value}
            label={tag.label}
            active={selected.includes(tag)}
            onClick={() => handleTagToggle(tag.value)}
          />
        ))}
      </div>

      <div className={classes.dropdowns}>
        <DateDropdown
          options={[
            { label: 'May 2025', value: '2025-05' },
            { label: 'June 2025', value: '2025-06' },
            { label: 'July 2025', value: '2025-07' },
            { label: 'August 2025', value: '2025-08' },
            { label: 'September 2025', value: '2025-09' },
            { label: 'October 2025', value: '2025-10' },
            { label: 'November 2025', value: '2025-11' },
            { label: 'December 2025', value: '2025-12' },
            { label: 'January 2026', value: '2026-01' },
          ]}
          value={date}
          onChange={setDate}
        />
      </div>
    </div>
  )
}

export default HolidayFilters
