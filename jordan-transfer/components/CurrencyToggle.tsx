'use client'

const CURRENCIES = ['JOD', 'USD', 'EUR', 'SAR'] as const
type Currency = (typeof CURRENCIES)[number]

export default function CurrencyToggle({
  value,
  onChange,
}: {
  value: Currency
  onChange: (c: Currency) => void
}) {
  return (
    <div className="flex gap-1 bg-white border border-sand-dark rounded-lg p-1">
      {CURRENCIES.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            value === c ? 'bg-terra text-white' : 'text-stone-600 hover:bg-sand'
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  )
}
