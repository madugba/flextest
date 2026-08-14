import { IMPORT_VALUES, type ImportValueKey } from '../model/types'

export function PlaceholderRow({
  placeholder, value, onChange,
}: { placeholder: string; value: ImportValueKey | ''; onChange: (v: ImportValueKey | '') => void }) {
  return (
    <div className="flex items-center gap-2 py-2 px-3 bg-amber-50 border border-amber-200 rounded-lg">
      <span className="text-xs text-amber-700 font-medium flex-shrink-0">Map</span>
      <code className="flex-shrink-0 bg-white text-gray-700 px-1.5 py-0.5 rounded font-mono text-xs border border-gray-200">
        {`{${placeholder}}`}
      </code>
      <span className="text-amber-500 flex-shrink-0 text-xs">→</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ImportValueKey | '')}
        className="flex-1 px-2 py-1 text-sm border border-amber-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
      >
        <option value="">Select value…</option>
        {IMPORT_VALUES.map(({ key, label }) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>
    </div>
  )
}
