import { Label } from '@/shared/ui/label'
import type { APIConfiguration } from '../model/types'

const selectCls = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white disabled:opacity-60 disabled:cursor-not-allowed'

interface PushApiStepProps {
  configurations: APIConfiguration[]
  pushApiId: string
  onPushApiIdChange: (value: string) => void
}

export function PushApiStep({ configurations, pushApiId, onPushApiIdChange }: PushApiStepProps) {
  return (
    <div className="space-y-1.5">
      <Label>Step 2 — Select API to push scores</Label>
      <select
        aria-label="Select API to push scores"
        value={pushApiId}
        onChange={(e) => onPushApiIdChange(e.target.value)}
        className={selectCls}
      >
        <option value="">Select an API configuration…</option>
        {configurations.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
    </div>
  )
}
