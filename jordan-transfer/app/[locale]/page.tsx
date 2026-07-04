import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getSettings } from '@/lib/db'
import BookingWidget from '@/components/BookingWidget'
import TrustBar from '@/components/TrustBar'
import HowItWorks from '@/components/HowItWorks'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('hero')
  const settings = await getSettings()

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://jordantransfer.jo'}/${locale}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <section className="bg-night text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-terra text-white text-sm font-semibold px-4 py-1 rounded-full mb-4">
            {t('tag')}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-stone-300 text-lg mb-10 max-w-2xl mx-auto">{t('subtitle')}</p>
          <BookingWidget locale={locale} />
        </div>
      </section>
      <TrustBar />
      <HowItWorks />
    </>
  )
}
