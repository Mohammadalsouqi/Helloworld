'use client'

import { useState } from 'react'
import type { Destination } from '@/lib/types'

const EMPTY: Destination = {
  id: '',
  from: '',
  fromAr: '',
  to: '',
  toAr: '',
  distanceKm: 0,
  category: 'short',
}

interface Props {
  initial?: Destination
  onSave: (d: Destination) => void
  onCancel: () => void
}

export default function DestinationForm({ initial, onSave, onCancel }: Props) {
  const [dest, setDest] = useState<Destination>(initial || EMPTY)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    onSave(dest)
  }

  return (
    <form onSubmit={handleSave} className="bg-white rounded-xl border border-sand-dark p-6 max-w-2xl space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">From (EN)</label>
          <input type="text" required value={dest.from} onChange={e => setDest({...dest, from: e.target.value})}
            className="w-full border border-sand-dark rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">From (AR)</label>
          <input type="text" required value={dest.fromAr} onChange={e => setDest({...dest, fromAr: e.target.value})}
            className="w-full border border-sand-dark rounded px-3 py-2 text-sm" dir="rtl" />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">To (EN)</label>
          <input type="text" required value={dest.to} onChange={e => setDest({...dest, to: e.target.value})}
            className="w-full border border-sand-dark rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">To (AR)</label>
          <input type="text" required value={dest.toAr} onChange={e => setDest({...dest, toAr: e.target.value})}
            className="w-full border border-sand-dark rounded px-3 py-2 text-sm" dir="rtl" />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">Distance (km)</label>
          <input type="number" min={0} value={dest.distanceKm} onChange={e => setDest({...dest, distanceKm: +e.target.value})}
            className="w-full border border-sand-dark rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">Category</label>
          <select value={dest.category} onChange={e => setDest({...dest, category: e.target.value as Destination['category']})}
            className="w-full border border-sand-dark rounded px-3 py-2 text-sm">
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">Price Override (JOD)</label>
          <input type="number" min={0} value={dest.priceOverride ?? ''} onChange={e => setDest({...dest, priceOverride: e.target.value ? +e.target.value : undefined})}
            className="w-full border border-sand-dark rounded px-3 py-2 text-sm" placeholder="Optional" />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="bg-terra text-white px-6 py-2 rounded-lg hover:bg-terra-dark font-medium text-sm">Save</button>
        <button type="button" onClick={onCancel} className="border border-sand-dark px-6 py-2 rounded-lg text-sm hover:bg-sand">Cancel</button>
      </div>
    </form>
  )
}
