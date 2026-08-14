import { Loader2 } from 'lucide-react'
import { Label } from '@/shared/ui/label'
import type { APIConfiguration, Cohort } from '../model/types'

const selectCls = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white disabled:opacity-60 disabled:cursor-not-allowed'
const labelCls = 'text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block'

interface CohortApiStepProps {
  configurations: APIConfiguration[]
  cohortApiId: string
  onCohortApiChange: (value: string) => void
  cohorts: Cohort[]
  selectedCohortId: string
  onSelectedCohortIdChange: (value: string) => void
  isLoading: boolean
  error: string | null
}

export function CohortApiStep({
  configurations,
  cohortApiId,
  onCohortApiChange,
  cohorts,
  selectedCohortId,
  onSelectedCohortIdChange,
  isLoading,
  error,
}: CohortApiStepProps) {
  return (
    <>
      <div className="space-y-1.5">
        <Label>Step 1 — Select API to fetch cohorts/terms</Label>
        <select
          aria-label="Select API for cohorts"
          value={cohortApiId}
          onChange={(e) => onCohortApiChange(e.target.value)}
          className={selectCls}
        >
          <option value="">Select an API configuration…</option>
          {configurations.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-gray-500 pt-1">
            <Loader2 className="h-3 w-3 animate-spin" /> Loading cohorts/terms…
          </div>
        )}
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>

      {cohorts.length > 0 && (
        <div className="space-y-1.5">
          <label className={labelCls}>Cohort / Term</label>
          <select
            aria-label="Select a cohort or term"
            value={selectedCohortId}
            onChange={(e) => onSelectedCohortIdChange(e.target.value)}
            className={selectCls}
          >
            {cohorts.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}
    </>
  )
}
