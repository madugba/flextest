import { DashboardHeader } from '@/widgets/dashboard'

interface DashboardErrorStateProps {
  message: string
}

export function DashboardErrorState({ message }: DashboardErrorStateProps) {
  return (
    <>
      <DashboardHeader serverStatus="unknown" lastUpdate={null} connected={false} />
      <main className="flex-1 overflow-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-800 font-medium">Error loading metrics</p>
          <p className="text-red-600 text-sm mt-1">{message}</p>
        </div>
      </main>
    </>
  )
}
