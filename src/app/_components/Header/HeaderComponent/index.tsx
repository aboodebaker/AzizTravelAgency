'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Header } from '../../../../payload/payload-types'
import { noHeaderFooterUrls } from '../../../constants'
import { Gutter } from '../../Gutter'
import HeaderMobileNav from '../MobileNav'
import { HeaderNav } from '../Nav'
import { useIsMobile } from './isMobile'

import classes from './index.module.scss'

const HeaderComponent = ({ header }: { header: Header }) => {
  const pathname = usePathname()
  const isMobile = useIsMobile()

  return (
    <nav
      className={[
        classes.header,
        noHeaderFooterUrls.includes(pathname) && classes.hide,
        classes.white,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Gutter className={classes.wrap}>
        <Link href={'/'} className={(classes.logoLink, classes.white)}>
          {/* <Image src="/Logo.jpg" alt="logo" className={classes.logo} width={100} height={20} /> */}
          <h4 className={classes.title}>Travel Luxury</h4>
        </Link>
        {isMobile ? <HeaderMobileNav header={header} /> : <HeaderNav header={header} />}
      </Gutter>
    </nav>
  )
}

export default HeaderComponent
