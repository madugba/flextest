'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/Button'
import { Label } from '@/shared/ui/label'
import { Alert } from '@/shared/ui/Alert'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs'
import { importCandidates } from '@/entities/candidate'
import { getAllCenters, type Center } from '@/entities/center'
import { getAllExamSessions, type ExamSession } from '@/entities/exam-session'
import { getAllAPIConfigurations, type APIConfiguration } from '@/entities/api-configuration'
import { ApiError } from '@/shared/api/client'
import { toast } from 'sonner'

interface ImportCandidatesDialogProps {
  onSuccess?: (count: number) => void
}

export function ImportCandidatesDialog({ onSuccess }: ImportCandidatesDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [importTab, setImportTab] = useState('json')

  // JSON import state
  const [jsonData, setJsonData] = useState('')

  // API import state
  const [centers, setCenters] = useState<Center[]>([])
  const [examSessions, setExamSessions] = useState<ExamSession[]>([])
  const [apiConfigurations, setApiConfigurations] = useState<APIConfiguration[]>([])
  const [selectedCenterId, setSelectedCenterId] = useState('')
  const [selectedExamSessionId, setSelectedExamSessionId] = useState('')
  const [selectedConfigId, setSelectedConfigId] = useState('')
  const [selectedConfig, setSelectedConfig] = useState<APIConfiguration | null>(null)
  const [selectedClass, setSelectedClass] = useState('')

  // Excel import state
  const [excelFile, setExcelFile] = useState<File | null>(null)

  const loadCenters = useCallback(async () => {
    try {
      const data = await getAllCenters()
      setCenters(data)
      if (data.length > 0) {
        setSelectedCenterId(data[0].id)
      }
    } catch (err) {
      console.error('Failed to load centers', err)
    }
  }, [])

  const loadExamSessions = useCallback(async () => {
    try {
      const data = await getAllExamSessions() // Get all sessions
      // Filter to show only SCHEDULED or ACTIVE sessions
      const activeSessions = data.filter(
        session => session.status === 'SCHEDULED' || session.status === 'ACTIVE'
      )
      setExamSessions(activeSessions)
      if (activeSessions.length > 0) {
        setSelectedExamSessionId(activeSessions[0].id)
      }
    } catch (err) {
      console.error('Failed to load exam sessions', err)
    }
  }, [])

  const loadAPIConfigurations = useCallback(async () => {
    try {
      const data = await getAllAPIConfigurations()
      setApiConfigurations(data)
    } catch (err) {
      console.error('Failed to load API configurations', err)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      loadCenters()
      loadExamSessions()
      loadAPIConfigurations()
    }
  }, [isOpen, loadCenters, loadExamSessions, loadAPIConfigurations])

  const loadAPIConfig = (configId: string) => {
    const config = apiConfigurations.find((c) => c.id === configId)
    if (config) {
      setSelectedConfig(config)
      setSelectedClass('') // Reset class selection when config changes
    } else {
      setSelectedConfig(null)
      setSelectedClass('')
    }
  }

  const handleOpen = () => {
    setIsOpen(true)
    setError(null)
  }

  const handleClose = () => {
    setIsOpen(false)
    setError(null)
    resetForm()
  }

  const resetForm = () => {
    setJsonData('')
    setSelectedConfigId('')
    setSelectedConfig(null)
    setSelectedClass('')
    setExcelFile(null)
    setImportTab('json')
    // Reset to first items if available
    if (centers.length > 0) setSelectedCenterId(centers[0].id)
    if (examSessions.length > 0) setSelectedExamSessionId(examSessions[0].id)
  }

  const handleImport = async () => {
    if (importTab === 'json') {
      await handleImportFromJson()
    } else if (importTab === 'api') {
      await handleImportFromApi()
    } else {
      await handleImportFromExcel()
    }
  }

  const handleImportFromJson = async () => {
    try {
      setError(null)
      setIsLoading(true)

      let candidates
      try {
        candidates = JSON.parse(jsonData)
      } catch {
        throw new Error('Invalid JSON format')
      }

      if (!Array.isArray(candidates)) {
        throw new Error('JSON must be an array of candidates')
      }

      const result = await importCandidates({ candidates })

      handleClose()
      if (result.failed > 0) {
        toast.warning('Import completed with errors', {
          description: `Success: ${result.success}, Failed: ${result.failed}`,
        })
      } else {
        toast.success('Import completed', {
          description: `Successfully imported ${result.success} candidates`,
        })
      }
      onSuccess?.(result.success)
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError(err instanceof Error ? err.message : 'Failed to import candidates')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleImportFromApi = async () => {
    if (!selectedCenterId) {
      setError('Please select a center')
      return
    }

    if (!selectedExamSessionId) {
      setError('Please select an exam session')
      return
    }

    if (!selectedConfig) {
      setError('Please select an API configuration')
      return
    }

    if (selectedConfig.isSchoolPortal && !selectedClass) {
      setError('Please select a class for school portal import')
      return
    }

    try {
      setError(null)
      setIsLoading(true)

      // Fetch from API
      const response = await fetch(selectedConfig.apiEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(selectedConfig.apiKey && { 'Authorization': `Bearer ${selectedConfig.apiKey}` }),
        },
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()

      // Extract candidates array
      let candidates = []
      if (Array.isArray(data)) {
        candidates = data
      } else if (data.candidates && Array.isArray(data.candidates)) {
        candidates = data.candidates
      } else if (data.data && Array.isArray(data.data)) {
        candidates = data.data
      } else {
        throw new Error('Invalid API response format. Expected array of candidates.')
      }

      const result = await importCandidates({ candidates })

      handleClose()
      if (result.failed > 0) {
        toast.warning('Import completed with errors', {
          description: `Success: ${result.success}, Failed: ${result.failed}`,
        })
      } else {
        toast.success('Import completed', {
          description: `Successfully imported ${result.success} candidates from API`,
        })
      }
      onSuccess?.(result.success)
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError(err instanceof Error ? err.message : 'Failed to import from API')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleImportFromExcel = async () => {
    if (!excelFile) {
      setError('Please select an Excel file')
      return
    }

    try {
      setError(null)
      setIsLoading(true)

      // TODO: Implement Excel import
      toast.error('Excel import not yet implemented', {
        description: 'This feature will be available soon',
      })
      setIsLoading(false)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to import from Excel')
      setIsLoading(false)
    }
  }

  const exampleJson = `[
  {
    "surname": "Doe",
    "firstname": "John",
    "othername": "Michael",
    "email": "john.doe@example.com",
    "phone": "+234 800 123 4567",
    "sessionId": "your-session-id-here",
    "picture": "https://example.com/photo.jpg",
    "subjects": ["subject-id-1", "subject-id-2"]
  }
]`

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? handleOpen() : handleClose())}>
      <DialogTrigger asChild>
        <Button variant="outline">Import Candidates</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Candidates</DialogTitle>
          <DialogDescription>
            Choose your import method below
          </DialogDescription>
        </DialogHeader>

        {error && <Alert variant="destructive">{error}</Alert>}

        <Tabs value={importTab} onValueChange={setImportTab} className="mt-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="json">JSON</TabsTrigger>
            <TabsTrigger value="api">From API</TabsTrigger>
            <TabsTrigger value="excel">From Excel</TabsTrigger>
          </TabsList>

          {/* JSON Import Tab */}
          <TabsContent value="json" className="space-y-3 pt-3">
            <div className="space-y-3">
              <div>
                <Label htmlFor="jsonData">JSON Data</Label>
                <textarea
                  id="jsonData"
                  className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono mt-1.5"
                  placeholder={exampleJson}
                  value={jsonData}
                  onChange={(e) => setJsonData(e.target.value)}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-xs text-blue-800">
                  <strong>Required:</strong> surname, firstname, sessionId, subjects (array, 1-6 items)
                  <br />
                  <strong>Optional:</strong> email, othername, phone, picture
                </p>
              </div>
            </div>
          </TabsContent>

          {/* API Import Tab */}
          <TabsContent value="api" className="space-y-3 pt-3">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Center <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedCenterId}
                  onChange={(e) => setSelectedCenterId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a center...</option>
                  {centers.map((center) => (
                    <option key={center.id} value={center.id}>
                      {center.centerName} - {center.state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Exam Session <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedExamSessionId}
                  onChange={(e) => setSelectedExamSessionId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select an exam session...</option>
                  {examSessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      {session.name} - {new Date(session.date).toLocaleDateString()} @ {session.time}
                      {session.center && ` (${session.center.centerName})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  API Configuration <span className="text-red-500">*</span>
                </label>
                <select
                  aria-label="Select an API configuration"
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

              {selectedConfig?.isSchoolPortal && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Class <span className="text-red-500">*</span>
                  </label>
                  <select
                    aria-label="Select a class"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select a class...</option>
                    {/* Classes will be populated from API later */}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Select the class for school portal import
                  </p>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-xs text-blue-800">
                  <strong>Note:</strong> API endpoint and authentication are configured in the selected API configuration.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Excel Import Tab */}
          <TabsContent value="excel" className="space-y-3 pt-3">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Excel File <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                />
                {excelFile && (
                  <p className="mt-1.5 text-xs text-gray-600">
                    Selected: {excelFile.name}
                  </p>
                )}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                <p className="text-xs text-amber-800">
                  <strong>Coming Soon:</strong> Excel import will be available in the next update.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={isLoading}>
            {isLoading ? 'Importing...' : `Import from ${importTab === 'json' ? 'JSON' : importTab === 'api' ? 'API' : 'Excel'}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
