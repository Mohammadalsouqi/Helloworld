import { NextRequest, NextResponse } from 'next/server'
import { getBookings, saveBookings, getSettings } from '@/lib/db'
import { buildWhatsAppURL } from '@/lib/whatsapp'
import type { Booking } from '@/lib/types'

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get('status')
  const bookings = await getBookings()
  return NextResponse.json(status ? bookings.filter((b) => b.status === status) : bookings)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const settings = await getSettings()

  const booking: Booking = {
    id: `booking-${Date.now()}`,
    createdAt: new Date().toISOString(),
    customerName: body.customerName,
    customerPhone: body.customerPhone,
    from: body.from,
    to: body.to,
    carId: body.carId,
    carName: body.carName,
    date: body.date,
    passengers: body.passengers,
    priceJOD: body.priceJOD,
    currency: body.currency,
    priceConverted: body.priceConverted,
    status: 'pending',
    locale: body.locale || 'en',
  }

  const bookings = await getBookings()
  bookings.push(booking)
  await saveBookings(bookings)

  const whatsappUrl = buildWhatsAppURL(settings.whatsapp, booking, booking.locale)
  return NextResponse.json({ booking, whatsappUrl })
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json()
  const bookings = await getBookings()
  const idx = bookings.findIndex((b) => b.id === id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  bookings[idx].status = status
  await saveBookings(bookings)
  return NextResponse.json(bookings[idx])
}
