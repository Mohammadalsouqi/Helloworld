'use client'

import { useEffect, useState } from 'react'
import type { Booking } from '@/lib/types'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/bookings')
      .then((r) => r.json())
      .then((data) => {
        setBookings(data)
        setLoading(false)
      })
  }, [])

  const total = bookings.length
  const revenue = bookings.reduce((s, b) => s + b.priceJOD, 0)
  const earnings = revenue * 0.25
  const recent = [...bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 10)

  if (loading) return <div className="text-stone-500">Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-night mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-sand-dark p-5">
          <p className="text-stone-500 text-sm">Total Bookings</p>
          <p className="text-3xl font-bold text-night">{total}</p>
        </div>
        <div className="bg-white rounded-xl border border-sand-dark p-5">
          <p className="text-stone-500 text-sm">Total Revenue (JOD)</p>
          <p className="text-3xl font-bold text-night">{revenue.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl border border-sand-dark p-5">
          <p className="text-stone-500 text-sm">Platform Earnings (JOD)</p>
          <p className="text-3xl font-bold text-terra">{earnings.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-sand-dark p-5">
        <h2 className="text-lg font-bold text-night mb-4">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-500 border-b border-sand-dark">
                <th className="pb-2 font-medium">Customer</th>
                <th className="pb-2 font-medium">Route</th>
                <th className="pb-2 font-medium">Car</th>
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Price</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((b) => (
                <tr key={b.id} className="border-b border-sand-dark last:border-0">
                  <td className="py-2 font-medium">{b.customerName}</td>
                  <td className="py-2 text-stone-500">{b.from} → {b.to}</td>
                  <td className="py-2">{b.carName}</td>
                  <td className="py-2">{b.date}</td>
                  <td className="py-2 font-medium">{b.priceJOD} JOD</td>
                  <td className="py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[b.status] || ''}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
