import Image from 'next/image'
import Link from 'next/link'

import { Button } from '../Button'

import './TravelCard.css'

interface TravelCardProps {
  title: string
  imageUrl: string
  price: number
  originalPrice?: number
  travelDates: string
  destination: string
  hotel?: string
  hotelStars?: number
  tags?: string[]
  benefits?: string[]
  slug: string
}

export const TravelCard = ({
  title,
  imageUrl,
  price,
  originalPrice,
  travelDates,
  destination,
  hotel,
  hotelStars,
  tags,
  benefits,
  slug,
}: TravelCardProps) => {
  return (
    <div className="travel-card">
      <div className="travel-card-image">
        <Image src={imageUrl} alt={title} fill className="travel-card-img" />
        {tags?.length ? (
          <div className="travel-card-tags">
            {tags.slice(0, 2).map(tag => (
              <span key={tag} className="travel-card-tag">
                {tag.replace('_', ' ').toUpperCase()}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="travel-card-content">
        <h3 className="travel-card-title">{title}</h3>
        <p className="travel-card-destination">{destination}</p>

        {hotel && (
          <div className="travel-card-hotel">
            <span>{hotel}</span>
            {hotelStars && <span className="travel-card-stars">{'★'.repeat(hotelStars)}</span>}
          </div>
        )}

        <p className="travel-card-dates">{travelDates}</p>

        <div className="travel-card-price">
          {originalPrice && originalPrice > price ? (
            <>
              <span className="travel-card-original-price">${originalPrice.toLocaleString()}</span>
              <span>${price.toLocaleString()}</span>
            </>
          ) : (
            <span>${price.toLocaleString()}</span>
          )}
        </div>

        {benefits?.length ? (
          <ul className="travel-card-benefits">
            {benefits.slice(0, 3).map((benefit, idx) => (
              <li key={idx} className="travel-card-benefit">
                <span className="checkmark">✓</span> {benefit}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="travel-card-button">
          <Link href={`/products/${slug}`}>
            <Button appearance="primary" className="travel-card-button">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
