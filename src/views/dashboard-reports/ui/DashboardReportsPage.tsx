'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { DashboardHeader } from '@/widgets/dashboard'
import { ReportsTable } from '@/widgets/reports-table'
import { AnalysisDialog } from '@/features/report-analysis'
import { PrintReportDialog } from '@/features/report-print'
import { DeleteReportDialog } from '@/features/report-delete'
import { Button } from '@/shared/ui/Button'
import { CreditCard } from 'lucide-react'

export function DashboardReportsPage() {
  const router = useRouter()
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
  const [selectedSessionName, setSelectedSessionName] = useState<string>('')
  const [dialogState, setDialogState] = useState({
    analysis: false,
    print: false,
    delete: false,
  })
  const [refreshKey, setRefreshKey] = useState(0)

  const handleAction = (action: 'analysis' | 'print' | 'delete' | 'viewScore' | 'upload', sessionId: string, sessionName: string) => {
    if (action === 'viewScore') {
      router.push(`/dashboard/reports/${sessionId}/scores`)
      return
    }

    if (action === 'upload') {
      toast.info('Upload functionality coming soon')
      return
    }

    setSelectedSessionId(sessionId)
    setSelectedSessionName(sessionName)
    setDialogState((prev) => ({ ...prev, [action]: true }))
  }

  const closeDialog = (action: 'analysis' | 'print' | 'delete') => {
    setDialogState((prev) => ({ ...prev, [action]: false }))
  }

  const handleDeleteSuccess = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="flex-1 overflow-auto">
      <DashboardHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Exam Reports</h1>
              <p className="mt-1 text-sm text-gray-600">
                View and analyze completed exam sessions
              </p>
            </div>
            <Button>
              <CreditCard className="h-4 w-4 mr-2" />
              Payment
            </Button>
          </div>
        </div>

        {/* Reports Table */}
        <ReportsTable onAction={handleAction} key={refreshKey} />

        {/* Feature Dialogs */}
        <AnalysisDialog
          open={dialogState.analysis}
          onClose={() => closeDialog('analysis')}
          sessionId={selectedSessionId}
        />

        <PrintReportDialog
          open={dialogState.print}
          onClose={() => closeDialog('print')}
          sessionId={selectedSessionId}
        />

        <DeleteReportDialog
          open={dialogState.delete}
          onClose={() => closeDialog('delete')}
          sessionId={selectedSessionId}
          sessionName={selectedSessionName}
          onSuccess={handleDeleteSuccess}
        />
      </div>
    </div>
  )
}

