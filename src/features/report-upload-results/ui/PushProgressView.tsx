import { Progress } from '@/shared/ui/progress'
import type { PushProgress } from '../model/types'

export function PushProgressView({ progress }: { progress: PushProgress }) {
  const percent = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0

  return (
    <div className="space-y-3 py-4">
      <Progress value={percent} />
      <p className="text-sm text-gray-600">
        {progress.completed} / {progress.total} · <span className="text-green-700">✓ {progress.succeeded}</span>
        {progress.failed > 0 && <span className="text-red-600"> · ✗ {progress.failed}</span>}
      </p>
    </div>
  )
}
