'use client'

import { useState } from 'react'
import { ImportCandidatesDialog } from '@/features/candidate-import'
import { CandidateTable } from '@/widgets/candidate-table'
import { DashboardHeader } from '@/widgets/dashboard/ui/DashboardHeader'
import { Button } from '@/shared/ui/Button'
import { toast } from 'sonner'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function CandidatesPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleSuccess = (message: string) => {
    toast.success(message)
    setRefreshTrigger((prev) => prev + 1) 
  }

  const handleImportSuccess = async (count: number) => {
    toast.success(`Successfully imported ${count} candidates!`)
    // Add a small delay to ensure database is ready before refreshing
    await new Promise((resolve) => setTimeout(resolve, 500))
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="h-screen overflow-y-auto bg-gray-50">
      <DashboardHeader
        serverStatus="healthy"
        lastUpdate={new Date()}
        connected={true}
      />

      <div className="p-6 space-y-6 pb-12">
        <div className="flex justify-between items-center no-print">
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
            <Link href="/dashboard/candidates/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Candidate
              </Button>
            </Link>
          </div>
        </div>

        {/* Print Header - Only visible when printing */}
        <div className="hidden print:block text-2xl font-bold mb-4">
          Candidate Management
        </div>
        <div className="hidden print:block text-xs text-gray-600 mb-4">
          Printed on: {new Date().toLocaleString()}
        </div>

        <CandidateTable
          refreshTrigger={refreshTrigger}
          onDeleteSuccess={handleSuccess}
        />
      </div>
    </div>
  )
}
