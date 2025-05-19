import { Button } from '../Button'
import FeatureCheck from './FeatureCheck'

import classes from './index.module.scss'

export interface Feature {
  text: string
  included: boolean
  emphasis?: boolean
}

interface PricingCardProps {
  title: string
  price: { monthly: number; annual: number }
  description: string
  features: Feature[]
  isPopular?: boolean
  isAnnual: boolean
  ctaText: string
  ctaVariant?: 'default' | 'outline'
}

const PricingCard = ({
  title,
  price,
  description,
  features,
  isPopular = false,
  isAnnual,
  ctaText,
}: PricingCardProps) => {
  const currentPrice = isAnnual ? price.annual : price.monthly

  return (
    <div className={(classes.pricingCard, isPopular && classes.popular)}>
      {isPopular && (
        <span className={`${classes.popularBadge} ${classes.animateFloat}`}>Most Popular</span>
      )}

      <div className={classes.header}>
        <h3 className={classes.title}>{title}</h3>
        <p className={classes.description}>{description}</p>
      </div>

      <div className={classes.priceSection}>
        <div className={classes.priceRow}>
          <span className={classes.price}>${currentPrice}</span>
          <span className={classes.per}>/{isAnnual ? 'year' : 'month'}</span>
        </div>
        {isAnnual && <p className={classes.monthlyNote}>(${price.monthly} monthly)</p>}
      </div>

      <div className={classes.featureList}>
        {features.map((feature, index) => (
          <FeatureCheck
            key={index}
            included={feature.included}
            text={feature.text}
            emphasis={feature.emphasis}
          />
        ))}
      </div>

      <div className={classes.cta}>
        <Button className={classes.fullWidth} appearance="primary">
          {ctaText}
        </Button>
      </div>
    </div>
  )
}

export default PricingCard
