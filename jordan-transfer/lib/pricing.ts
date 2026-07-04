import { Car, Destination, Settings } from './types'

export const PLATFORM_FEE = 1.25

export function getCarPrice(
  car: Car,
  destination: Destination,
  currency: string,
  rates: Settings['rates']
): number {
  const base = destination.priceOverride ?? car.basePrice[destination.category]
  const withFee = base * PLATFORM_FEE
  if (currency === 'JOD') return Math.round(withFee)
  const rate = rates[currency as keyof typeof rates]
  if (!rate) return Math.round(withFee)
  return Math.round(withFee * rate)
}
