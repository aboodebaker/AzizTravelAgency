'use client'

import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'

import { Header } from '../../../../payload/payload-types'
import { useAuth } from '../../../_providers/Auth'
import { Button } from '../../Button'
import { CartLink } from '../../CartLink'
import { CMSLink } from '../../Link'

import classes from './index.module.scss'

const HeaderMobileNav: React.FC<{ header: Header }> = ({ header }) => {
  const [isOpen, setIsOpen] = useState(false)
  const navItems = header?.navItems || []
  const { user } = useAuth()

  const closeMenu = () => setIsOpen(false)

  return (
    <>
      <button className={classes.menuButton} onClick={() => setIsOpen(true)} aria-label="Open menu">
        <Menu size={28} />
      </button>

      {isOpen && (
        <>
          <div className={classes.backdrop} onClick={closeMenu} />

          <div className={classes.drawer}>
            <button className={classes.closeButton} onClick={closeMenu} aria-label="Close menu">
              <X size={28} />
            </button>

            <nav className={classes.menu}>
              {navItems.map(({ link }, i) => (
                <CMSLink key={i} {...link} className={classes.menuLink} />
              ))}
              {user ? <></> : <CartLink className={classes.menuLink} />}
              {user && (
                <Link href="/account" className={classes.menuLink}>
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
              {user ? <CartLink className={classes.menuLink} /> : <></>}
            </nav>
          </div>
        </>
      )}
    </>
  )
}

export default HeaderMobileNav
