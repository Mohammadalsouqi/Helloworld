'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const auth = document.cookie.includes('admin_auth=1')
    setAuthed(auth)
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/settings')
    const settings = await res.json()
    if (password === settings.password) {
      document.cookie = 'admin_auth=1; path=/; max-age=86400'
      setAuthed(true)
    } else {
      setError('Invalid password')
    }
  }

  if (authed === null) return null

  if (!authed) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center px-4">
        <div className="bg-white rounded-xl border border-sand-dark p-8 w-full max-w-sm">
          <h1 className="text-2xl font-bold text-night mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-sand-dark rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-terra"
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-terra text-white font-semibold py-2 rounded-lg hover:bg-terra-dark transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sand flex">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  )
}
