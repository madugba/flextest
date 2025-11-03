'use client'

import { AddCandidateForm } from '@/features/candidate-add'
import { DashboardHeader } from '@/widgets/dashboard/ui/DashboardHeader'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import Link from 'next/link'

export default function NewCandidatePage() {
  const router = useRouter()

  const handleSuccess = () => {
    toast.success('Candidate created successfully!')
    router.push('/dashboard/candidates')
  }

  const handleCancel = () => {
    router.push('/dashboard/candidates')
  }

  return (
    <div className="h-screen overflow-y-auto bg-gray-50">
      <DashboardHeader
        serverStatus="healthy"
        lastUpdate={new Date()}
        connected={true}
      />

      <div className="p-6 space-y-6 pb-12">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/candidates">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Candidates
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-bold">Add New Candidate</h1>
          <p className="text-muted-foreground mt-1">
            Create a new candidate in the system
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <AddCandidateForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  )
}
