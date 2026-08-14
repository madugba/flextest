'use client'

import { AVAILABLE_VALUES, type ValueKey } from '../model/types'

interface PlaceholderRowProps {
  placeholder: string
  placeholderMap: Record<string, ValueKey>
  onPlaceholderMap: (placeholder: string, valueKey: ValueKey | '') => void
  selectedClassId: string
}

export function PlaceholderRow({
  placeholder,
  placeholderMap,
  onPlaceholderMap,
  selectedClassId,
}: PlaceholderRowProps) {
  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <code className="flex-shrink-0 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono">
        {`{${placeholder}}`}
      </code>

      <span className="text-gray-400 text-sm flex-shrink-0">→</span>

      <select
        value={placeholderMap[placeholder] ?? ''}
        onChange={(e) => onPlaceholderMap(placeholder, e.target.value as ValueKey | '')}
        aria-label={`Map {${placeholder}}`}
        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">— select a value —</option>
        {AVAILABLE_VALUES.map(({ key, label }) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>

      {placeholderMap[placeholder] === 'classId' && selectedClassId && (
        <span
          className="text-xs text-green-600 font-mono truncate min-w-0 max-w-[110px]"
          title={selectedClassId}
        >
          = {selectedClassId.slice(0, 8)}…
        </span>
      )}
    </div>
  )
}
