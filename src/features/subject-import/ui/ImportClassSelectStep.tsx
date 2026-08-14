'use client'

import { Label } from '@/shared/ui/label'
import { Button } from '@/shared/ui/Button'
import { RefreshCw } from 'lucide-react'
import type { APIConfiguration } from '@/entities/api-configuration'
import { SELECT_CLS } from '../lib/import-utils'

interface ImportClassSelectStepProps {
  classConfigId: string
  classes: { classid: string; classname: string }[]
  selectedClassId: string
  onClassChange: (classId: string) => void
  classConfig: APIConfiguration | null
  onRefresh: (config: APIConfiguration) => void
  isLoadingClasses: boolean
}

export function ImportClassSelectStep({
  classConfigId,
  classes,
  selectedClassId,
  onClassChange,
  classConfig,
  onRefresh,
  isLoadingClasses,
}: ImportClassSelectStepProps) {
  return (
    <div className={`space-y-1.5 transition-opacity ${classConfigId && classes.length > 0 ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
      <div className="flex items-center justify-between">
        <Label htmlFor="classSelect">
          Step 2 — Select class <span className="text-red-500">*</span>
        </Label>
        {classConfig && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRefresh(classConfig)}
            disabled={isLoadingClasses}
            className="h-7 text-xs"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${isLoadingClasses ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        )}
      </div>

      <select
        id="classSelect"
        value={selectedClassId}
        onChange={(e) => onClassChange(e.target.value)}
        disabled={classes.length === 0}
        aria-label="Select class"
        className={SELECT_CLS}
      >
        <option value="">Select a class…</option>
        {classes.map(({ classid, classname }) => (
          <option key={classid} value={classid}>{classname}</option>
        ))}
      </select>
    </div>
  )
}
