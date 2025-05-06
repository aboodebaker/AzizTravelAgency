'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'

import { Category } from '../../../payload/payload-types'
import { useFilter } from '../../_providers/Filter'
import { HR } from '../HR'
import { RadioButton } from '../Radio'
import HolidayFilters from './HolidayFilters'

import classes from './index.module.scss'

const Filters = ({ categories }: { categories: Category[] }) => {
  const { categoryFilters, sort, setCategoryFilter, setSort } = useFilter()

  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryFilters)
  const [searchTerm, setSearchTerm] = useState('')

  const handleCategories = (categoryId: string) => {
    const updated = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId]

    setSelectedCategories(updated)
    setCategoryFilter(updated)
  }

  // Always show selected, even if they don't match the search
  const selected = categories.filter(cat => selectedCategories.includes(cat.id))
  const unselected = categories.filter(
    cat =>
      !selectedCategories.includes(cat.id) &&
      cat.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const renderCategory = (category: Category, isSelected: boolean) => {
    const imageSrc =
      typeof category.media === 'string'
        ? category.media
        : category.media?.url || '/placeholder.jpg'

    return (
      <Link
        href="#"
        key={category.id}
        className={`${classes.promoLink} ${isSelected ? classes.selected : ''}`}
        onClick={() => handleCategories(category.id)}
      >
        <div className={classes.imageWrapper}>
          <img
            src={imageSrc}
            alt={
              typeof category.media === 'object' && category.media?.alt
                ? category.media.alt
                : category.title
            }
            className={classes.image}
          />
        </div>
        <span className={classes.name}>{category.title}</span>
      </Link>
    )
  }

  return (
    <div className={classes.filters}>
      <h3 className={classes.title}>Destinations</h3>
      <input
        type="text"
        placeholder="Search categories..."
        className={classes.searchInput}
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      <div className={classes.categories}>
        {selected.map(c => renderCategory(c, true))}
        {selected.length > 0 && unselected.length > 0 && <div className={classes.inlineHR} />}
        {unselected.map(c => renderCategory(c, false))}
      </div>

      <div className={classes.categories}>
        <HolidayFilters />
      </div>
    </div>
  )
}

export default Filters
