'use client'

import { Label } from '@/shared/ui/label'
import { Loader2 } from 'lucide-react'
import type { APIConfiguration } from '@/entities/api-configuration'
import { SELECT_CLS } from '../lib/import-utils'

interface ImportClassApiStepProps {
  apiConfigurations: APIConfiguration[]
  classConfigId: string
  onClassApiChange: (configId: string) => void
  isLoadingClasses: boolean
  classesError: string | null
}

export function ImportClassApiStep({
  apiConfigurations,
  classConfigId,
  onClassApiChange,
  isLoadingClasses,
  classesError,
}: ImportClassApiStepProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor="classApiSelect">
        Step 1 — Select API to fetch classes <span className="text-red-500">*</span>
      </Label>

      <select
        id="classApiSelect"
        value={classConfigId}
        onChange={(e) => onClassApiChange(e.target.value)}
        disabled={apiConfigurations.length === 0}
        aria-label="Select API configuration for classes"
        className={SELECT_CLS}
      >
        <option value="">Select API configuration…</option>
        {apiConfigurations.map((config) => (
          <option key={config.id} value={config.id}>
            {config.name}{config.isSchoolPortal ? ' (School Portal)' : ''}
          </option>
        ))}
      </select>

      {isLoadingClasses && (
        <div className="flex items-center gap-2 text-sm text-gray-500 pt-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Loading classes…
        </div>
      )}
      {classesError && <p className="text-xs text-red-500">{classesError}</p>}
    </div>
  )
}
