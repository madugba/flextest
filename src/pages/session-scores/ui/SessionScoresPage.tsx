'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/widgets/dashboard'
import { SessionScoresTable } from '@/widgets/session-scores-table'
import { PrintScoresDialog } from '@/features/scores-print'
import { Button } from '@/shared/ui/Button'
import { ArrowLeft } from 'lucide-react'

interface SessionScoresPageProps {
  sessionId: string
}

export function SessionScoresPage({ sessionId }: SessionScoresPageProps) {
  const router = useRouter()
  const [printDialogOpen, setPrintDialogOpen] = useState(false)

  return (
    <div className="flex-1 overflow-auto">
      <DashboardHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with back button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/reports')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Session Scores</h1>
          <p className="mt-1 text-sm text-gray-600">
            Detailed scores per candidate per subject
          </p>
        </div>

        {/* Scores Table */}
        <SessionScoresTable sessionId={sessionId} onPrint={() => setPrintDialogOpen(true)} />

        {/* Print Dialog */}
        <PrintScoresDialog
          open={printDialogOpen}
          onClose={() => setPrintDialogOpen(false)}
          sessionId={sessionId}
        />
      </div>
    </div>
  )
}

