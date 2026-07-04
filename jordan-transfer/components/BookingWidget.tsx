'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import type { Destination } from '@/lib/types'

export default function BookingWidget({ locale }: { locale: string }) {
  const t = useTranslations('booking')
  const router = useRouter()
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [pax, setPax] = useState('1')

  useEffect(() => {
    fetch('/api/destinations').then(r => r.json()).then(setDestinations)
  }, [])

  const froms = [...new Set(destinations.map(d => d.from))]
  const tos = [...new Set(destinations.filter(d => !from || d.from === from).map(d => d.to))]

  const today = new Date().toISOString().split('T')[0]

  function swap() {
    const tmp = from
    setFrom(to)
    setTo(tmp)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!from || !to || !date) return
    router.push(`/${locale}/cars?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}&pax=${pax}`)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 shadow-xl text-night">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-stone-500 mb-1">{t('pickup')}</label>
          <select
            value={from}
            onChange={e => { setFrom(e.target.value); setTo('') }}
            required
            className="w-full border border-sand-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terra"
          >
            <option value="">Select pickup...</option>
            {froms.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <div className="flex justify-center">
          <button type="button" onClick={swap} title={t('swap')}
            className="p-2 bg-sand rounded-full hover:bg-sand-dark transition-colors">
            <svg className="w-4 h-4 text-terra" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-stone-500 mb-1">{t('dropoff')}</label>
          <select
            value={to}
            onChange={e => setTo(e.target.value)}
            required
            className="w-full border border-sand-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terra"
          >
            <option value="">Select drop-off...</option>
            {tos.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">{t('date')}</label>
          <input
            type="date"
            value={date}
            min={today}
            onChange={e => setDate(e.target.value)}
            required
            className="w-full border border-sand-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terra"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">{t('passengers')}</label>
          <select value={pax} onChange={e => setPax(e.target.value)}
            className="w-full border border-sand-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terra">
            {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <button type="submit"
            className="w-full bg-terra text-white font-semibold py-2 rounded-lg hover:bg-terra-dark transition-colors text-sm">
            {t('showCars')}
          </button>
        </div>
      </div>
    </form>
  )
}
