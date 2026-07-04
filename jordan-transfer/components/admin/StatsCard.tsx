export default function StatsCard({
  label,
  value,
  highlight,
}: {
  label: string
  value: string | number
  highlight?: boolean
}) {
  return (
    <div className="bg-white rounded-xl border border-sand-dark p-5">
      <p className="text-stone-500 text-sm">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${highlight ? 'text-terra' : 'text-night'}`}>{value}</p>
    </div>
  )
}
