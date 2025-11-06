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
import { getSubjectsWithQuestionsBySession, type Subject } from '@/entities/subject'
import { ApiError } from '@/shared/api/client'
import { toast } from 'sonner'
import { importApi } from '@/shared/api/importApi'
import * as XLSX from 'xlsx'
import { Download } from 'lucide-react'

interface ImportCandidatesDialogProps {
  onSuccess?: (count: number) => void
}

interface SchoolPortalStudent {
  studentid: string
  surname: string
  firstname: string
  othername?: string
  picture?: string
}

interface SchoolPortalResponse {
  success: boolean
  data?: SchoolPortalStudent[]
  students?: SchoolPortalStudent[]
  message?: string
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
  const [classes, setClasses] = useState<{ classid: string; classname: string }[]>([])
  const [subClasses, setSubClasses] = useState<{ classarmid: string; classarmname: string }[]>([])
  const [selectedSubClassId, setSelectedSubClassId] = useState('')
  const [isLoadingClasses, setIsLoadingClasses] = useState(false)
  const [isLoadingSubClasses, setIsLoadingSubClasses] = useState(false)

  // Subject selection state
  const [availableSubjects, setAvailableSubjects] = useState<Array<Subject & { questionCount: number }>>([])
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false)

  // Students caching and active list
  const [classStudentsCache, setClassStudentsCache] = useState<Record<string, SchoolPortalStudent[]>>({})
  const [subClassStudentsCache, setSubClassStudentsCache] = useState<Record<string, SchoolPortalStudent[]>>({})
  const [activeStudents, setActiveStudents] = useState<SchoolPortalStudent[]>([])
  const [isLoadingStudents, setIsLoadingStudents] = useState(false)
  const [studentsError, setStudentsError] = useState<string | null>(null)

  // Excel import state
  const [excelFile, setExcelFile] = useState<File | null>(null)
  const [parsedExcelCandidates, setParsedExcelCandidates] = useState<Array<{
    candidateid?: string | null
    lastName: string
    firstName: string
    otherName?: string | null
  }>>([])

  

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
      console.log(data)
      setApiConfigurations(data)
    } catch (err) {
      console.error('Failed to load API configurations', err)
    }
  }, [])


  const loadClasses = useCallback(async () =>{
    try {
      setIsLoadingClasses(true)
      setClasses([])
      setSelectedClass('')
      setSubClasses([])
      setSelectedSubClassId('')
      const response = await importApi.importClass()
      if (response.success && response.data) {
        setClasses(response.data)
      }
    } catch (err) {
      console.error('Failed to load classes', err)
    } finally {
      setIsLoadingClasses(false)
    }
  }, [])

  const loadSubClasses = useCallback(async () => {
    try {
      if (!selectedClass) return
      setIsLoadingSubClasses(true)
      setSubClasses([])
      setSelectedSubClassId('')
      const response = await importApi.importSubClass(selectedClass)
      if (response.success && response.data) {
        setSubClasses(response.data)
      }
    } catch (err) {
      console.error('Failed to load sub classes', err)
    } finally {
      setIsLoadingSubClasses(false)
    }
  }, [selectedClass])

  // Build endpoint helpers for school portal
  const buildClassEndpoint = (base: string, classid: string) => {
    const baseEndpoint = base.endsWith('/') ? base.slice(0, -1) : base
    return `${baseEndpoint}/${classid}/`
  }
  const buildSubClassEndpoint = (base: string, classid: string, subclassid: string) => {
    const baseEndpoint = base.endsWith('/') ? base.slice(0, -1) : base
    return `${baseEndpoint}/${classid}/${subclassid}`
  }

  // Robust fetch helper with timeout and clearer errors
  const fetchJsonWithTimeout = async (url: string, headers: HeadersInit, timeoutMs = 15000): Promise<unknown> => {
    try {
      // Ensure absolute URL
      const absoluteUrl = /^https?:\/\//i.test(url) ? url : `https://${url.replace(/^\/+/, '')}`
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
      const res = await fetch(absoluteUrl, {
        method: 'GET',
        headers,
        mode: 'cors',
        cache: 'no-store',
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(`HTTP ${res.status} ${res.statusText}${text ? ` - ${text.substring(0, 120)}` : ''}`)
      }
      return res.json()
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        throw new Error('Request timed out')
      }
      throw err
    }
  }

  // Fetch students for a class (class-only)
  const fetchClassStudents = useCallback(async () => {
    if (!selectedConfig || !selectedConfig.isSchoolPortal || !selectedClass) return
    // Return cached if present
    if (classStudentsCache[selectedClass]) {
      setActiveStudents(classStudentsCache[selectedClass])
      return
    }
    setIsLoadingStudents(true)
    setStudentsError(null)
    try {
      const endpoint = buildClassEndpoint(selectedConfig.apiEndpoint, selectedClass)
      const response = await fetchJsonWithTimeout(endpoint, {
        'Content-Type': 'application/json',
        ...(selectedConfig.apiKey && { 'Authorization': `Bearer ${selectedConfig.apiKey}` }),
      }) as SchoolPortalResponse | SchoolPortalStudent[]
      
      // Handle both array and object responses
      let students: SchoolPortalStudent[] = []
      if (Array.isArray(response)) {
        students = response
      } else {
        const apiResponse = response as SchoolPortalResponse
        if (apiResponse.success === false) {
          throw new Error(apiResponse.message || 'API request was not successful')
        }
        students = apiResponse.data || apiResponse.students || []
      }
      setClassStudentsCache(prev => ({ ...prev, [selectedClass]: students }))
      setActiveStudents(students)
    } catch (err) {
      console.error('Failed to fetch class students', err)
      setStudentsError(err instanceof Error ? err.message : 'Failed to fetch class students')
      setActiveStudents([])
    } finally {
      setIsLoadingStudents(false)
    }
  }, [selectedConfig, selectedClass, classStudentsCache])

  // Fetch students for a sub-class (overrides class-only list)
  const fetchSubClassStudents = useCallback(async () => {
    if (!selectedConfig || !selectedConfig.isSchoolPortal || !selectedClass || !selectedSubClassId) return
    const key = `${selectedClass}:${selectedSubClassId}`
    if (subClassStudentsCache[key]) {
      setActiveStudents(subClassStudentsCache[key])
      return
    }
    setIsLoadingStudents(true)
    setStudentsError(null)
    try {
      const endpoint = buildSubClassEndpoint(selectedConfig.apiEndpoint, selectedClass, selectedSubClassId)
      const response = await fetchJsonWithTimeout(endpoint, {
        'Content-Type': 'application/json',
        ...(selectedConfig.apiKey && { 'Authorization': `Bearer ${selectedConfig.apiKey}` }),
      }) as SchoolPortalResponse | SchoolPortalStudent[]
      
      console.log('candidate information from school portal ', response)
      
      // Handle both array and object responses
      let students: SchoolPortalStudent[] = []
      if (Array.isArray(response)) {
        students = response
      } else {
        const apiResponse = response as SchoolPortalResponse
        if (apiResponse.success === false) {
          throw new Error(apiResponse.message || 'API request was not successful')
        }
        students = apiResponse.data || apiResponse.students || []
      }
      setSubClassStudentsCache(prev => ({ ...prev, [key]: students }))
      setActiveStudents(students)
    } catch (err) {
      console.error('Failed to fetch sub class students', err)
      setStudentsError(err instanceof Error ? err.message : 'Failed to fetch sub class students')
      setActiveStudents([])
    } finally {
      setIsLoadingStudents(false)
    }
  }, [selectedConfig, selectedClass, selectedSubClassId, subClassStudentsCache])

  const loadSubjectsForSession = useCallback(async () => {
    if (!selectedExamSessionId) {
      setAvailableSubjects([])
      setSelectedSubjects([])
      return
    }

    try {
      setIsLoadingSubjects(true)
      const subjects = await getSubjectsWithQuestionsBySession(selectedExamSessionId)
      setAvailableSubjects(subjects)
      setSelectedSubjects([])
    } catch (err) {
      console.error('Failed to load subjects', err)
      toast.error('Failed to load subjects for this session')
    } finally {
      setIsLoadingSubjects(false)
    }
  }, [selectedExamSessionId])

  useEffect(() => {
    if (selectedClass) {
      loadSubClasses()
      // Fetch class-level students when class changes
      fetchClassStudents()
    }
  }, [selectedClass, loadSubClasses, fetchClassStudents])

  // When sub class changes, fetch sub-class students and override active list
  useEffect(() => {
    if (selectedSubClassId) {
      fetchSubClassStudents()
    } else if (selectedClass) {
      // If sub-class cleared, revert to class-only students if present
      if (classStudentsCache[selectedClass]) {
        setActiveStudents(classStudentsCache[selectedClass])
      }
    }
  }, [selectedSubClassId, selectedClass, fetchSubClassStudents, classStudentsCache])

  useEffect(() => {
    if (selectedExamSessionId) {
      loadSubjectsForSession()
    }
  }, [selectedExamSessionId, loadSubjectsForSession])

  useEffect(() => {
    if (isOpen) {
      loadCenters()
      loadExamSessions()
      loadAPIConfigurations()
      // loadClasses()
    }
  }, [isOpen, loadCenters, loadExamSessions, loadAPIConfigurations])

  const loadAPIConfig = (configId: string) => {
    const config = apiConfigurations.find((c) => c.id === configId)
    if (config) {
      setSelectedConfig(config)
      setSelectedClass('')
      setSubClasses([])
      setSelectedSubClassId('')
      setClassStudentsCache({})
      setSubClassStudentsCache({})
      setActiveStudents([])
    } else {
      setSelectedConfig(null)
      setSelectedClass('')
      setSubClasses([])
      setSelectedSubClassId('')
      setClassStudentsCache({})
      setSubClassStudentsCache({})
      setActiveStudents([])
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
    setClasses([])
    setSubClasses([])
    setSelectedSubClassId('')
    setAvailableSubjects([])
    setSelectedSubjects([])
    setExcelFile(null)
    setParsedExcelCandidates([])
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

      // Show loading toast for user feedback
      toast.loading(`Importing ${candidates.length} candidate(s)...`, {
        id: 'import-loading',
      });

      const result = await importCandidates({ candidates })

      // Dismiss loading toast
      toast.dismiss('import-loading');

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
      const errorMessage = err instanceof ApiError
        ? err.message
        : err instanceof Error
          ? err.message
          : 'Failed to import candidates';

      // Dismiss loading toast before showing error
      toast.dismiss('import-loading');

      setError(errorMessage);
      toast.error('Import failed', {
        description: errorMessage,
      });
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

    if (!selectedSubjects.length) {
      setError('Please select at least one subject')
      return
    }

    if (selectedSubjects.length > 4) {
      setError('Maximum 4 subjects allowed')
      return
    }

    try {
      setError(null)
      setIsLoading(true)

      // Use cached students based on selection
      const candidatesSource = selectedSubClassId
        ? subClassStudentsCache[`${selectedClass}:${selectedSubClassId}`]
        : classStudentsCache[selectedClass]

      if (!candidatesSource || candidatesSource.length === 0) {
        throw new Error('No candidates loaded. Please select a class/sub-class to fetch students first.')
      }

      // Show loading toast for user feedback
      toast.loading(`Importing ${candidatesSource.length} candidate(s) from API...`, {
        id: 'import-loading',
      });

      // Transform students to backend import DTO - matches backend candidate.service.ts importCandidates signature
      const transformedCandidates = candidatesSource
        .map((student) => {
          // Map studentid to id (required)
          const id = student.studentid?.trim()
          // Required fields
          const surname = student.surname?.trim() || ''
          const firstname = student.firstname?.trim() || ''
          
          // Optional fields - only include if non-empty
          const othername = student.othername?.trim()
          const picture = student.picture?.trim()

          // Validate required fields
          if (!id || !surname || !firstname) {
            return null
          }

          // Build candidate object matching backend DTO exactly
          const candidate: {
            id: string
            surname: string
            firstname: string
            othername?: string
            picture?: string
            sessionId: string
            subjects: string[]
          } = {
            id: String(id),
            surname,
            firstname,
            sessionId: selectedExamSessionId,
            subjects: selectedSubjects,
          }

          // Only add optional fields if they have values
          if (othername && othername !== '') {
            candidate.othername = othername
          }
          if (picture && picture !== '') {
            candidate.picture = picture
          }

          return candidate
        })
        .filter((c): c is {
          id: string
          surname: string
          firstname: string
          othername?: string
          picture?: string
          sessionId: string
          subjects: string[]
        } => c !== null)

      const result = await importCandidates({ candidates: transformedCandidates })

      // Dismiss loading toast
      toast.dismiss('import-loading');

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
      const errorMessage = err instanceof ApiError
        ? err.message
        : err instanceof Error
          ? err.message
          : 'Failed to import from API';

      // Dismiss loading toast before showing error
      toast.dismiss('import-loading');

      setError(errorMessage);
      toast.error('API Import failed', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false)
    }
  }

  const downloadSampleExcel = () => {
    const sampleData = [
      {
        candidateid: 'BPA/21/043',
        lastName: 'Okpoko',
        firstName: 'Maryann',
        otherName: ''
      },
      {
        candidateid: null,
        lastName: 'Smith',
        firstName: 'John',
        otherName: 'Michael'
      },
      {
        candidateid: 'BPA/23/1114',
        lastName: 'Onyejiaka',
        firstName: 'Ifechukwu',
        otherName: ''
      }
    ]

    const ws = XLSX.utils.json_to_sheet(sampleData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Candidates')
    XLSX.writeFile(wb, 'candidates_sample.xlsx')
    toast.success('Sample file downloaded!')
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setExcelFile(file)

    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      // Column mapping (case-insensitive)
      const normalizeColumnName = (name: string): string => {
        const normalized = name.trim().toLowerCase().replace(/\s+/g, '')
        if (['candidateid', 'candidate id', 'studentid', 'student id'].includes(normalized)) {
          return 'candidateid'
        }
        if (['lastname', 'last name', 'surname'].includes(normalized)) {
          return 'lastName'
        }
        if (['firstname', 'first name', 'given name'].includes(normalized)) {
          return 'firstName'
        }
        if (['othername', 'other name', 'middle name', 'middlename'].includes(normalized)) {
          return 'otherName'
        }
        return normalized
      }

      // Find column indices
      const firstRow = jsonData[0] as Record<string, unknown>
      if (!firstRow) {
        throw new Error('Excel file is empty')
      }

      const columnMap: Record<string, string> = {}
      Object.keys(firstRow).forEach((key) => {
        const normalized = normalizeColumnName(key)
        if (['candidateid', 'lastName', 'firstName', 'otherName'].includes(normalized)) {
          columnMap[normalized] = key
        }
      })

      // Validate required columns
      if (!columnMap.lastName || !columnMap.firstName) {
        throw new Error('Excel file must contain "lastName" and "firstName" columns')
      }

      // Parse and validate data
      const candidates = (jsonData as Record<string, unknown>[]).map((row, index) => {
        const candidateid = columnMap.candidateid ? String(row[columnMap.candidateid] || '').trim() : null
        const lastName = String(row[columnMap.lastName] || '').trim()
        const firstName = String(row[columnMap.firstName] || '').trim()
        const otherName = columnMap.otherName ? String(row[columnMap.otherName] || '').trim() : null

        // Validate required fields
        if (!lastName || !firstName) {
          throw new Error(`Row ${index + 2} is missing required fields (lastName or firstName)`)
        }

        return {
          candidateid: candidateid && candidateid !== '' ? candidateid : null,
          lastName,
          firstName,
          otherName: otherName && otherName !== '' ? otherName : null,
        }
      })

      setParsedExcelCandidates(candidates)
      toast.success(`Parsed ${candidates.length} candidates successfully!`)
    } catch (err: unknown) {
      console.error('[handleFileSelect] Error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to parse Excel file'
      toast.error(errorMessage)
      setExcelFile(null)
      setParsedExcelCandidates([])
    }
  }

  const handleImportFromExcel = async () => {
    if (!excelFile || parsedExcelCandidates.length === 0) {
      setError('Please select an Excel file and ensure it contains valid candidate data')
      return
    }

    if (!selectedExamSessionId) {
      setError('Please select an exam session')
      return
    }

    if (!selectedSubjects || selectedSubjects.length === 0) {
      setError('Please select at least one subject')
      return
    }

    try {
      setError(null)
      setIsLoading(true)

      // Show loading toast for user feedback
      toast.loading(`Importing ${parsedExcelCandidates.length} candidate(s) from Excel...`, {
        id: 'import-loading',
      });

      // Transform Excel data to backend DTO format
      const transformedCandidates = parsedExcelCandidates
        .map((candidate) => {
          const surname = candidate.lastName?.trim() || ''
          const firstname = candidate.firstName?.trim() || ''
          const othername = candidate.otherName?.trim()
          const candidateid = candidate.candidateid?.trim()

          // Validate required fields
          if (!surname || !firstname) {
            return null
          }

          // Build candidate object matching backend DTO
          const candidateDto: {
            id?: string
            surname: string
            firstname: string
            othername?: string
            sessionId: string
            subjects: string[]
          } = {
            surname,
            firstname,
            sessionId: selectedExamSessionId,
            subjects: selectedSubjects,
          }

          // Only add id if candidateid is provided
          if (candidateid && candidateid !== '') {
            candidateDto.id = candidateid
          }

          // Only add othername if provided
          if (othername && othername !== '') {
            candidateDto.othername = othername
          }

          return candidateDto
        })
        .filter((c): c is {
          id?: string
          surname: string
          firstname: string
          othername?: string
          sessionId: string
          subjects: string[]
        } => c !== null)

      if (transformedCandidates.length === 0) {
        throw new Error('No valid candidates to import')
      }

      const result = await importCandidates({ candidates: transformedCandidates })

      // Dismiss loading toast
      toast.dismiss('import-loading');

      handleClose()
      if (result.failed > 0) {
        toast.warning('Import completed with errors', {
          description: `Success: ${result.success}, Failed: ${result.failed}`,
        })
      } else {
        toast.success('Import completed', {
          description: `Successfully imported ${result.success} candidates from Excel`,
        })
      }
      onSuccess?.(result.success)
    } catch (err: unknown) {
      const errorMessage = err instanceof ApiError
        ? err.message
        : err instanceof Error
          ? err.message
          : 'Failed to import from Excel';

      // Dismiss loading toast before showing error
      toast.dismiss('import-loading');

      setError(errorMessage);
      toast.error('Excel Import failed', {
        description: errorMessage,
      });
    } finally {
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
                  aria-label="Select a center"
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
                  aria-label="Select an exam session"
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
                    loadClasses()
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
                    onChange={(e) => {
                      setSelectedClass(e.target.value)
                    }}
                    disabled={isLoadingClasses || classes.length === 0}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <option value="">{isLoadingClasses ? 'Loading classes...' : 'Select a class...'}</option>
                    {!isLoadingClasses && classes.map(({ classid, classname }: { classid: string; classname: string }) => (
                      <option key={classid} value={classid}>{classname}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Select the class for school portal import
                  </p>
                </div>
              )}

              {selectedClass && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Sub Class <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <select
                    aria-label="Select classarm" 
                    value={selectedSubClassId}
                    onChange={(e) => {
                      setSelectedSubClassId(e.target.value)
                    }}
                    disabled={isLoadingSubClasses || subClasses.length === 0}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <option value="">{isLoadingSubClasses ? 'Loading sub classes...' : subClasses.length === 0 ? 'No sub classes available' : 'Select a sub class (optional)...'}</option>
                    {!isLoadingSubClasses && subClasses.map(({ classarmid, classarmname }: { classarmid: string; classarmname: string }) => (
                      <option key={classarmid} value={classarmid}>{classarmname}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    {isLoadingStudents
                      ? 'Fetching students…'
                      : studentsError
                        ? `Failed to fetch students: ${studentsError}`
                        : selectedSubClassId
                          ? `Total students (sub-class): ${activeStudents.length}`
                          : selectedClass
                            ? `Total students (class): ${activeStudents.length}`
                            : ''}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {selectedSubClassId ? 'Candidates will be fetched from the selected sub class.' : 'If no sub class is selected, all students from the class will be fetched.'}
                  </p>
                </div>
              )}

              {selectedExamSessionId && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Subjects <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-500 ml-2">
                      (Select up to 4 subjects)
                    </span>
                  </label>
                  <div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto">
                    {isLoadingSubjects ? (
                      <p className="text-sm text-gray-500">Loading subjects...</p>
                    ) : availableSubjects.length === 0 ? (
                      <p className="text-sm text-gray-500">No subjects available for this session</p>
                    ) : (
                      <div className="space-y-2">
                        {availableSubjects.map((subject) => (
                          <label
                            key={subject.id}
                            className={`flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50 ${
                              selectedSubjects.includes(subject.id) ? 'bg-blue-50' : ''
                            }`}
                          >
                            <input
                              type="checkbox"
                              value={subject.id}
                              checked={selectedSubjects.includes(subject.id)}
                              disabled={
                                !selectedSubjects.includes(subject.id) &&
                                selectedSubjects.length >= 4
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  if (selectedSubjects.length < 4) {
                                    setSelectedSubjects([...selectedSubjects, subject.id])
                                  }
                                } else {
                                  setSelectedSubjects(
                                    selectedSubjects.filter(id => id !== subject.id)
                                  )
                                }
                              }}
                              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <span className="text-sm flex-1">
                              {subject.name}
                              <span className="text-xs text-gray-500 ml-2">
                                ({subject.questionCount} questions)
                              </span>
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  {selectedSubjects.length > 0 && (
                    <p className="mt-1 text-xs text-blue-600">
                      Selected: {selectedSubjects.length} subject(s)
                    </p>
                  )}
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
                  Center <span className="text-red-500">*</span>
                </label>
                <select
                  aria-label="Select a center"
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
                  aria-label="Select an exam session"
                  value={selectedExamSessionId}
                  onChange={(e) => setSelectedExamSessionId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select an exam session...</option>
                  {examSessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      {session.name} ({session.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Excel File <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    aria-label="Select an Excel file"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                    className="flex-1 text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={downloadSampleExcel}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Sample
                  </Button>
                </div>
                {excelFile && (
                  <p className="mt-1.5 text-xs text-gray-600">
                    Selected: {excelFile.name}
                    {parsedExcelCandidates.length > 0 && (
                      <span className="ml-2 text-green-600">
                        ({parsedExcelCandidates.length} candidates parsed)
                      </span>
                    )}
                  </p>
                )}
              </div>

              {selectedExamSessionId && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Subjects <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-500 ml-2">
                      (Select up to 4 subjects)
                    </span>
                  </label>
                  <div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto">
                    {isLoadingSubjects ? (
                      <p className="text-sm text-gray-500">Loading subjects...</p>
                    ) : availableSubjects.length === 0 ? (
                      <p className="text-sm text-gray-500">No subjects available for this session</p>
                    ) : (
                      <div className="space-y-2">
                        {availableSubjects.map((subject) => (
                          <label
                            key={subject.id}
                            className={`flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50 ${
                              selectedSubjects.includes(subject.id) ? 'bg-blue-50' : ''
                            }`}
                          >
                            <input
                              type="checkbox"
                              value={subject.id}
                              checked={selectedSubjects.includes(subject.id)}
                              disabled={
                                !selectedSubjects.includes(subject.id) &&
                                selectedSubjects.length >= 4
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  if (selectedSubjects.length < 4) {
                                    setSelectedSubjects([...selectedSubjects, subject.id])
                                  }
                                } else {
                                  setSelectedSubjects(
                                    selectedSubjects.filter(id => id !== subject.id)
                                  )
                                }
                              }}
                              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <span className="text-sm flex-1">
                              {subject.name}
                              <span className="text-xs text-gray-500 ml-2">
                                ({subject.questionCount} questions)
                              </span>
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  {selectedSubjects.length > 0 && (
                    <p className="mt-1 text-xs text-blue-600">
                      Selected: {selectedSubjects.length} subject(s)
                    </p>
                  )}
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-xs text-blue-800">
                  <strong>Excel Format:</strong> The file should contain columns: candidateid (optional), lastName, firstName, otherName (optional).
                  <br />
                  <strong>Required:</strong> lastName, firstName, sessionId, subjects
                  <br />
                  <strong>Optional:</strong> candidateid (auto-generated if not provided), otherName
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
