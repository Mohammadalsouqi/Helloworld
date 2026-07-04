'use client'

import { useEffect, useState } from 'react'
import type { Settings } from '@/lib/types'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(setSettings)
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!settings) return
    setSaving(true)
    setMsg('')

    let updated = { ...settings }

    if (newPw) {
      if (currentPw !== settings.password) {
        setMsg('Current password is incorrect')
        setSaving(false)
        return
      }
      if (newPw !== confirmPw) {
        setMsg('New passwords do not match')
        setSaving(false)
        return
      }
      updated = { ...updated, password: newPw }
    }

    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-auth': '1' },
      body: JSON.stringify(updated),
    })

    setMsg('Settings saved!')
    setCurrentPw('')
    setNewPw('')
    setConfirmPw('')
    setSaving(false)
  }

  if (!settings) return <div className="text-stone-500">Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-night mb-6">Settings</h1>
      <form onSubmit={handleSave} className="max-w-2xl space-y-6">
        <div className="bg-white rounded-xl border border-sand-dark p-6 space-y-4">
          <h2 className="text-lg font-bold text-night">General</h2>
          <div>
            <label className="block text-sm font-medium text-night mb-1">Platform Name</label>
            <input type="text" value={settings.platformName}
              onChange={e => setSettings({ ...settings, platformName: e.target.value })}
              className="w-full border border-sand-dark rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-terra" />
          </div>
          <div>
            <label className="block text-sm font-medium text-night mb-1">WhatsApp Number</label>
            <input type="text" value={settings.whatsapp}
              onChange={e => setSettings({ ...settings, whatsapp: e.target.value })}
              className="w-full border border-sand-dark rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-terra" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-sand-dark p-6 space-y-4">
          <h2 className="text-lg font-bold text-night">Change Password</h2>
          <div>
            <label className="block text-sm font-medium text-night mb-1">Current Password</label>
            <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)}
              className="w-full border border-sand-dark rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-terra" />
          </div>
          <div>
            <label className="block text-sm font-medium text-night mb-1">New Password</label>
            <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)}
              className="w-full border border-sand-dark rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-terra" />
          </div>
          <div>
            <label className="block text-sm font-medium text-night mb-1">Confirm New Password</label>
            <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
              className="w-full border border-sand-dark rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-terra" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-sand-dark p-6 space-y-4">
          <h2 className="text-lg font-bold text-night">Currency Rates (per 1 JOD)</h2>
          {(['USD', 'EUR', 'SAR'] as const).map(cur => (
            <div key={cur}>
              <label className="block text-sm font-medium text-night mb-1">{cur}</label>
              <input type="number" step="0.01" value={settings.rates[cur]}
                onChange={e => setSettings({ ...settings, rates: { ...settings.rates, [cur]: parseFloat(e.target.value) } })}
                className="w-full border border-sand-dark rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-terra" />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-sand-dark p-6 space-y-4">
          <h2 className="text-lg font-bold text-night">SEO</h2>
          <div>
            <label className="block text-sm font-medium text-night mb-1">Meta Title (EN)</label>
            <input type="text" value={settings.metaTitle.en}
              onChange={e => setSettings({ ...settings, metaTitle: { ...settings.metaTitle, en: e.target.value } })}
              className="w-full border border-sand-dark rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-terra" />
          </div>
          <div>
            <label className="block text-sm font-medium text-night mb-1">Meta Title (AR)</label>
            <input type="text" value={settings.metaTitle.ar}
              onChange={e => setSettings({ ...settings, metaTitle: { ...settings.metaTitle, ar: e.target.value } })}
              className="w-full border border-sand-dark rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-terra" dir="rtl" />
          </div>
          <div>
            <label className="block text-sm font-medium text-night mb-1">Meta Description (EN)</label>
            <textarea value={settings.metaDescription.en}
              onChange={e => setSettings({ ...settings, metaDescription: { ...settings.metaDescription, en: e.target.value } })}
              rows={3}
              className="w-full border border-sand-dark rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-terra" />
          </div>
          <div>
            <label className="block text-sm font-medium text-night mb-1">Meta Description (AR)</label>
            <textarea value={settings.metaDescription.ar}
              onChange={e => setSettings({ ...settings, metaDescription: { ...settings.metaDescription, ar: e.target.value } })}
              rows={3}
              className="w-full border border-sand-dark rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-terra" dir="rtl" />
          </div>
        </div>

        {msg && <p className={`text-sm ${msg.includes('!') ? 'text-green-600' : 'text-red-500'}`}>{msg}</p>}

        <button type="submit" disabled={saving}
          className="bg-terra text-white font-semibold px-8 py-3 rounded-lg hover:bg-terra-dark transition-colors disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}
