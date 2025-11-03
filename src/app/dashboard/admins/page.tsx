'use client'

import { useState } from 'react'
import { AdminTable } from '@/widgets/admin-table'
import { Alert } from '@/shared/ui/Alert'
import { DashboardHeader } from '@/widgets/dashboard/ui/DashboardHeader'

export default function AdminsPage() {
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
        <div>
          <h1 className="text-3xl font-bold">Admin Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage system administrators and their permissions
          </p>
        </div>

        {success && (
          <Alert className="bg-green-50 text-green-900 border-green-200">
            {success}
          </Alert>
        )}

        <AdminTable refreshTrigger={refreshTrigger} onBlockUnblockSuccess={handleSuccess} />
      </div>
    </div>
  )
}
