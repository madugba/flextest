'use client'

import { Label } from '@/shared/ui/label'
import type { APIConfiguration } from '@/entities/api-configuration'
import { SELECT_CLS } from '../lib/import-utils'

interface ImportSubjectApiStepProps {
  apiConfigurations: APIConfiguration[]
  subjectConfigId: string
  onSubjectApiChange: (configId: string) => void
  selectedClassId: string
  selectedClassName: string | undefined
  subjectConfig: APIConfiguration | null
}

export function ImportSubjectApiStep({
  apiConfigurations,
  subjectConfigId,
  onSubjectApiChange,
  selectedClassId,
  selectedClassName,
  subjectConfig,
}: ImportSubjectApiStepProps) {
  return (
    <div className={`space-y-1.5 transition-opacity ${selectedClassId ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
      <Label htmlFor="subjectApiSelect">
        Step 3 — Select API to fetch subjects
        {selectedClassName ? ` for ${selectedClassName}` : ''}{' '}
        <span className="text-red-500">*</span>
      </Label>

      <select
        id="subjectApiSelect"
        value={subjectConfigId}
        onChange={(e) => onSubjectApiChange(e.target.value)}
        disabled={!selectedClassId || apiConfigurations.length === 0}
        aria-label="Select API configuration for subjects"
        className={SELECT_CLS}
      >
        <option value="">Select API configuration…</option>
        {apiConfigurations.map((config) => (
          <option key={config.id} value={config.id}>
            {config.name}{config.isSchoolPortal ? ' (School Portal)' : ''}
          </option>
        ))}
      </select>

      {subjectConfig && (
        <p className="text-xs text-gray-400 font-mono break-all">
          {subjectConfig.apiEndpoint}
        </p>
      )}
    </div>
  )
}
