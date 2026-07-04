'use client'

import { useState } from 'react'
import type { Booking } from '@/lib/types'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function BookingTable({
  bookings,
  onStatusChange,
}: {
  bookings: Booking[]
  onStatusChange: (id: string, status: string) => void
}) {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="overflow-x-auto">
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
          {bookings.map((b) => (
            <>
              <tr
                key={b.id}
                className="border-b border-sand-dark cursor-pointer hover:bg-sand/50"
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
                    onChange={(e) => { e.stopPropagation(); onStatusChange(b.id, e.target.value) }}
                    onClick={(e) => e.stopPropagation()}
                    className={`px-2 py-0.5 rounded-full text-xs font-medium border-0 ${STATUS_COLORS[b.status]}`}
                  >
                    {['pending','confirmed','completed','cancelled'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
              {expanded === b.id && (
                <tr key={`${b.id}-exp`} className="bg-sand/30">
                  <td colSpan={6} className="px-4 py-3 text-xs text-stone-600">
                    <div className="grid grid-cols-3 gap-2">
                      <div><b>Phone:</b> {b.customerPhone}</div>
                      <div><b>Pax:</b> {b.passengers}</div>
                      <div><b>Currency:</b> {b.currency} {b.priceConverted}</div>
                      <div><b>Locale:</b> {b.locale}</div>
                      <div><b>ID:</b> {b.id}</div>
                      <div><b>Created:</b> {new Date(b.createdAt).toLocaleString()}</div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  )
}
