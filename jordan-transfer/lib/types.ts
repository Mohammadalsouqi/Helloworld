export interface Car {
  id: string
  name: string
  nameAr: string
  type: 'Sedan' | 'SUV' | 'Minivan' | 'Luxury' | 'Bus'
  passengers: number
  luggage: number
  hasAC: boolean
  transmission: 'Auto' | 'Manual'
  year: number
  features: string[]
  featuresAr: string[]
  description: string
  descriptionAr: string
  amenities: string[]
  amenitiesAr: string[]
  cancellationPolicy: string
  cancellationPolicyAr: string
  unsplashQuery: string
  basePrice: { short: number; medium: number; long: number }
  active: boolean
}

export interface Destination {
  id: string
  from: string
  fromAr: string
  to: string
  toAr: string
  distanceKm: number
  category: 'short' | 'medium' | 'long'
  priceOverride?: number
}

export interface Booking {
  id: string
  createdAt: string
  customerName: string
  customerPhone: string
  from: string
  to: string
  carId: string
  carName: string
  date: string
  passengers: number
  priceJOD: number
  currency: 'JOD' | 'USD' | 'EUR' | 'SAR'
  priceConverted: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  locale: 'en' | 'ar'
}

export interface Settings {
  whatsapp: string
  platformName: string
  password: string
  rates: { USD: number; EUR: number; SAR: number }
  metaTitle: { en: string; ar: string }
  metaDescription: { en: string; ar: string }
}
