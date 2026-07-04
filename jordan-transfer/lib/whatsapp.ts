import { Booking } from './types'

export function buildWhatsAppURL(
  phone: string,
  booking: Partial<Booking>,
  locale: 'en' | 'ar'
): string {
  const message =
    locale === 'ar'
      ? `مرحباً جوردن ترانسفر 👋\nأود حجز خدمة نقل:\n🚗 السيارة: ${booking.carName}\n📍 من: ${booking.from}\n📍 إلى: ${booking.to}\n📅 التاريخ: ${booking.date}\n👥 الركاب: ${booking.passengers}\n💰 السعر: ${booking.priceConverted} ${booking.currency}\nيرجى تأكيد حجزي. شكراً!`
      : `Hello Jordan Transfer 👋\nI'd like to book a transfer:\n🚗 Car: ${booking.carName}\n📍 From: ${booking.from}\n📍 To: ${booking.to}\n📅 Date: ${booking.date}\n👥 Passengers: ${booking.passengers}\n💰 Price: ${booking.priceConverted} ${booking.currency}\nPlease confirm my booking. Thank you!`

  const clean = phone.replace(/\D/g, '')
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`
}
