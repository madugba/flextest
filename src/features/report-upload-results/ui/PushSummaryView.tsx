import { CheckCircle2 } from 'lucide-react'
import type { PushResult } from '../model/types'
import { PushResultRow } from './PushResultRow'

export function PushSummaryView({ results }: { results: PushResult[] }) {
  const failures = results.filter((r) => !r.success)
  const succeeded = results.length - failures.length

  return (
    <div className="space-y-3 py-2">
      <div className="flex items-center gap-3 p-3 rounded-lg border border-green-200 bg-green-50/40">
        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
        <p className="text-sm text-green-800">
          <span className="font-semibold">{succeeded}</span> score{succeeded !== 1 ? 's' : ''} pushed successfully
        </p>
      </div>

      {failures.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-red-700 uppercase tracking-wide">
            {failures.length} Failed — click a row to inspect the payload sent
          </p>
          <div className="max-h-64 overflow-y-auto border border-red-200 rounded-lg divide-y divide-red-100">
            {failures.map((f, i) => (
              <PushResultRow key={i} result={f} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
