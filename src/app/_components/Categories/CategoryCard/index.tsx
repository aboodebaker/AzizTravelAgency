'use client'
import React from 'react'
import Link from 'next/link'

import { Category, Media } from '../../../../payload/payload-types'
import { useFilter } from '../../../_providers/Filter'

import classes from './index.module.scss'

const CategoryCard = ({
  category,
  variant,
}: {
  category: Category
  variant?: 'large' | 'wide' | 'tall'
}) => {
  const media = category.media as Media
  const { setCategoryFilter } = useFilter()

  return (
    <Link
      href="/products"
      className={`${classes.card} ${variant ? classes[variant] : ''}`}
      onClick={() => setCategoryFilter([category.id])}
    >
      <div className={classes.background} style={{ backgroundImage: `url(${media?.url})` }} />
      <p className={classes.title}>{category.title}</p>
    </Link>
  )
}

export default CategoryCard
