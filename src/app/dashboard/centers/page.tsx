'use client'

import { useState } from 'react'
import { AddCenterDialog } from '@/features/center-add'
import { CenterTable } from '@/widgets/center-table'
import { Alert } from '@/shared/ui/Alert'
import { DashboardHeader } from '@/widgets/dashboard/ui/DashboardHeader'

export default function CentersPage() {
  const [success, setSuccess] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleSuccess = (message: string) => {
    setSuccess(message)
    setRefreshTrigger((prev) => prev + 1) // Trigger table refresh
    setTimeout(() => setSuccess(null), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        serverStatus="healthy"
        lastUpdate={new Date()}
        connected={true}
      />

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Center Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage examination centers and their information
            </p>
          </div>
          <AddCenterDialog
            onSuccess={() => handleSuccess('Center created successfully!')}
          />
        </div>

        {success && (
          <Alert className="bg-green-50 text-green-900 border-green-200">
            {success}
          </Alert>
        )}

        <CenterTable refreshTrigger={refreshTrigger} onUpdateSuccess={handleSuccess} />
      </div>
    </div>
  )
}
