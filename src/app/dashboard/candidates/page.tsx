'use client'

import { useState } from 'react'
import { AddCandidateDialog } from '@/features/candidate-add'
import { ImportCandidatesDialog } from '@/features/candidate-import'
import { CandidateTable } from '@/widgets/candidate-table'
import { Alert } from '@/shared/ui/Alert'
import { DashboardHeader } from '@/widgets/dashboard/ui/DashboardHeader'

export default function CandidatesPage() {
  const [success, setSuccess] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleSuccess = (message: string) => {
    setSuccess(message)
    setRefreshTrigger((prev) => prev + 1) // Trigger table refresh
    setTimeout(() => setSuccess(null), 3000)
  }

  const handleImportSuccess = (count: number) => {
    handleSuccess(`Successfully imported ${count} candidates!`)
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
            <h1 className="text-3xl font-bold">Candidate Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage examination candidates and their information
            </p>
          </div>

          <div className="flex gap-2">
            <ImportCandidatesDialog
              onSuccess={handleImportSuccess}
            />
            <AddCandidateDialog
              onSuccess={() => handleSuccess('Candidate created successfully!')}
            />
          </div>
        </div>

        {success && (
          <Alert className="bg-green-50 text-green-900 border-green-200">
            {success}
          </Alert>
        )}

        <CandidateTable
          refreshTrigger={refreshTrigger}
          onDeleteSuccess={handleSuccess}
        />
      </div>
    </div>
  )
}
