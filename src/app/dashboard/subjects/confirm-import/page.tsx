'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { confirmImportSubjects } from '@/entities/subject'
import { toast } from 'sonner'
import { Loader2, ArrowLeft, X, Search } from 'lucide-react'

interface PendingSubject {
  subjectid?: string
  subjectname: string
  name?: string
}



export default function ConfirmImportPage() {
  const router = useRouter()
  const [subjects, setSubjects] = useState<PendingSubject[]>([])
  const [isImporting, setIsImporting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const pending = sessionStorage.getItem('pending_subject_import')
    if (!pending) {
      toast.error('No pending import found')
      router.push('/dashboard/subjects')
      return
    }

    try {
      const parsed = JSON.parse(pending)
      const subjectsArray = Array.isArray(parsed) ? parsed : [parsed]
      const normalized = subjectsArray
        .filter((s) => s !== null && s !== undefined)
        .map((s): PendingSubject => {
          if (typeof s === 'string') {
            return { subjectname: s }
          }
          if (typeof s === 'object' && s !== null) {
            const subjectid = typeof s.subjectid === 'string' ? s.subjectid : 
                             (typeof s.id === 'string' ? s.id : undefined)
            
            const subjectname = typeof s.subjectname === 'string' ? s.subjectname :
                               (typeof s.name === 'string' ? s.name :
                               (s.subject && typeof s.subject === 'string' ? s.subject : ''))
            
            return {
              subjectid,
              subjectname
            }
          }
          return { subjectname: '' }
        })
      
      if (normalized.length === 0) {
        toast.error('No valid subjects found in import data')
        router.push('/dashboard/subjects')
        return
      }
      
      setSubjects(normalized)
    } catch (error) {
      console.error('Failed to parse import data:', error)
      toast.error('Invalid import data format')
      router.push('/dashboard/subjects')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const filteredSubjects = useMemo(() => {
    if (!searchQuery.trim()) {
      return subjects.map((subject, index) => ({ subject, originalIndex: index }))
    }
    const query = searchQuery.toLowerCase()
    return subjects
      .map((subject, index) => ({ subject, originalIndex: index }))
      .filter(({ subject }) => {
        const name = subject?.subjectname || subject?.name || ''
        return typeof name === 'string' && name.toLowerCase().includes(query)
      })
  }, [subjects, searchQuery])

  const validSubjectsCount = useMemo(() => {
    return subjects.filter((s) => {
      const name = s?.subjectname || s?.name || ''
      return typeof name === 'string' && name.trim().length > 0
    }).length
  }, [subjects])

  const handleNameChange = (index: number, newName: string) => {
    setSubjects((prev) => {
      const updated = prev.map((subject, i) =>
        i === index ? { ...subject, subjectname: newName } : subject
      )
      sessionStorage.setItem('pending_subject_import', JSON.stringify(updated))
      return updated
    })
  }

  const handleRemoveSubject = (index: number) => {
    setSubjects((prev) => {
      const updated = prev.filter((_, i) => i !== index)
      sessionStorage.setItem('pending_subject_import', JSON.stringify(updated))
      return updated
    })
    toast.success('Subject removed from import list')
  }

  const handleConfirmImport = async () => {
    const validSubjects = subjects
      .filter((s) => {
        const name = s?.subjectname || s?.name || ''
        return typeof name === 'string' && name.trim().length > 0
      })
      .map((s) => {
        const trimmedName = (s.subjectname || s.name || '').trim()
        return {
          subjectid: s.subjectid,
          subjectname: trimmedName,
          name: trimmedName,
        }
      })
    
    if (validSubjects.length === 0) {
      toast.error('Please provide at least one valid subject name')
      return
    }

    if (validSubjects.length < subjects.length) {
      const emptyCount = subjects.length - validSubjects.length
      toast.warning(`${emptyCount} subject(s) with empty names will be skipped`)
    }

    setIsImporting(true)

    try {
      console.log('[Confirm Import] Sending subjects to backend:', validSubjects)
      console.log('[Confirm Import] Sample subject:', validSubjects[0])
      
      const result = await confirmImportSubjects({ subjects: validSubjects })

      sessionStorage.removeItem('pending_subject_import')

      toast.success(
        `Import complete: ${result.created} created, ${result.skipped} skipped`
      )

      if (result.errors.length > 0) {
        result.errors.forEach((error) => toast.error(error))
      }

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (subjects.length === 0) {
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
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No subjects to import</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl pb-20">
      <Button
        variant="ghost"
        onClick={handleCancel}
        className="mb-4"
        disabled={isImporting}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Confirm Subject Import</CardTitle>
          <p className="text-sm text-muted-foreground">
            Review and edit subject names before importing ({subjects.length} total, {validSubjectsCount} valid)
          </p>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Subjects List */}
          <div className="space-y-2 max-h-[50vh] overflow-y-auto mb-4">
            {filteredSubjects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No subjects found matching &quot;{searchQuery}&quot;
              </div>
            ) : (
              filteredSubjects.map(({ subject, originalIndex }) => {
                const subjectName = subject?.subjectname || subject?.name || ''
                const subjectId = subject?.subjectid
                const isEmpty = subjectName.trim().length === 0

                return (
                  <div
                    key={originalIndex}
                    className={`flex items-center gap-2 p-2 rounded-md ${
                      isEmpty ? 'bg-destructive/10 border border-destructive/20' : 'hover:bg-muted'
                    }`}
                  >
                    <span className="text-sm text-muted-foreground w-8 flex-shrink-0">
                      {originalIndex + 1}.
                    </span>
                    {subjectId && (
                      <span className="text-xs text-muted-foreground w-24 flex-shrink-0 font-mono">
                        ID: {subjectId}
                      </span>
                    )}
                    <Input
                      value={subjectName}
                      onChange={(e) => handleNameChange(originalIndex, e.target.value)}
                      placeholder="Subject name"
                      className={isEmpty ? 'border-destructive' : ''}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSubject(originalIndex)}
                      disabled={isImporting}
                      className="flex-shrink-0"
                      aria-label="Remove subject"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )
              })
            )}
          </div>

          {/* Validation Warning */}
          {subjects.some((s) => {
            const name = s?.subjectname || s?.name || ''
            return !name || typeof name !== 'string' || name.trim().length === 0
          }) && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                ⚠️ Some subjects have empty names and will be skipped during import
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel} disabled={isImporting}>
              Cancel
            </Button>
            <Button onClick={handleConfirmImport} disabled={isImporting || validSubjectsCount === 0}>
              {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Import ({validSubjectsCount})
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
