import fs from 'fs/promises'
import path from 'path'
import { Car, Destination, Booking, Settings } from './types'
import { defaultCars, defaultDestinations, defaultSettings } from './seed'

const DATA_DIR = path.join(process.cwd(), 'data')

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true })
}

async function readJSON<T>(filename: string, fallback: T): Promise<T> {
  await ensureDir()
  const file = path.join(DATA_DIR, filename)
  try {
    const content = await fs.readFile(file, 'utf-8')
    if (!content.trim()) throw new Error('empty')
    return JSON.parse(content) as T
  } catch {
    await fs.writeFile(file, JSON.stringify(fallback, null, 2))
    return fallback
  }
}

async function writeJSON<T>(filename: string, data: T): Promise<void> {
  await ensureDir()
  const file = path.join(DATA_DIR, filename)
  await fs.writeFile(file, JSON.stringify(data, null, 2))
}

export async function getCars(): Promise<Car[]> {
  return readJSON<Car[]>('cars.json', defaultCars)
}

export async function saveCars(cars: Car[]): Promise<void> {
  return writeJSON('cars.json', cars)
}

export async function getDestinations(): Promise<Destination[]> {
  return readJSON<Destination[]>('destinations.json', defaultDestinations)
}

export async function saveDestinations(d: Destination[]): Promise<void> {
  return writeJSON('destinations.json', d)
}

export async function getBookings(): Promise<Booking[]> {
  return readJSON<Booking[]>('bookings.json', [])
}

export async function saveBookings(b: Booking[]): Promise<void> {
  return writeJSON('bookings.json', b)
}

export async function getSettings(): Promise<Settings> {
  return readJSON<Settings>('settings.json', defaultSettings)
}

export async function saveSettings(s: Settings): Promise<void> {
  return writeJSON('settings.json', s)
}
