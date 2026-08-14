'use client'

import { Label } from '@/shared/ui/label'
import { PlaceholderRow } from './PlaceholderRow'
import type { ValueKey } from '../model/types'

interface PlaceholderMappingStepProps {
  placeholders: string[]
  placeholderMap: Record<string, ValueKey>
  onPlaceholderMap: (placeholder: string, valueKey: ValueKey | '') => void
  selectedClassId: string
  subjectConfigId: string
}

export function PlaceholderMappingStep({
  placeholders,
  placeholderMap,
  onPlaceholderMap,
  selectedClassId,
  subjectConfigId,
}: PlaceholderMappingStepProps) {
  return (
    <div className={`space-y-2 transition-opacity ${selectedClassId && subjectConfigId ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
      <Label>
        Step 4 — Map URL placeholders <span className="text-red-500">*</span>
      </Label>
      <p className="text-xs text-gray-500">
        Tell the system what value each placeholder in the endpoint represents.
      </p>

      <div className="rounded-md border divide-y">
        {placeholders.map((placeholder) => (
          <PlaceholderRow
            key={placeholder}
            placeholder={placeholder}
            placeholderMap={placeholderMap}
            onPlaceholderMap={onPlaceholderMap}
            selectedClassId={selectedClassId}
          />
        ))}
      </div>
    </div>
  )
}
