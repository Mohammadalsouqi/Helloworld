'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

export default function LanguageToggle({ locale }: { locale: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations('nav')

  function toggle() {
    const next = locale === 'en' ? 'ar' : 'en'
    const newPath = pathname.replace(`/${locale}`, `/${next}`)
    router.push(newPath)
  }

  return (
    <button
      onClick={toggle}
      className="text-stone-300 hover:text-white transition-colors text-sm"
    >
      {t('language')}
    </button>
  )
}
