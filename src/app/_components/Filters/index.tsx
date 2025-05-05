'use client'

import React, { useState } from 'react'
import Link from 'next/link'

import { Category } from '../../../payload/payload-types'
import { useFilter } from '../../_providers/Filter'
import { HR } from '../HR'
import { RadioButton } from '../Radio'

import classes from './index.module.scss'

const Filters = ({ categories }: { categories: Category[] }) => {
  const { categoryFilters, sort, setCategoryFilter, setSort } = useFilter()

  // State to track the selected categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryFilters)

  const handleCategories = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      // If category is already selected, remove it
      const updatedCategories = selectedCategories.filter(id => id !== categoryId)
      setSelectedCategories(updatedCategories)
      setCategoryFilter(updatedCategories)
    } else {
      // Otherwise, add it to the selected list
      const updatedCategories = [...selectedCategories, categoryId]
      setSelectedCategories(updatedCategories)
      setCategoryFilter(updatedCategories)
    }
  }

  const handleSort = (value: string) => setSort(value)

  return (
    <div className={classes.filters}>
      <div>
        <h3 className={classes.title}>Destinations</h3>
        <div className={classes.categories}>
          {categories.map(category => {
            const isSelected = selectedCategories.includes(category.id)

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
                <span className={`${classes.name} ${isSelected ? classes.selected : ''}`}>
                  {category.title}
                </span>
              </Link>
            )
          })}
        </div>
        <div className={classes.categories}>
          <RadioButton
            label="Latest"
            value="createdAt"
            isSelected={sort === 'createdAt'}
            onRadioChange={handleSort}
            groupName="sort"
          />
          <RadioButton
            label="Oldest"
            value="-createdAt"
            isSelected={sort === '-createdAt'}
            onRadioChange={handleSort}
            groupName="sort"
          />
        </div>
      </div>
    </div>
  )
}

export default Filters
