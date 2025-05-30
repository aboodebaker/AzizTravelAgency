'use client'

import React from 'react'
import Link from 'next/link'

import { Header as HeaderType } from '../../../../payload/payload-types'
import { useAuth } from '../../../_providers/Auth'
import { Button } from '../../Button'
import { CartLink } from '../../CartLink'
import { CMSLink } from '../../Link'

import classes from './index.module.scss'

export const HeaderNav: React.FC<{ header: HeaderType }> = ({ header }) => {
  const navItems = header?.navItems || []
  const { user } = useAuth()

  return (
    <nav className={[classes.nav, user === undefined && classes.hide].filter(Boolean).join(' ')}>
      {navItems.map(({ link }, i) => {
        return <CMSLink key={i} {...link} className={classes.white} />
      })}
      {user ? <></> : <CartLink className={classes.white} />}
      {user && (
        <Link href="/account" className={classes.white}>
          Account
        </Link>
      )}
      {!user && (
        <Button
          el="link"
          href="login"
          label="Login"
          appearance="primary"
          onClick={() => {
            window.location.href = '/login'
          }}
          className={classes.white}
          invert={true}
        />
      )}
      {user ? <CartLink className={classes.white} /> : <></>}
    </nav>
  )
}
