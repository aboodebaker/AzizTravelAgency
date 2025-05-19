import { Check, X } from 'lucide-react'

import classes from './index.module.scss'

interface FeatureCheckProps {
  included: boolean
  text: string
  emphasis?: boolean
}

const FeatureCheck = ({ included, text, emphasis = false }: FeatureCheckProps) => {
  return (
    <div className={classes.featureItem}>
      {included ? (
        <Check className={(classes.icon, classes.included)} />
      ) : (
        <X className={(classes.icon, classes.excluded)} />
      )}
      <span className={`${classes.text} ${emphasis ? classes.emphasis : classes.muted}`}>
        {text}
      </span>
    </div>
  )
}

export default FeatureCheck
