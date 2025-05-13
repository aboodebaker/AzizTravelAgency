import React from 'react'

import { Page } from '../../../payload/payload-types'
import { Gutter } from '../../_components/Gutter'
import { CMSLink } from '../../_components/Link'
import RichText from '../../_components/RichText'

import classes from './index.module.scss'

type Props = Extract<Page['layout'][0], { blockType: 'content' }> & {
  id?: string
}

export const ContentBlock: React.FC<Props> = props => {
  const { columns, invertBackground, id } = props

  return (
    <Gutter
      className={[
        classes.content,
        // invertBackground ? classes.invert : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={classes.grid}>
        {columns?.map((col, index) => {
          const {
            size = 'full',
            richText,
            enableLink,
            link,
            media,
            mediaPosition = 'right',
            id: colId,
          } = col

          const columnClass = [
            classes.column,
            classes[`column--${size}`],
            classes[`media--${mediaPosition}`],
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <div key={index} className={classes.row} id={colId || undefined}>
              {media && mediaPosition === 'left' && (
                <div className={classes.media}>
                  <img
                    src={typeof media === 'string' ? media : `/media/${media?.filename}`}
                    alt=""
                  />
                </div>
              )}
              <div className={columnClass}>
                <RichText content={richText} />
                {enableLink && link && <CMSLink className={classes.link} {...link} />}
              </div>
              {media && mediaPosition === 'right' && (
                <div className={classes.media}>
                  <img
                    src={typeof media === 'string' ? media : `/media/${media?.filename}`}
                    alt=""
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Gutter>
  )
}
