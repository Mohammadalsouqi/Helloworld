import { NextRequest, NextResponse } from 'next/server'
import { getSettings, saveSettings } from '@/lib/db'
import type { Settings } from '@/lib/types'

export async function GET() {
  const settings = await getSettings()
  return NextResponse.json(settings)
}

export async function PUT(req: NextRequest) {
  if (!req.headers.get('x-admin-auth')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const updated: Settings = await req.json()
  await saveSettings(updated)
  return NextResponse.json(updated)
}
