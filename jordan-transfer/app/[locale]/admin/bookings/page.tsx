'use client'

import { useEffect, useState } from 'react'
import type { Booking } from '@/lib/types'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const TABS = ['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<(typeof TABS)[number]>('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  async function load() {
    const res = await fetch('/api/bookings')
    const data = await res.json()
    setBookings(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function updateStatus(id: string, status: string) {
    await fetch('/api/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    load()
  }

  const filtered = tab === 'all' ? bookings : bookings.filter((b) => b.status === tab)

  if (loading) return <div className="text-stone-500">Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-night mb-6">Bookings</h1>

      <div className="flex gap-2 mb-4 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              tab === t ? 'bg-terra text-white' : 'bg-white border border-sand-dark text-stone-600 hover:bg-sand'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-sand-dark overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-stone-500 border-b border-sand-dark bg-sand">
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Route</th>
              <th className="px-4 py-3 font-medium">Car</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <>
                <tr
                  key={b.id}
                  className="border-b border-sand-dark last:border-0 cursor-pointer hover:bg-sand/50"
                  onClick={() => setExpanded(expanded === b.id ? null : b.id)}
                >
                  <td className="px-4 py-3 font-medium">{b.customerName}</td>
                  <td className="px-4 py-3 text-stone-500">{b.from} → {b.to}</td>
                  <td className="px-4 py-3">{b.carName}</td>
                  <td className="px-4 py-3">{b.date}</td>
                  <td className="px-4 py-3">{b.priceJOD} JOD</td>
                  <td className="px-4 py-3">
                    <select
                      value={b.status}
                      onChange={(e) => { e.stopPropagation(); updateStatus(b.id, e.target.value) }}
                      onClick={(e) => e.stopPropagation()}
                      className={`px-2 py-0.5 rounded-full text-xs font-medium border-0 cursor-pointer ${STATUS_COLORS[b.status]}`}
                    >
                      {TABS.filter(t => t !== 'all').map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
                {expanded === b.id && (
                  <tr key={`${b.id}-detail`} className="bg-sand/30">
                    <td colSpan={6} className="px-4 py-3 text-sm text-stone-600">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div><span className="font-medium">Phone:</span> {b.customerPhone}</div>
                        <div><span className="font-medium">Passengers:</span> {b.passengers}</div>
                        <div><span className="font-medium">Currency:</span> {b.currency}</div>
                        <div><span className="font-medium">Converted:</span> {b.priceConverted} {b.currency}</div>
                        <div><span className="font-medium">Locale:</span> {b.locale}</div>
                        <div><span className="font-medium">Created:</span> {new Date(b.createdAt).toLocaleString()}</div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
