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

interface ImportSubjectsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface SubjectResponse {
  success?: boolean
  data?: Array<{ id?: string; name: string }> | Array<string>
  subjects?: Array<{ id?: string; name: string }> | Array<string>
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
  const [subjects, setSubjects] = useState<Array<{ name: string }>>([])
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load API configurations on dialog open
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

  // Load selected API config
  const loadAPIConfig = (configId: string) => {
    const config = apiConfigurations.find((c) => c.id === configId)
    if (config) {
      setSelectedConfig(config)
      setSelectedClass('')
      setClasses([])
      setSubjects([])
      setError(null)

      // Load classes if school portal
      if (config.isSchoolPortal) {
        loadClasses(config)
      }
    }
  }

  // Fetch classes from external API
  const loadClasses = useCallback(async (config: APIConfiguration) => {
    setIsLoadingClasses(true)
    setError(null)

    try {
      // Build classes endpoint - adjust based on your API structure
      const classesEndpoint = `${config.apiEndpoint}/classes`

      const response = await fetch(classesEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` }),
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch classes: ${response.statusText}`)
      }

      const data = await response.json()

      // Parse response - adjust based on your API structure
      let classList: { classid: string; classname: string }[] = []
      if (Array.isArray(data)) {
        classList = data
      } else if (data.success && data.data) {
        classList = data.data
      } else if (data.classes) {
        classList = data.classes
      }

      setClasses(classList)
    } catch (err) {
      console.error('Failed to load classes', err)
      setError(err instanceof Error ? err.message : 'Failed to load classes')
    } finally {
      setIsLoadingClasses(false)
    }
  }, [])

  // Fetch subjects from external API when class is selected
  const fetchSubjects = useCallback(async () => {
    if (!selectedConfig || !selectedClass) return

    setIsLoadingSubjects(true)
    setError(null)

    try {
      // Build subjects endpoint - passing classid as path parameter
      const endpoint = `${selectedConfig.apiEndpoint}/${selectedClass}/subjects`

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

      // Parse response - support multiple formats
      let subjectList: Array<{ name: string }> = []

      if (Array.isArray(data)) {
        subjectList = data.map(item =>
          typeof item === 'string' ? { name: item } : { name: item.name }
        )
      } else if (data.success && data.data) {
        subjectList = Array.isArray(data.data)
          ? data.data.map(item => typeof item === 'string' ? { name: item } : { name: item.name })
          : []
      } else if (data.subjects) {
        subjectList = Array.isArray(data.subjects)
          ? data.subjects.map(item => typeof item === 'string' ? { name: item } : { name: item.name })
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
  }, [selectedConfig, selectedClass])

  // Fetch subjects when class is selected
  useEffect(() => {
    if (selectedClass && selectedConfig) {
      fetchSubjects()
    }
  }, [selectedClass, selectedConfig, fetchSubjects])

  const handleImport = () => {
    if (subjects.length === 0) {
      toast.error('No subjects to import')
      return
    }

    // Store in sessionStorage for confirmation page
    sessionStorage.setItem('pending_subject_import', JSON.stringify(subjects))

    // Close dialog and redirect
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
          {/* API Configuration Selector */}
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

          {/* Class Selector (appears if School Portal API) */}
          {selectedConfig?.isSchoolPortal && (
            <div>
              <Label htmlFor="class">
                Class <span className="text-red-500">*</span>
              </Label>
              <select
                id="class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
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

          {/* Subject Count Display */}
          {subjects.length > 0 && (
            <div className="p-4 border rounded-lg bg-muted">
              <p className="text-sm font-medium">
                Total subjects found:{' '}
                <span className="text-lg font-bold">{subjects.length}</span>
              </p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-4 border border-destructive rounded-lg bg-destructive/10">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
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
