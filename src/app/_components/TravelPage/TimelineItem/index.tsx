import React from 'react'
import { Car, Hotel, Plane, Ship, Train } from 'lucide-react'

import classes from './index.module.scss'

export type ItemType = 'flight' | 'hotel' | 'car' | 'ferry' | 'train'

interface TimelineItemProps {
  type: ItemType
  title: string
  subtitle?: string
  date: string
  time?: string
  location: string
  locationDetail?: string
  className?: string
  isActive?: boolean
}

const TimelineItem = ({
  type,
  title,
  subtitle,
  date,
  time,
  location,
  locationDetail,
  className,
  isActive = false,
}: TimelineItemProps) => {
  const getIcon = () => {
    switch (type) {
      case 'flight':
        return <Plane className={classes.icon} />
      case 'hotel':
        return <Hotel className={classes.icon} />
      case 'car':
        return <Car className={classes.icon} />
      case 'ferry':
        return <Ship className={classes.icon} />
      case 'train':
        return <Train className={classes.icon} />
      default:
        return <Plane className={classes.icon} />
    }
  }

  return (
    <div className={`${classes.container} ${className || ''}`}>
      <div className={classes.iconContainer}>
        <div className={`${classes.iconWrapper} ${isActive ? classes.activeIcon : ''}`}>
          {getIcon()}
        </div>
      </div>
      <div className={classes.content}>
        <h3 className={classes.title}>{title}</h3>
        {subtitle && <p className={classes.subtitle}>{subtitle}</p>}
        <div className={classes.infoContainer}>
          <div className={classes.infoGroup}>
            <div className={classes.infoValue}>
              {date
                ? new Date(date).toLocaleDateString(undefined, {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'N/A'}
            </div>
            {time && (
              <div className={classes.infoDetail}>
                {new Date(time).toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            )}
          </div>
          <div className={classes.infoGroup}>
            <div className={classes.infoLabel}>Location</div>
            <div className={classes.infoValue}>{location}</div>
            {locationDetail && <div className={classes.infoDetail}>{locationDetail}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimelineItem
