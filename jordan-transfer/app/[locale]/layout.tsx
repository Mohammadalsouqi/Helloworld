import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import Script from 'next/script'
import '../globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getSettings } from '@/lib/db'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const settings = await getSettings()
  const lang = locale as 'en' | 'ar'
  return {
    title: settings.metaTitle[lang],
    description: settings.metaDescription[lang],
    alternates: {
      canonical: `/${locale}`,
      languages: { en: '/en', ar: '/ar' },
    },
    openGraph: {
      title: settings.metaTitle[lang],
      description: settings.metaDescription[lang],
      locale: locale === 'ar' ? 'ar_JO' : 'en_US',
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const messages = await getMessages()
  const isRtl = locale === 'ar'
  const settings = await getSettings()

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings.platformName,
    description: settings.metaDescription['en'],
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://jordantransfer.jo',
    telephone: settings.whatsapp,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'JO',
      addressLocality: 'Amman',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 31.9539,
      longitude: 35.9106,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
  }

  return (
    <html lang={locale} dir={isRtl ? 'rtl' : 'ltr'}>
      <body className={isRtl ? 'font-arabic' : inter.className}>
        <Script
          id="local-business-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <NextIntlClientProvider messages={messages}>
          <Navbar locale={locale} />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
