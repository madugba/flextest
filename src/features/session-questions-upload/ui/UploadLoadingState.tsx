'use client'

import { DashboardHeader } from '@/widgets/dashboard/ui/DashboardHeader'

export function UploadLoadingState() {
  return (
    <div className="flex-1 overflow-auto">
      <DashboardHeader />
      <div className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
