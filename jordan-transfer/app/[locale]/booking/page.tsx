'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import Image from 'next/image'
import type { Car, Destination, Settings } from '@/lib/types'
import { getCarPrice } from '@/lib/pricing'

export default function BookingPage() {
  const searchParams = useSearchParams()
  const locale = useLocale() as 'en' | 'ar'
  const t = useTranslations()

  const carId = searchParams.get('carId') || ''
  const from = searchParams.get('from') || ''
  const to = searchParams.get('to') || ''
  const date = searchParams.get('date') || ''
  const pax = searchParams.get('pax') || '1'
  const currency = (searchParams.get('currency') || 'JOD') as 'JOD' | 'USD' | 'EUR' | 'SAR'

  const [car, setCar] = useState<Car | null>(null)
  const [destination, setDestination] = useState<Destination | null>(null)
  const [settings, setSettings] = useState<Settings | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [imgError, setImgError] = useState(false)

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
      setCar(carsData.find((c: Car) => c.id === carId) || null)
      setDestination(
        destsData.find(
          (d: Destination) =>
            d.from.toLowerCase() === from.toLowerCase() &&
            d.to.toLowerCase() === to.toLowerCase()
        ) || null
      )
      setSettings(settingsData)
    }
    load()
  }, [carId, from, to])

  const price =
    car && destination && settings
      ? getCarPrice(car, destination, currency, settings.rates)
      : 0

  const priceJOD =
    car && destination && settings
      ? getCarPrice(car, destination, 'JOD', settings.rates)
      : 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!car || !settings) return
    setSubmitting(true)

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: name,
        customerPhone: phone,
        from,
        to,
        carId: car.id,
        carName: locale === 'ar' ? car.nameAr : car.name,
        date,
        passengers: Number(pax),
        priceJOD,
        currency,
        priceConverted: price,
        locale,
      }),
    })

    if (res.ok) {
      const { whatsappUrl } = await res.json()
      window.location.href = whatsappUrl
    }
    setSubmitting(false)
  }

  if (!car || !destination || !settings) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center">
        <div className="text-stone-500">Loading...</div>
      </div>
    )
  }

  const imgSrc = `https://source.unsplash.com/featured/800x400?${car.unsplashQuery}`
  const carName = locale === 'ar' ? car.nameAr : car.name

  return (
    <div className="min-h-screen bg-sand py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-night mb-8">
          {locale === 'ar' ? 'تأكيد الحجز' : 'Confirm Booking'}
        </h1>

        <div className="bg-white rounded-xl border border-sand-dark p-6 mb-6">
          <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
            {!imgError ? (
              <Image
                src={imgSrc}
                alt={carName}
                fill
                className="object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full bg-terra/10 flex items-center justify-center text-4xl font-bold text-terra">
                {car.type[0]}
              </div>
            )}
          </div>
          <h2 className="text-xl font-bold text-night">{carName}</h2>
          <div className="mt-3 space-y-1 text-stone-600">
            <div className="flex justify-between">
              <span>{locale === 'ar' ? 'من' : 'From'}</span>
              <span className="font-medium">{from}</span>
            </div>
            <div className="flex justify-between">
              <span>{locale === 'ar' ? 'إلى' : 'To'}</span>
              <span className="font-medium">{to}</span>
            </div>
            <div className="flex justify-between">
              <span>{locale === 'ar' ? 'التاريخ' : 'Date'}</span>
              <span className="font-medium">{date}</span>
            </div>
            <div className="flex justify-between">
              <span>{locale === 'ar' ? 'الركاب' : 'Passengers'}</span>
              <span className="font-medium">{pax}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-terra border-t border-sand-dark pt-2 mt-2">
              <span>{locale === 'ar' ? 'السعر' : 'Price'}</span>
              <span>{price} {currency}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-sand-dark p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-night mb-1">
              {locale === 'ar' ? 'الاسم الكامل' : 'Full Name'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-sand-dark rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-terra"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-night mb-1">
              {locale === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 border border-r-0 border-sand-dark rounded-l-lg bg-sand text-stone-500 text-sm">
                +962
              </span>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 border border-sand-dark rounded-r-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-terra"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-terra text-white font-semibold py-3 rounded-lg hover:bg-terra-dark transition-colors disabled:opacity-50"
          >
            {submitting
              ? locale === 'ar' ? 'جاري الإرسال...' : 'Sending...'
              : locale === 'ar' ? 'تأكيد عبر واتساب' : 'Confirm via WhatsApp'}
          </button>
        </form>
      </div>
    </div>
  )
}
