'use client'

import { useEffect, useState } from 'react'
import type { Car } from '@/lib/types'
import CarForm from '@/components/admin/CarForm'

export default function AdminCarsPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Car | null>(null)
  const [adding, setAdding] = useState(false)

  async function load() {
    const res = await fetch('/api/cars?all=1')
    const data = await res.json()
    setCars(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: string) {
    if (!confirm('Delete this car?')) return
    await fetch(`/api/cars?id=${id}`, { method: 'DELETE', headers: { 'x-admin-auth': '1' } })
    load()
  }

  async function handleSave(car: Car) {
    if (editing) {
      await fetch('/api/cars', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-auth': '1' },
        body: JSON.stringify(car),
      })
    } else {
      await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-auth': '1' },
        body: JSON.stringify(car),
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
        <h1 className="text-2xl font-bold text-night mb-6">{editing ? 'Edit Car' : 'Add Car'}</h1>
        <CarForm
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
        <h1 className="text-2xl font-bold text-night">Cars</h1>
        <button
          onClick={() => setAdding(true)}
          className="bg-terra text-white px-4 py-2 rounded-lg hover:bg-terra-dark transition-colors text-sm font-medium"
        >
          + Add Car
        </button>
      </div>
      <div className="bg-white rounded-xl border border-sand-dark overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-stone-500 border-b border-sand-dark bg-sand">
              <th className="px-4 py-3 font-medium">Car</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Year</th>
              <th className="px-4 py-3 font-medium">Pax</th>
              <th className="px-4 py-3 font-medium">Prices (S/M/L)</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id} className="border-b border-sand-dark last:border-0">
                <td className="px-4 py-3 font-medium">{car.name}</td>
                <td className="px-4 py-3 text-stone-500">{car.type}</td>
                <td className="px-4 py-3">{car.year}</td>
                <td className="px-4 py-3">{car.passengers}</td>
                <td className="px-4 py-3">{car.basePrice.short}/{car.basePrice.medium}/{car.basePrice.long} JOD</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${car.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {car.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => setEditing(car)} className="text-terra hover:underline text-xs">Edit</button>
                  <button onClick={() => handleDelete(car.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
