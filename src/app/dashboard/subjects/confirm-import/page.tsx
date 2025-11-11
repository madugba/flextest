'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { confirmImportSubjects } from '@/entities/subject'
import { toast } from 'sonner'
import { Loader2, ArrowLeft } from 'lucide-react'

interface PendingSubject {
  name: string
}

export default function ConfirmImportPage() {
  const router = useRouter()
  const [subjects, setSubjects] = useState<PendingSubject[]>([])
  const [isImporting, setIsImporting] = useState(false)

  useEffect(() => {
    // Load pending subjects from sessionStorage
    const pending = sessionStorage.getItem('pending_subject_import')
    if (!pending) {
      toast.error('No pending import found')
      router.push('/dashboard/subjects')
      return
    }

    try {
      const parsed = JSON.parse(pending) as PendingSubject[]
      setSubjects(parsed)
    } catch (error) {
      toast.error('Invalid import data')
      router.push('/dashboard/subjects')
    }
  }, [router])

  const handleNameChange = (index: number, newName: string) => {
    setSubjects((prev) =>
      prev.map((subject, i) =>
        i === index ? { ...subject, name: newName } : subject
      )
    )
  }

  const handleConfirmImport = async () => {
    setIsImporting(true)

    try {
      const result = await confirmImportSubjects({ subjects })

      // Clear sessionStorage
      sessionStorage.removeItem('pending_subject_import')

      // Show success message
      toast.success(
        `Import complete: ${result.created} created, ${result.skipped} skipped`
      )

      if (result.errors.length > 0) {
        result.errors.forEach((error) => toast.error(error))
      }

      // Redirect back to subjects page
      router.push('/dashboard/subjects')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to import subjects'
      )
    } finally {
      setIsImporting(false)
    }
  }

  const handleCancel = () => {
    sessionStorage.removeItem('pending_subject_import')
    router.push('/dashboard/subjects')
  }

  if (subjects.length === 0) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Button
        variant="ghost"
        onClick={handleCancel}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Confirm Subject Import</CardTitle>
          <p className="text-sm text-muted-foreground">
            Review and edit subject names before importing ({subjects.length} subjects)
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {subjects.map((subject, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground w-12">
                  {index + 1}.
                </span>
                <Input
                  value={subject.name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  placeholder="Subject name"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={handleCancel} disabled={isImporting}>
              Cancel
            </Button>
            <Button onClick={handleConfirmImport} disabled={isImporting}>
              {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Import
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
