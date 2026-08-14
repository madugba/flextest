import { PlaceholderRow } from './PlaceholderRow'
import type { ImportValueKey } from '../model/types'

interface StudentMappingBlockProps {
  studentAmbiguous: string[]
  studentMap: Record<string, ImportValueKey>
  onStudentMapChange: (placeholder: string, valueKey: ImportValueKey | '') => void
}

export function StudentMappingBlock({
  studentAmbiguous,
  studentMap,
  onStudentMapChange,
}: StudentMappingBlockProps) {
  if (studentAmbiguous.length === 0) return null

  return (
    <div className="space-y-1.5">
      <p className="text-xs text-amber-700 font-medium">These URL placeholders need to be mapped:</p>
      {studentAmbiguous.map((p) => (
        <PlaceholderRow
          key={p}
          placeholder={p}
          value={studentMap[p] ?? ''}
          onChange={(v) => onStudentMapChange(p, v)}
        />
      ))}
    </div>
  )
}
