'use client'

import { useTranslations } from 'next-intl'
import type { Car } from '@/lib/types'

export default function CarDetails({ car, locale }: { car: Car; locale: string }) {
  const t = useTranslations('cars')
  const description = locale === 'ar' ? car.descriptionAr : car.description
  const amenities = locale === 'ar' ? car.amenitiesAr : car.amenities
  const cancellation = locale === 'ar' ? car.cancellationPolicyAr : car.cancellationPolicy

  return (
    <div className="text-sm text-stone-600 space-y-3">
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
  )
}
