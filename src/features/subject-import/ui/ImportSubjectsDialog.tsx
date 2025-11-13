'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/Button'
import { Label } from '@/shared/ui/label'
import { getAllAPIConfigurations, type APIConfiguration } from '@/entities/api-configuration'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { importApi } from '@/shared/api/importApi'

interface ImportSubjectsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface SubjectResponse {
  success?: boolean
  data?: Array<{ subjectid?: string; subjectname?: string; id?: string; name?: string }> | Array<string>
  subjects?: Array<{ subjectid?: string; subjectname?: string; id?: string; name?: string }> | Array<string>
  message?: string
}

export function ImportSubjectsDialog({ open, onOpenChange }: ImportSubjectsDialogProps) {
  const router = useRouter()

  const [apiConfigurations, setApiConfigurations] = useState<APIConfiguration[]>([])
  const [selectedConfigId, setSelectedConfigId] = useState('')
  const [selectedConfig, setSelectedConfig] = useState<APIConfiguration | null>(null)
  const [selectedClass, setSelectedClass] = useState('')
  const [classes, setClasses] = useState<{ classid: string; classname: string }[]>([])
  const [isLoadingClasses, setIsLoadingClasses] = useState(false)
  const [subjects, setSubjects] = useState<Array<{ subjectid?: string; subjectname: string }>>([])
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadAPIConfigurations = useCallback(async () => {
    try {
      const data = await getAllAPIConfigurations()
      setApiConfigurations(data)
    } catch (err) {
      console.error('Failed to load API configurations', err)
      toast.error('Failed to load API configurations')
    }
  }, [])

  useEffect(() => {
    if (open) {
      loadAPIConfigurations()
    }
  }, [open, loadAPIConfigurations])

  const loadAPIConfig = (configId: string) => {
    const config = apiConfigurations.find((c) => c.id === configId)
    if (config) {
      setSelectedConfig(config)
      setSelectedClass('')
      setClasses([])
      setSubjects([])
      setError(null)

      loadClasses()
    }
  }

  const loadClasses = useCallback(async () => {
    setIsLoadingClasses(true)
    setError(null)

    try {
      const response = await importApi.importClass()
      if (response?.success && Array.isArray(response.data)) {
        setClasses(response.data)
      } else {
        setClasses([])
      }
    } catch (err) {
      console.error('Failed to load classes', err)
      setError(err instanceof Error ? err.message : 'Failed to load classes')
    } finally {
      setIsLoadingClasses(false)
    }
  }, [])

  const fetchSubjectsForClass = useCallback(async (classId: string) => {
    if (!selectedConfig || !classId) return

    setIsLoadingSubjects(true)
    setError(null)

    try {
      const endpoint = `${selectedConfig.apiEndpoint}/${classId}`

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(selectedConfig.apiKey && { 'Authorization': `Bearer ${selectedConfig.apiKey}` }),
        },
      })

     

      if (!response.ok) {
        throw new Error(`Failed to fetch subjects: ${response.statusText}`)
      }

      const data = await response.json() as SubjectResponse

      console.log('[fetchSubjectsForClass] Data:', data)
      let subjectList: Array<{ subjectid?: string; subjectname: string }> = []

      const parseSubject = (item: unknown): { subjectid?: string; subjectname: string } => {
        if (typeof item === 'string') {
          return { subjectname: item }
        }
        
        if (typeof item !== 'object' || item === null) {
          return { subjectname: String(item) }
        }
        
        const obj = item as Record<string, unknown>
        if (obj.subjectid !== undefined || obj.subjectname !== undefined) {
          return {
            subjectid: typeof obj.subjectid === 'string' ? obj.subjectid : undefined,
            subjectname: typeof obj.subjectname === 'string' ? obj.subjectname : ''
          }
        }
        
        if (obj.id !== undefined || obj.name !== undefined) {
          return {
            subjectid: typeof obj.id === 'string' ? obj.id : undefined,
            subjectname: typeof obj.name === 'string' ? obj.name : ''
          }
        }
        
        return { subjectname: (obj.name || obj.subjectname || String(item)) as string }
      }

      if (Array.isArray(data)) {
        subjectList = data.map(parseSubject)
      } else if (data.success && data.data) {
        subjectList = Array.isArray(data.data)
          ? data.data.map(parseSubject)
          : []
      } else if (data.subjects) {
        subjectList = Array.isArray(data.subjects)
          ? data.subjects.map(parseSubject)
          : []
      }

      if (subjectList.length === 0) {
        throw new Error('No subjects found for this class')
      }

     

      setSubjects(subjectList)
    } catch (err) {
      console.error('Failed to fetch subjects', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch subjects')
      setSubjects([])
    } finally {
      setIsLoadingSubjects(false)
    }
  }, [selectedConfig])

  useEffect(() => {
    if (selectedClass && selectedConfig) {
      fetchSubjectsForClass(selectedClass)
    }
  }, [selectedClass, selectedConfig, fetchSubjectsForClass])

  const handleImport = () => {
    if (subjects.length === 0) {
      toast.error('No subjects to import')
      return
    }

    sessionStorage.setItem('pending_subject_import', JSON.stringify(subjects))

    onOpenChange(false)
    router.push('/dashboard/subjects/confirm-import')
  }

  const handleReset = () => {
    setSelectedConfigId('')
    setSelectedConfig(null)
    setSelectedClass('')
    setClasses([])
    setSubjects([])
    setError(null)
  }
  

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Subjects from API</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="apiConfig">
              API Configuration <span className="text-red-500">*</span>
            </Label>
            <select
              id="apiConfig"
              value={selectedConfigId}
              onChange={(e) => {
                setSelectedConfigId(e.target.value)
                loadAPIConfig(e.target.value)
              }}
              aria-label="Select API configuration"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a saved configuration...</option>
              {apiConfigurations.map((config) => (
                <option key={config.id} value={config.id}>
                  {config.name}
                  {config.isSchoolPortal && ' (School Portal)'}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Configure API endpoints in{' '}
              <a href="/dashboard/settings" className="underline font-semibold">
                Settings
              </a>
            </p>
          </div>

          {selectedConfig && (
            <div>
              <Label htmlFor="class">
                Class <span className="text-red-500">*</span>
              </Label>
              <select
                id="class"
                value={selectedClass}
                onChange={(e) => {
                  const classId = e.target.value
                  setSelectedClass(classId)
                  if (classId) {
                    fetchSubjectsForClass(classId)
                  } else {
                    setSubjects([])
                  }
                }}
                aria-label="Select class"
                disabled={isLoadingClasses || classes.length === 0}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="">
                  {isLoadingClasses ? 'Loading classes...' : 'Select a class...'}
                </option>
                {!isLoadingClasses && classes.map(({ classid, classname }) => (
                  <option key={classid} value={classid}>
                    {classname}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {isLoadingSubjects
                  ? 'Fetching subjects...'
                  : selectedClass && subjects.length > 0
                    ? `Total subjects found: ${subjects.length}`
                    : 'Select a class to fetch subjects'
                }
              </p>
            </div>
          )}

          {subjects.length > 0 && (
            <div className="p-4 border rounded-lg bg-muted">
              <p className="text-sm font-medium">
                Total subjects found:{' '}
                <span className="text-lg font-bold">{subjects.length}</span>
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 border border-destructive rounded-lg bg-destructive/10">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={subjects.length === 0 || isLoadingSubjects}
          >
            {isLoadingSubjects && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Import ({subjects.length})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
