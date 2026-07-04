'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import CarCard from '@/components/CarCard'
import CurrencyToggle from '@/components/CurrencyToggle'
import type { Car, Destination, Settings } from '@/lib/types'

export default function CarsPage() {
  const t = useTranslations('cars')
  const locale = useLocale()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || ''
  const to = searchParams.get('to') || ''
  const date = searchParams.get('date') || ''
  const pax = searchParams.get('pax') || '1'

  const [cars, setCars] = useState<Car[]>([])
  const [destination, setDestination] = useState<Destination | null>(null)
  const [settings, setSettings] = useState<Settings | null>(null)
  const [currency, setCurrency] = useState<'JOD' | 'USD' | 'EUR' | 'SAR'>('JOD')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [carsRes, destsRes, settingsRes] = await Promise.all([
        fetch('/api/cars'),
        fetch('/api/destinations'),
        fetch('/api/settings'),
      ])
      const carsData = await carsRes.json()
      const destsData = await destsRes.json()
      const settingsData = await settingsRes.json()
      setCars(carsData.filter((c: Car) => c.active))
      setSettings(settingsData)
      if (from && to) {
        const dest = destsData.find(
          (d: Destination) =>
            d.from.toLowerCase() === from.toLowerCase() && d.to.toLowerCase() === to.toLowerCase()
        )
        setDestination(dest || null)
      }
      setLoading(false)
    }
    load()
  }, [from, to])

  if (loading) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center">
        <div className="text-stone-500 text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sand py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-night">{t('title')}</h1>
            {from && to && (
              <p className="text-stone-500 mt-1">
                {from} → {to} {date && `• ${date}`} {pax && `• ${pax} pax`}
              </p>
            )}
          </div>
          <CurrencyToggle value={currency} onChange={setCurrency} />
        </div>

        {!from || !to ? (
          <p className="text-stone-500 text-center py-20">{t('selectRoute')}</p>
        ) : !destination ? (
          <p className="text-stone-500 text-center py-20">{t('noCarsFound')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {cars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                destination={destination}
                currency={currency}
                rates={settings?.rates || { USD: 1.41, EUR: 1.30, SAR: 5.29 }}
                date={date}
                pax={pax}
                locale={locale}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
