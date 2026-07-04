'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { Car, Destination, Settings } from '@/lib/types'
import { getCarPrice } from '@/lib/pricing'

interface Props {
  car: Car
  destination: Destination
  currency: 'JOD' | 'USD' | 'EUR' | 'SAR'
  rates: Settings['rates']
  date: string
  pax: string
  locale: string
}

export default function CarCard({ car, destination, currency, rates, date, pax, locale }: Props) {
  const t = useTranslations('cars')
  const [expanded, setExpanded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const price = getCarPrice(car, destination, currency, rates)
  const name = locale === 'ar' ? car.nameAr : car.name
  const description = locale === 'ar' ? car.descriptionAr : car.description
  const features = locale === 'ar' ? car.featuresAr : car.features
  const amenities = locale === 'ar' ? car.amenitiesAr : car.amenities
  const cancellation = locale === 'ar' ? car.cancellationPolicyAr : car.cancellationPolicy

  const imgSrc = `https://source.unsplash.com/featured/800x440?${car.unsplashQuery}`

  const bookUrl = `/${locale}/booking?carId=${car.id}&from=${encodeURIComponent(destination.from)}&to=${encodeURIComponent(destination.to)}&date=${date}&pax=${pax}&currency=${currency}`

  return (
    <div className="bg-white border border-sand-dark rounded-xl overflow-hidden flex flex-col">
      <div className="relative w-full h-48">
        {!imgError ? (
          <Image
            src={imgSrc}
            alt={name}
            fill
            className="object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-terra/10 flex items-center justify-center text-5xl font-bold text-terra">
            {car.type[0]}
          </div>
        )}
        <span className="absolute top-3 start-3 bg-night/80 text-white text-xs font-medium px-2 py-1 rounded-full">
          {car.type}
        </span>
        <span className="absolute top-3 end-3 bg-white/90 text-stone-600 text-xs font-medium px-2 py-1 rounded-full">
          {car.year}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-night mb-2">{name}</h3>

        <div className="flex gap-3 text-sm text-stone-500 mb-3">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
            </svg>
            {car.passengers} {t('pax')}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 6h-2.18c.07-.44.18-.88.18-1.34C18 3.01 16.99 2 15.66 2c-.88 0-1.6.48-2.03 1.19L12 5.5 10.37 3.19C9.94 2.48 9.22 2 8.34 2 7.01 2 6 3.01 6 4.34c0 .46.11.9.18 1.34H4c-1.1 0-2 .9-2 2v2.5C2 11.55 2.45 12 3 12v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7c.55 0 1-.45 1-.5V8c0-1.1-.9-2-2-2z"/>
            </svg>
            {car.luggage} {t('bags')}
          </span>
          {car.hasAC && <span className="text-terra text-xs font-medium">{t('ac')}</span>}
          <span className="text-xs">{car.transmission === 'Auto' ? t('auto') : t('manual')}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {features.slice(0, 4).map((f) => (
            <span key={f} className="bg-sand text-stone-600 text-xs px-2 py-0.5 rounded-full">{f}</span>
          ))}
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-2xl font-bold text-terra">{price} {currency}</span>
              <span className="text-stone-400 text-sm ms-1">{t('perTrip')}</span>
            </div>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="text-terra text-sm hover:underline mb-3 block"
          >
            {expanded ? t('lessDetails') : t('moreDetails')}
          </button>

          {expanded && (
            <div className="text-sm text-stone-600 space-y-3 mb-3 border-t border-sand-dark pt-3">
              <p>{description}</p>
              <div>
                <p className="font-medium text-night mb-1">{t('amenities')}</p>
                <ul className="space-y-0.5">
                  {amenities.map((a) => (
                    <li key={a} className="flex items-center gap-1">
                      <span className="text-terra">✓</span> {a}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium text-night mb-1">{t('cancellationPolicy')}</p>
                <p>{cancellation}</p>
              </div>
            </div>
          )}

          <Link
            href={bookUrl}
            className="block w-full text-center bg-terra text-white font-semibold py-2 rounded-lg hover:bg-terra-dark transition-colors text-sm"
          >
            {t('bookNow')}
          </Link>
        </div>
      </div>
    </div>
  )
}
