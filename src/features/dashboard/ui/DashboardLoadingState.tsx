import { Spinner } from '@/shared/ui/Spinner'

interface DashboardLoadingStateProps {
  label: string
}

export function DashboardLoadingState({ label }: DashboardLoadingStateProps) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <Spinner />
        <p className="mt-4 text-sm text-gray-600">{label}</p>
      </div>
    </div>
  )
}
