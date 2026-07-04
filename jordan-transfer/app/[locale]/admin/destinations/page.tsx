'use client'

import { useEffect, useState } from 'react'
import type { Destination } from '@/lib/types'
import DestinationForm from '@/components/admin/DestinationForm'

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Destination | null>(null)
  const [adding, setAdding] = useState(false)

  async function load() {
    const res = await fetch('/api/destinations')
    const data = await res.json()
    setDestinations(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: string) {
    if (!confirm('Delete this destination?')) return
    await fetch(`/api/destinations?id=${id}`, { method: 'DELETE', headers: { 'x-admin-auth': '1' } })
    load()
  }

  async function handleSave(dest: Destination) {
    if (editing) {
      await fetch('/api/destinations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-auth': '1' },
        body: JSON.stringify(dest),
      })
    } else {
      await fetch('/api/destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-auth': '1' },
        body: JSON.stringify(dest),
      })
    }
    setEditing(null)
    setAdding(false)
    load()
  }

  if (loading) return <div className="text-stone-500">Loading...</div>

  if (adding || editing) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-night mb-6">{editing ? 'Edit Destination' : 'Add Destination'}</h1>
        <DestinationForm
          initial={editing || undefined}
          onSave={handleSave}
          onCancel={() => { setEditing(null); setAdding(false) }}
        />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-night">Destinations</h1>
        <button
          onClick={() => setAdding(true)}
          className="bg-terra text-white px-4 py-2 rounded-lg hover:bg-terra-dark transition-colors text-sm font-medium"
        >
          + Add Destination
        </button>
      </div>
      <div className="bg-white rounded-xl border border-sand-dark overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-stone-500 border-b border-sand-dark bg-sand">
              <th className="px-4 py-3 font-medium">From</th>
              <th className="px-4 py-3 font-medium">To</th>
              <th className="px-4 py-3 font-medium">Distance</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price (JOD)</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {destinations.map((d) => (
              <tr key={d.id} className="border-b border-sand-dark last:border-0">
                <td className="px-4 py-3">{d.from}</td>
                <td className="px-4 py-3">{d.to}</td>
                <td className="px-4 py-3">{d.distanceKm} km</td>
                <td className="px-4 py-3 capitalize">{d.category}</td>
                <td className="px-4 py-3">{d.priceOverride ?? '-'}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => setEditing(d)} className="text-terra hover:underline text-xs">Edit</button>
                  <button onClick={() => handleDelete(d.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
