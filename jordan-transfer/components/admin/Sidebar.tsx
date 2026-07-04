'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/en/admin', label: 'Dashboard', icon: '📊' },
  { href: '/en/admin/cars', label: 'Cars', icon: '🚗' },
  { href: '/en/admin/destinations', label: 'Destinations', icon: '📍' },
  { href: '/en/admin/bookings', label: 'Bookings', icon: '📋' },
  { href: '/en/admin/settings', label: 'Settings', icon: '⚙️' },
]

export default function Sidebar() {
  const pathname = usePathname()

  function logout() {
    document.cookie = 'admin_auth=; path=/; max-age=0'
    window.location.href = '/'
  }

  return (
    <aside className="w-56 bg-night text-white flex flex-col min-h-screen shrink-0">
      <div className="px-4 py-5 border-b border-stone-700">
        <p className="font-bold text-sm text-terra">Jordan Transfer</p>
        <p className="text-stone-400 text-xs">Admin Panel</p>
      </div>
      <nav className="flex-1 py-4">
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href !== '/en/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                active ? 'bg-terra/20 text-terra font-medium' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-stone-700">
        <button onClick={logout} className="text-stone-400 hover:text-white text-sm transition-colors flex items-center gap-2">
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  )
}
