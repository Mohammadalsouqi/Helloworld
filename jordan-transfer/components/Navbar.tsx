'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import LanguageToggle from './LanguageToggle'

export default function Navbar({ locale }: { locale: string }) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-night text-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-2 font-bold text-lg">
          <svg className="w-6 h-6 text-terra" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
          </svg>
          Jordan Transfer
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link href={`/${locale}`} className="hover:text-terra transition-colors">{t('home')}</Link>
          <Link href={`/${locale}/cars`} className="hover:text-terra transition-colors">{t('cars')}</Link>
          <LanguageToggle locale={locale} />
          <Link href={`/${locale}/admin`} className="text-stone-400 hover:text-white transition-colors text-xs">{t('admin')}</Link>
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-stone-700 px-4 py-3 flex flex-col gap-3 text-sm">
          <Link href={`/${locale}`} onClick={() => setOpen(false)} className="hover:text-terra">{t('home')}</Link>
          <Link href={`/${locale}/cars`} onClick={() => setOpen(false)} className="hover:text-terra">{t('cars')}</Link>
          <LanguageToggle locale={locale} />
          <Link href={`/${locale}/admin`} onClick={() => setOpen(false)} className="text-stone-400">{t('admin')}</Link>
        </div>
      )}
    </nav>
  )
}
