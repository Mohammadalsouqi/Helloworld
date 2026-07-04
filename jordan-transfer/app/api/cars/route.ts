import { NextRequest, NextResponse } from 'next/server'
import { getCars, saveCars } from '@/lib/db'
import type { Car } from '@/lib/types'

export async function GET(req: NextRequest) {
  const all = req.nextUrl.searchParams.get('all')
  const cars = await getCars()
  return NextResponse.json(all ? cars : cars.filter((c) => c.active))
}

export async function POST(req: NextRequest) {
  if (!req.headers.get('x-admin-auth')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const car: Car = await req.json()
  car.id = `car-${Date.now()}`
  const cars = await getCars()
  cars.push(car)
  await saveCars(cars)
  return NextResponse.json(car)
}

export async function PUT(req: NextRequest) {
  if (!req.headers.get('x-admin-auth')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const updated: Car = await req.json()
  const cars = await getCars()
  const idx = cars.findIndex((c) => c.id === updated.id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  cars[idx] = updated
  await saveCars(cars)
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest) {
  if (!req.headers.get('x-admin-auth')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = req.nextUrl.searchParams.get('id')
  const cars = await getCars()
  await saveCars(cars.filter((c) => c.id !== id))
  return NextResponse.json({ ok: true })
}
