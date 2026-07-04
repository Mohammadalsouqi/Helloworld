'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Car } from '@/lib/types'

const EMPTY_CAR: Car = {
  id: '',
  name: '',
  nameAr: '',
  type: 'Sedan',
  passengers: 4,
  luggage: 3,
  hasAC: true,
  transmission: 'Auto',
  year: new Date().getFullYear(),
  features: [],
  featuresAr: [],
  description: '',
  descriptionAr: '',
  amenities: [],
  amenitiesAr: [],
  cancellationPolicy: '',
  cancellationPolicyAr: '',
  unsplashQuery: '',
  basePrice: { short: 20, medium: 45, long: 70 },
  active: true,
}

interface Props {
  initial?: Car
  onSave: (car: Car) => void
  onCancel: () => void
}

export default function CarForm({ initial, onSave, onCancel }: Props) {
  const [car, setCar] = useState<Car>(initial || EMPTY_CAR)
  const [previewImg, setPreviewImg] = useState(initial?.unsplashQuery || '')
  const [showPreview, setShowPreview] = useState(false)

  function arrField(val: string): string[] {
    return val.split(',').map(s => s.trim()).filter(Boolean)
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    onSave(car)
  }

  return (
    <form onSubmit={handleSave} className="bg-white rounded-xl border border-sand-dark p-6 max-w-3xl space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">Name (EN)</label>
          <input type="text" required value={car.name} onChange={e => setCar({...car, name: e.target.value})}
            className="w-full border border-sand-dark rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">Name (AR)</label>
          <input type="text" required value={car.nameAr} onChange={e => setCar({...car, nameAr: e.target.value})}
            className="w-full border border-sand-dark rounded px-3 py-2 text-sm" dir="rtl" />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">Type</label>
          <select value={car.type} onChange={e => setCar({...car, type: e.target.value as Car['type']})}
            className="w-full border border-sand-dark rounded px-3 py-2 text-sm">
            {['Sedan','SUV','Minivan','Luxury','Bus'].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">Transmission</label>
          <select value={car.transmission} onChange={e => setCar({...car, transmission: e.target.value as 'Auto'|'Manual'})}
            className="w-full border border-sand-dark rounded px-3 py-2 text-sm">
            <option>Auto</option><option>Manual</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">Passengers</label>
          <input type="number" min={1} max={60} value={car.passengers} onChange={e => setCar({...car, passengers: +e.target.value})}
            className="w-full border border-sand-dark rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">Luggage</label>
          <input type="number" min={0} value={car.luggage} onChange={e => setCar({...car, luggage: +e.target.value})}
            className="w-full border border-sand-dark rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">Year</label>
          <input type="number" value={car.year} onChange={e => setCar({...car, year: +e.target.value})}
            className="w-full border border-sand-dark rounded px-3 py-2 text-sm" />
        </div>
        <div className="flex items-center gap-3 pt-4">
          <input type="checkbox" id="ac" checked={car.hasAC} onChange={e => setCar({...car, hasAC: e.target.checked})} />
          <label htmlFor="ac" className="text-sm">Has A/C</label>
          <input type="checkbox" id="active" checked={car.active} onChange={e => setCar({...car, active: e.target.checked})} />
          <label htmlFor="active" className="text-sm">Active</label>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">Price Short (JOD)</label>
          <input type="number" value={car.basePrice.short} onChange={e => setCar({...car, basePrice: {...car.basePrice, short: +e.target.value}})}
            className="w-full border border-sand-dark rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">Price Medium (JOD)</label>
          <input type="number" value={car.basePrice.medium} onChange={e => setCar({...car, basePrice: {...car.basePrice, medium: +e.target.value}})}
            className="w-full border border-sand-dark rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">Price Long (JOD)</label>
          <input type="number" value={car.basePrice.long} onChange={e => setCar({...car, basePrice: {...car.basePrice, long: +e.target.value}})}
            className="w-full border border-sand-dark rounded px-3 py-2 text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-stone-500 mb-1">Description (EN)</label>
        <textarea value={car.description} onChange={e => setCar({...car, description: e.target.value})} rows={2}
          className="w-full border border-sand-dark rounded px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-xs font-medium text-stone-500 mb-1">Description (AR)</label>
        <textarea value={car.descriptionAr} onChange={e => setCar({...car, descriptionAr: e.target.value})} rows={2}
          className="w-full border border-sand-dark rounded px-3 py-2 text-sm" dir="rtl" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">Features EN (comma-sep)</label>
          <input type="text" value={car.features.join(', ')} onChange={e => setCar({...car, features: arrField(e.target.value)})}
            className="w-full border border-sand-dark rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">Features AR (comma-sep)</label>
          <input type="text" value={car.featuresAr.join(', ')} onChange={e => setCar({...car, featuresAr: arrField(e.target.value)})}
            className="w-full border border-sand-dark rounded px-3 py-2 text-sm" dir="rtl" />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">Amenities EN (comma-sep)</label>
          <input type="text" value={car.amenities.join(', ')} onChange={e => setCar({...car, amenities: arrField(e.target.value)})}
            className="w-full border border-sand-dark rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">Amenities AR (comma-sep)</label>
          <input type="text" value={car.amenitiesAr.join(', ')} onChange={e => setCar({...car, amenitiesAr: arrField(e.target.value)})}
            className="w-full border border-sand-dark rounded px-3 py-2 text-sm" dir="rtl" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">Cancellation Policy EN</label>
          <input type="text" value={car.cancellationPolicy} onChange={e => setCar({...car, cancellationPolicy: e.target.value})}
            className="w-full border border-sand-dark rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">Cancellation Policy AR</label>
          <input type="text" value={car.cancellationPolicyAr} onChange={e => setCar({...car, cancellationPolicyAr: e.target.value})}
            className="w-full border border-sand-dark rounded px-3 py-2 text-sm" dir="rtl" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-stone-500 mb-1">Unsplash Query</label>
        <div className="flex gap-2">
          <input type="text" value={car.unsplashQuery} onChange={e => setCar({...car, unsplashQuery: e.target.value})}
            className="flex-1 border border-sand-dark rounded px-3 py-2 text-sm" />
          <button type="button" onClick={() => { setPreviewImg(car.unsplashQuery); setShowPreview(true) }}
            className="bg-sand border border-sand-dark px-3 py-2 rounded text-sm hover:bg-sand-dark">
            Preview
          </button>
        </div>
        {showPreview && previewImg && (
          <div className="mt-2 relative w-full h-32 rounded overflow-hidden">
            <Image
              src={`https://source.unsplash.com/featured/800x320?${previewImg}`}
              alt="preview"
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="bg-terra text-white px-6 py-2 rounded-lg hover:bg-terra-dark font-medium text-sm">Save</button>
        <button type="button" onClick={onCancel} className="border border-sand-dark px-6 py-2 rounded-lg text-sm hover:bg-sand">Cancel</button>
      </div>
    </form>
  )
}
