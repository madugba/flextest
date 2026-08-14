import { Skeleton } from '@/shared/ui/skeleton'

export function AnalysisLoadingState() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
}
