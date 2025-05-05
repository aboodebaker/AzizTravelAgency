import React from 'react'
import Link from 'next/link'

import { Category } from '../../../payload/payload-types'
import CategoryCard from './CategoryCard'

import classes from './index.module.scss'

const Categories = ({ categories }: { categories: Category[] }) => {
  const sortedCategories = [...(categories || [])]
    .filter(category => category.place !== 'none')
    .filter(category => category.place !== 'hilton')

  return (
    <section className={classes.container}>
      <div className={classes.titleWrapper}>
        <h3 className={classes.h3Title}>Shop by Destination</h3>
        <Link href="/products">Show all</Link>
      </div>

      <div className={classes.list}>
        {sortedCategories.map(category => {
          // Use category.place to set the variant
          let variant: 'large' | 'wide' | 'tall' | undefined

          // Set variant based on the "place" field
          switch (category.place) {
            case 'half':
              variant = 'large' // Assuming you want "half" to be large
              break
            case 'tall':
              variant = 'tall'
              break
            case 'horizontal':
              variant = 'wide'
              break
            case 'normal':
              variant = undefined // No variant
              break
            default:
              variant = undefined // Default to no variant if place is "none" or any other value
          }

          return <CategoryCard key={category.id} category={category} variant={variant} />
        })}
      </div>
    </section>
  )
}

export default Categories
