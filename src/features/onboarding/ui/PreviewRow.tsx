interface PreviewRowProps {
  label: string
  value: string
  valueClassName?: string
}

export function PreviewRow({ label, value, valueClassName }: PreviewRowProps) {
  return (
    <div className="flex justify-between">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className={valueClassName ?? 'text-sm text-gray-900'}>{value}</span>
    </div>
  )
}
