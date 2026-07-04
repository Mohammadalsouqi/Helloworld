import { NextRequest, NextResponse } from 'next/server'
import { getDestinations, saveDestinations } from '@/lib/db'
import type { Destination } from '@/lib/types'

export async function GET() {
  return NextResponse.json(await getDestinations())
}

export async function POST(req: NextRequest) {
  if (!req.headers.get('x-admin-auth')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const dest: Destination = await req.json()
  dest.id = `d-${Date.now()}`
  const dests = await getDestinations()
  dests.push(dest)
  await saveDestinations(dests)
  return NextResponse.json(dest)
}

export async function PUT(req: NextRequest) {
  if (!req.headers.get('x-admin-auth')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const updated: Destination = await req.json()
  const dests = await getDestinations()
  const idx = dests.findIndex((d) => d.id === updated.id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  dests[idx] = updated
  await saveDestinations(dests)
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest) {
  if (!req.headers.get('x-admin-auth')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = req.nextUrl.searchParams.get('id')
  const dests = await getDestinations()
  await saveDestinations(dests.filter((d) => d.id !== id))
  return NextResponse.json({ ok: true })
}
