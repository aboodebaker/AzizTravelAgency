'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Footer, Media } from '../../../../payload/payload-types'
import { inclusions, noHeaderFooterUrls } from '../../../constants'
import { Button } from '../../Button'
import { Gutter } from '../../Gutter'

import classes from './index.module.scss'

const FooterComponent = ({ footer }: { footer: Footer }) => {
  const pathname = usePathname()
  const navItems = footer?.navItems || []

  const articles = [
    {
      title: 'Bucket List Family Holidays to Book This Year',
      description:
        "We've pulled together some of the best family holiday destinations from across the globe, because every type of family deserves at least one truly...",
      image: '/images/family-holiday.jpg',
    },
    {
      title: 'Qatar Bucket List: A Stopover Worth Staying For',
      description:
        'Qatar is possibly one of the best stopover destinations in the world. Here’s why Qatar should be on your travel bucket list – for at least a coup...',
      image: '/images/qatar-stopover.jpg',
    },
    {
      title: '10 of The Best Places to Propose Around the World',
      description:
        'A proposal is one of life’s biggest moments, and where you choose to pop the question can make it even more unforgettable...',
      image: '/images/proposal.jpg',
    },
    {
      title: 'Best Family Holidays with Teenagers in 2025: Where to Go',
      description:
        'Planning a holiday with teenagers can feel like a balancing act. Here are our top picks for a family trip with teens...',
      image: '/assets/images/image-1.svg',
    },
  ]

  return (
    <footer className={noHeaderFooterUrls.includes(pathname) ? classes.hide : ''}>
      {/* <Gutter>
        <ul className={classes.inclusions}>
          {inclusions.map((inclusion) => (
            <li key={inclusion.title}>
              <Image
                src={inclusion.icon}
                alt={inclusion.title}
                width={36}
                height={36}
                className={classes.icon}
              />
              <h5 className={classes.title}>{inclusion.title}</h5>
              <p>{inclusion.description}</p>
            </li>
          ))}
        </ul>
      </Gutter> */}

      {/* New Window Seat Section */}

      <div className={classes.windowSeat}>
        <h2 className={classes.sectionTitle}>
          {footer?.windowSeatTitle || 'New views from the Window Seat'}
        </h2>
        <p className={classes.sectionSubtitle}>
          {footer?.windowSeatSubtitle || 'Get the latest inspo before you touch down'}
        </p>
        <div className={classes.articles}>
          {footer.windowSeatArticles?.map((article, index) => {
            const media = article.image as Media
            return (
              <div key={index} className={classes.articleCard}>
                <div className={classes.articleImageWrapper}>
                  <Image
                    src={media?.url || ''}
                    alt={article.title}
                    width={400}
                    height={500}
                    className={classes.articleImage}
                  />
                </div>
                <h3 className={classes.articleTitle}>{article.title}</h3>
                <p className={classes.articleDescription}>{article.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer Bottom */}
      <div className={classes.footer}>
        <Gutter>
          <div className={classes.wrap}>
            <Link href="/">
              <h3 className={classes.logo}>Travel Luxury</h3>
            </Link>
            <div className={classes.copyrightWrapper}>
              <p>{footer?.copyright}</p>
              <a href="https://yaseenaboobaker.com" target="_blank" rel="noopener noreferrer">
                <p className={classes.me}>Design by: YA Projects</p>
              </a>
            </div>

            <div className={classes.socialLinks}>
              {navItems.map((item, index) => {
                const icon = item?.link?.icon as Media
                const href = item?.link?.label || '#'
                const key = item?.id || `${href}-${index}`

                return (
                  <Link href={href} key={key}>
                    <Image
                      src={icon?.url || '/default-icon.png'}
                      alt={href}
                      width={24}
                      height={24}
                      className={classes.socialIcon}
                    />
                  </Link>
                )
              })}
            </div>
          </div>
        </Gutter>
      </div>
    </footer>
  )
}

export default FooterComponent
