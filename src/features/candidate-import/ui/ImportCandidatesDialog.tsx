'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
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
import * as XLSX from 'xlsx'
import { Download, Search, Loader2, CheckCircle2, XCircle, ChevronDown, ChevronRight } from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ImportCandidatesDialogProps {
  onSuccess?: (count: number) => void
}

interface SchoolPortalStudent {
  studentid: string
  surname: string
  firstname: string
  othername?: string
  picture?: string
  streamId?: string    // for client-side subclass filtering
  streamName?: string  // for building subclass dropdown
  classId?: string
}

// Only classId is substituted via URL — subclassId is derived client-side from stream data
const IMPORT_VALUES = [
  { key: 'classId', label: 'Class ID' },
] as const
type ImportValueKey = typeof IMPORT_VALUES[number]['key']

type StepStatus = 'locked' | 'idle' | 'loading' | 'done' | 'error'

// ---------------------------------------------------------------------------
// Module-level helpers
// ---------------------------------------------------------------------------
async function proxyFetch(url: string, apiKey?: string): Promise<unknown> {
  const response = await fetch('/api/import/proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, apiKey }),
  })
  const data = await response.json() as { error?: string }
  if (!response.ok) throw new Error(data.error ?? `Request failed (${response.status})`)
  return data
}

function extractPlaceholders(template: string): string[] {
  return [...template.matchAll(/\{([^}]+)\}/g)].map((m) => m[1])
}

function buildEndpoint(
  template: string,
  map: Record<string, ImportValueKey>,
  values: Record<ImportValueKey, string>
): string {
  if (!extractPlaceholders(template).length) return template
  let url = template
  for (const [p, key] of Object.entries(map)) {
    if (values[key]) url = url.replace(`{${p}}`, encodeURIComponent(values[key]))
  }
  return url
}

/**
 * Auto-maps placeholders by name heuristic.
 * Falls back to contextDefault for a single unrecognised placeholder.
 */
function smartAutoMap(
  placeholders: string[],
  contextDefault: ImportValueKey
): Record<string, ImportValueKey> {
  const map: Record<string, ImportValueKey> = {}
  for (const p of placeholders) {
    if (p.toLowerCase().includes('class')) map[p] = 'classId'
  }
  // Single unknown placeholder → use context default
  if (placeholders.length === 1 && !map[placeholders[0]]) {
    map[placeholders[0]] = contextDefault
  }
  return map
}

function parseStudent(item: unknown): SchoolPortalStudent | null {
  if (typeof item !== 'object' || item === null) return null
  const o = item as Record<string, unknown>
  const studentid = String(
    o.userCode ?? o.user_code ?? o.studentid ?? o.studentId ?? o.student_id ?? o.id ?? ''
  ).trim()
  const surname   = String(o.surname ?? o.lastName  ?? o.last_name  ?? '').trim()
  const firstname = String(o.firstname ?? o.firstName ?? o.first_name ?? '').trim()
  if (!surname && !firstname) return null
  const pickStr = (...candidates: unknown[]) =>
    candidates.find(v => v != null && v !== '')?.toString().trim() || undefined

  const stream     = typeof o.stream === 'object' && o.stream !== null ? (o.stream as Record<string, unknown>) : null
  const streamId   = String(stream?.id   ?? o.streamId   ?? o.stream_id   ?? '').trim() || undefined
  const streamName = String(stream?.name ?? o.streamName ?? o.stream_name ?? '').trim() || undefined
  const classId    = String(o.classId    ?? o.class_id   ?? stream?.classId ?? '').trim() || undefined

  return {
    studentid: studentid || `${surname}_${firstname}`,
    surname,
    firstname,
    othername: pickStr(o.othername, o.otherName, o.middleName, o.other_name),
    picture:   pickStr(o.picture, o.photo, o.avatar),
    streamId,
    streamName,
    classId,
  }
}


function parseClass(item: unknown): { classid: string; classname: string } | null {
  if (typeof item !== 'object' || item === null) return null
  const o = item as Record<string, unknown>
  const id   = String(o.id ?? o.classid ?? '').trim()
  const name = String(o.name ?? o.classname ?? '').trim()
  if (!id || !name) return null
  return { classid: id, classname: o.level != null ? `${name} ${o.level}` : name }
}

function extractDataArray(response: unknown): unknown[] {
  if (Array.isArray(response)) return response
  if (typeof response === 'object' && response !== null) {
    const r = response as Record<string, unknown>
    if (Array.isArray(r.data))     return r.data
    if (Array.isArray(r.students)) return r.students
    if (Array.isArray(r.items))    return r.items
    if (Array.isArray(r.results))  return r.results
  }
  return []
}

// ---------------------------------------------------------------------------
// StepCard UI component
// ---------------------------------------------------------------------------
function StepCard({
  number,
  title,
  badge,
  status,
  children,
  optional = false,
  collapsible = false,
}: {
  number: number
  title: string
  badge?: string
  status: StepStatus
  children: React.ReactNode
  optional?: boolean
  collapsible?: boolean
}) {
  const [collapsed, setCollapsed] = useState(false)
  const locked  = status === 'locked'
  const loading = status === 'loading'
  const done    = status === 'done'
  const hasErr  = status === 'error'
  const canCollapse = collapsible && done

  return (
    <div
      className={`rounded-xl border transition-all duration-150 ${
        locked
          ? 'border-gray-200 bg-gray-50 pointer-events-none'
          : done
          ? 'border-green-200 bg-green-50/20'
          : hasErr
          ? 'border-red-200 bg-red-50/20'
          : 'border-gray-200 bg-white shadow-sm'
      }`}
    >
      {/* Header row */}
      <div
        role={canCollapse ? 'button' : undefined}
        tabIndex={canCollapse ? 0 : undefined}
        className={`flex items-center gap-3 px-4 py-3 ${canCollapse ? 'cursor-pointer select-none' : ''}`}
        onClick={() => canCollapse && setCollapsed(p => !p)}
        onKeyDown={(e) => { if (canCollapse && (e.key === 'Enter' || e.key === ' ')) setCollapsed(p => !p) }}
      >
        {/* Step number / status icon */}
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
            loading ? 'bg-blue-100 text-blue-600'
            : done   ? 'bg-green-500 text-white'
            : hasErr ? 'bg-red-500 text-white'
            : locked ? 'bg-gray-100 text-gray-400'
                     : 'bg-primary/10 text-primary'
          }`}
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
          : done    ? <CheckCircle2 className="w-4 h-4" />
          : hasErr  ? <XCircle className="w-4 h-4" />
          : locked  ? <span className="text-gray-400">{number}</span>
                    : number}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className={`text-sm font-semibold leading-tight ${locked ? 'text-gray-400' : 'text-gray-800'}`}>
              {title}
            </span>
            {optional && (
              <span className="text-xs text-gray-400 font-normal">(optional)</span>
            )}
          </div>
          {badge && done && (
            <p className="text-xs text-green-700 font-medium mt-0.5 truncate">{badge}</p>
          )}
        </div>

        {canCollapse && (
          collapsed
            ? <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            : <ChevronDown  className="w-4 h-4 text-gray-400 flex-shrink-0" />
        )}
      </div>

      {/* Body */}
      {!locked && (!canCollapse || !collapsed) && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
          {children}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Reusable select styles
// ---------------------------------------------------------------------------
const selectCls = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white'
const labelCls  = 'text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block'

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function ImportCandidatesDialog({ onSuccess }: ImportCandidatesDialogProps) {
  const [isOpen,    setIsOpen]    = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error,     setError]     = useState<string | null>(null)
  const [importTab, setImportTab] = useState('json')
  const [jsonData,  setJsonData]  = useState('')

  // Reference data
  const [centers,           setCenters]           = useState<Center[]>([])
  const [examSessions,      setExamSessions]      = useState<ExamSession[]>([])
  const [apiConfigurations, setApiConfigurations] = useState<APIConfiguration[]>([])
  const [selectedCenterId,      setSelectedCenterId]      = useState('')
  const [selectedExamSessionId, setSelectedExamSessionId] = useState('')

  // ── Class step ──────────────────────────────────────────────────────────
  const [classApiId,       setClassApiId]       = useState('')
  const [classes,          setClasses]          = useState<{ classid: string; classname: string }[]>([])
  const [selectedClassId,  setSelectedClassId]  = useState('')
  const [isLoadingClasses, setIsLoadingClasses] = useState(false)
  const [classesError,     setClassesError]     = useState<string | null>(null)

  // ── Subclass (derived from student stream data, no separate API) ────────
  const [selectedSubclassId, setSelectedSubclassId] = useState('')

  // ── Student step ─────────────────────────────────────────────────────────
  const [studentApiId,        setStudentApiId]        = useState('')
  const [studentPlaceholders, setStudentPlaceholders] = useState<string[]>([])
  const [studentMap,          setStudentMap]          = useState<Record<string, ImportValueKey>>({})
  const [activeStudents,      setActiveStudents]      = useState<SchoolPortalStudent[]>([])
  const [totalStudentCount,   setTotalStudentCount]   = useState<number | null>(null)
  const [isLoadingStudents,   setIsLoadingStudents]   = useState(false)
  const [studentsError,       setStudentsError]       = useState<string | null>(null)

  // ── Subjects ─────────────────────────────────────────────────────────────
  const [availableSubjects, setAvailableSubjects] = useState<Array<Subject & { questionCount: number }>>([])
  const [selectedSubjects,  setSelectedSubjects]  = useState<string[]>([])
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false)
  const [subjectSearch,     setSubjectSearch]     = useState('')

  // ── Excel ─────────────────────────────────────────────────────────────────
  const [excelFile,             setExcelFile]             = useState<File | null>(null)
  const [parsedExcelCandidates, setParsedExcelCandidates] = useState<Array<{
    candidateid?: string | null
    lastName: string
    firstName: string
    otherName?: string | null
  }>>([])

  // ---------------------------------------------------------------------------
  // Derived
  // ---------------------------------------------------------------------------
  const classApiConfig   = useMemo(() => apiConfigurations.find(c => c.id === classApiId)   ?? null, [apiConfigurations, classApiId])
  const studentApiConfig = useMemo(() => apiConfigurations.find(c => c.id === studentApiId) ?? null, [apiConfigurations, studentApiId])

  const runtimeValues = useMemo(
    (): Record<ImportValueKey, string> => ({ classId: selectedClassId }),
    [selectedClassId]
  )

  const studentAllMapped = useMemo(
    () => studentPlaceholders.every(p => !!studentMap[p]),
    [studentPlaceholders, studentMap]
  )
  const studentAmbiguous = useMemo(
    () => studentPlaceholders.filter(p => !studentMap[p]),
    [studentPlaceholders, studentMap]
  )
  const studentPreviewUrl = useMemo(
    () => studentApiConfig ? buildEndpoint(studentApiConfig.apiEndpoint, studentMap, runtimeValues) : '',
    [studentApiConfig, studentMap, runtimeValues]
  )

  // Subclasses derived from unique stream values in loaded students — no extra API call
  const subClasses = useMemo(() => {
    const seen = new Map<string, string>()
    for (const s of activeStudents) {
      if (s.streamId && s.streamName && !seen.has(s.streamId)) {
        seen.set(s.streamId, s.streamName)
      }
    }
    return Array.from(seen.entries())
      .map(([classarmid, classarmname]) => ({ classarmid, classarmname }))
      .sort((a, b) => a.classarmname.localeCompare(b.classarmname))
  }, [activeStudents])

  // Step statuses
  const classStepStatus: StepStatus =
    isLoadingClasses ? 'loading'
    : classesError   ? 'error'
    : selectedClassId ? 'done'
    : 'idle'

  const studentStepStatus: StepStatus =
    !selectedClassId    ? 'locked'
    : isLoadingStudents ? 'loading'
    : studentsError     ? 'error'
    : activeStudents.length > 0 ? 'done'
    : 'idle'

  // Filter by selected stream when a subclass is chosen
  const visibleStudents = useMemo(() => {
    if (!activeStudents.length) return []
    if (!selectedSubclassId)   return activeStudents
    return activeStudents.filter(s => s.streamId === selectedSubclassId)
  }, [activeStudents, selectedSubclassId])

  const subjectStepStatus: StepStatus =
    !visibleStudents.length        ? 'locked'
    : selectedSubjects.length > 0  ? 'done'
    : 'idle'

  // ---------------------------------------------------------------------------
  // Loaders
  // ---------------------------------------------------------------------------
  const loadCenters = useCallback(async () => {
    try {
      const data = await getAllCenters()
      setCenters(data)
      if (data.length > 0) setSelectedCenterId(data[0].id)
    } catch { /* silent */ }
  }, [])

  const loadExamSessions = useCallback(async () => {
    try {
      const sessions = await getAllExamSessions()
      const active = sessions.filter(s => s.status === 'SCHEDULED' || s.status === 'ACTIVE')
      setExamSessions(active)
      if (active.length > 0) setSelectedExamSessionId(active[0].id)
    } catch { /* silent */ }
  }, [])

  const loadAPIConfigurations = useCallback(async () => {
    try { setApiConfigurations(await getAllAPIConfigurations()) } catch { /* silent */ }
  }, [])

  const loadClasses = useCallback(async (config: APIConfiguration) => {
    setIsLoadingClasses(true); setClassesError(null)
    setClasses([]); setSelectedClassId(''); setSelectedSubclassId(''); setActiveStudents([])
    try {
      const raw    = await proxyFetch(config.apiEndpoint, config.apiKey ?? undefined)
      const parsed = extractDataArray(raw).map(parseClass).filter((c): c is NonNullable<typeof c> => c !== null)
      if (!parsed.length) throw new Error('No classes returned from API')
      setClasses(parsed)
    } catch (err) {
      setClassesError(err instanceof Error ? err.message : 'Failed to load classes')
    } finally { setIsLoadingClasses(false) }
  }, [])

  const loadStudents = useCallback(async (
    config: APIConfiguration,
    map: Record<string, ImportValueKey>,
    values: Record<ImportValueKey, string>
  ) => {
    setIsLoadingStudents(true); setStudentsError(null); setActiveStudents([]); setTotalStudentCount(null)
    try {
      const endpoint = buildEndpoint(config.apiEndpoint, map, values)
      const raw      = await proxyFetch(endpoint, config.apiKey ?? undefined)
      const parsed   = extractDataArray(raw).map(parseStudent).filter((s): s is NonNullable<typeof s> => s !== null)
      if (!parsed.length) throw new Error('No students returned from API')
      setActiveStudents(parsed)
      // Store the server-side total if the response includes pagination
      const r = raw as Record<string, unknown>
      const pagination = (r.pagination ?? r.meta ?? r.page ?? null) as Record<string, unknown> | null
      const serverTotal = typeof pagination?.total === 'number' ? pagination.total : null
      setTotalStudentCount(serverTotal)
    } catch (err) {
      setStudentsError(err instanceof Error ? err.message : 'Failed to load students')
    } finally { setIsLoadingStudents(false) }
  }, [])

  const loadSubjectsForSession = useCallback(async () => {
    if (!selectedExamSessionId) { setAvailableSubjects([]); setSelectedSubjects([]); return }
    try {
      setIsLoadingSubjects(true)
      setAvailableSubjects(await getSubjectsWithQuestionsBySession(selectedExamSessionId))
      setSelectedSubjects([])
    } catch {
      toast.error('Failed to load subjects')
    } finally { setIsLoadingSubjects(false) }
  }, [selectedExamSessionId])

  // ---------------------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (isOpen) { loadCenters(); loadExamSessions(); loadAPIConfigurations() }
  }, [isOpen, loadCenters, loadExamSessions, loadAPIConfigurations])

  useEffect(() => {
    if (selectedExamSessionId) loadSubjectsForSession()
  }, [selectedExamSessionId, loadSubjectsForSession])

  useEffect(() => {
    if (studentApiConfig && studentAllMapped && selectedClassId) {
      loadStudents(studentApiConfig, studentMap, runtimeValues)
    }
  }, [studentApiConfig, studentAllMapped, selectedClassId, studentMap, runtimeValues, loadStudents])

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const handleClassApiChange = (id: string) => {
    setClassApiId(id)
    setClasses([]); setSelectedClassId(''); setSelectedSubclassId('')
    setActiveStudents([]); setTotalStudentCount(null); setClassesError(null)
    const config = apiConfigurations.find(c => c.id === id)
    if (config) loadClasses(config)
  }

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId)
    setSelectedSubclassId(''); setActiveStudents([]); setStudentsError(null); setTotalStudentCount(null)
  }

  const handleStudentApiChange = (id: string) => {
    setStudentApiId(id); setActiveStudents([]); setTotalStudentCount(null); setStudentsError(null); setSelectedSubclassId('')
    const config = apiConfigurations.find(c => c.id === id) ?? null
    const found  = config ? extractPlaceholders(config.apiEndpoint) : []
    setStudentPlaceholders(found)
    setStudentMap(smartAutoMap(found, 'classId'))
  }

  const handleStudentMapChange = (placeholder: string, valueKey: ImportValueKey | '') => {
    setStudentMap(prev => {
      const next = { ...prev }
      if (valueKey) next[placeholder] = valueKey; else delete next[placeholder]
      return next
    })
    setActiveStudents([]); setTotalStudentCount(null); setStudentsError(null); setSelectedSubclassId('')
  }

  // ---------------------------------------------------------------------------
  // Dialog open/close
  // ---------------------------------------------------------------------------
  const handleOpen  = () => { setIsOpen(true); setError(null) }
  const handleClose = () => { setIsOpen(false); setError(null); resetForm() }

  const resetForm = () => {
    setJsonData('')
    setClassApiId(''); setClasses([]); setSelectedClassId(''); setClassesError(null)
    setSelectedSubclassId('')
    setStudentApiId(''); setStudentPlaceholders([]); setStudentMap({})
    setActiveStudents([]); setTotalStudentCount(null); setStudentsError(null)
    setAvailableSubjects([]); setSelectedSubjects([]); setSubjectSearch('')
    setExcelFile(null); setParsedExcelCandidates([])
    setImportTab('json')
    if (centers.length      > 0) setSelectedCenterId(centers[0].id)
    if (examSessions.length > 0) setSelectedExamSessionId(examSessions[0].id)
  }

  // ---------------------------------------------------------------------------
  // Import handlers
  // ---------------------------------------------------------------------------
  const handleImport = async () => {
    if (importTab === 'json')     await handleImportFromJson()
    else if (importTab === 'api') await handleImportFromApi()
    else                          await handleImportFromExcel()
  }

  const handleImportFromJson = async () => {
    try {
      setError(null); setIsLoading(true)
      let candidates
      try { candidates = JSON.parse(jsonData) } catch { throw new Error('Invalid JSON format') }
      if (!Array.isArray(candidates)) throw new Error('JSON must be an array of candidates')
      toast.loading(`Importing ${candidates.length} candidate(s)...`, { id: 'import-loading' })
      const result = await importCandidates({ candidates })
      toast.dismiss('import-loading')
      handleClose()
      result.failed > 0
        ? toast.warning('Import completed with errors', { description: `Success: ${result.success}, Failed: ${result.failed}` })
        : toast.success('Import completed', { description: `Successfully imported ${result.success} candidates` })
      onSuccess?.(result.success)
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Failed to import'
      toast.dismiss('import-loading')
      setError(msg); toast.error('Import failed', { description: msg })
    } finally { setIsLoading(false) }
  }

  const handleImportFromApi = async () => {
    if (!selectedCenterId)        { setError('Please select a center');        return }
    if (!selectedExamSessionId)   { setError('Please select an exam session'); return }
    if (!visibleStudents.length)  { setError('No students loaded yet');        return }
    if (!selectedSubjects.length) { setError('Please select at least one subject'); return }
    if (selectedSubjects.length > 4) { setError('Maximum 4 subjects allowed'); return }
    try {
      setError(null); setIsLoading(true)
      toast.loading(`Importing ${visibleStudents.length} candidate(s)...`, { id: 'import-loading' })
      const candidates = visibleStudents
        .map(s => {
          const surname   = s.surname?.trim()   || ''
          const firstname = s.firstname?.trim() || ''
          if (!s.studentid?.trim() || !surname || !firstname) return null
          return {
            id: String(s.studentid.trim()),
            surname, firstname,
            ...(s.othername?.trim() && { othername: s.othername.trim() }),
            ...(s.picture?.trim()   && { picture:   s.picture.trim()   }),
            sessionId: selectedExamSessionId,
            subjects:  selectedSubjects,
          }
        })
        .filter((c): c is NonNullable<typeof c> => c !== null)
      const result = await importCandidates({ candidates })
      toast.dismiss('import-loading')
      handleClose()
      result.failed > 0
        ? toast.warning('Import completed with errors', { description: `Success: ${result.success}, Failed: ${result.failed}` })
        : toast.success('Import completed', { description: `Successfully imported ${result.success} candidates` })
      onSuccess?.(result.success)
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Failed to import'
      toast.dismiss('import-loading')
      setError(msg); toast.error('Import failed', { description: msg })
    } finally { setIsLoading(false) }
  }

  const downloadSampleExcel = () => {
    const ws = XLSX.utils.json_to_sheet([
      { candidateid: 'BPA/21/043',  lastName: 'Okpoko',    firstName: 'Maryann',   otherName: '' },
      { candidateid: null,          lastName: 'Smith',     firstName: 'John',       otherName: 'Michael' },
      { candidateid: 'BPA/23/1114', lastName: 'Onyejiaka', firstName: 'Ifechukwu', otherName: '' },
    ])
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
      const workbook  = XLSX.read(await file.arrayBuffer())
      const rows      = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
      const normalizeCol = (name: string) => {
        const n = name.trim().toLowerCase().replace(/\s+/g, '')
        if (['candidateid','studentid'].includes(n))    return 'candidateid'
        if (['lastname','surname'].includes(n))         return 'lastName'
        if (['firstname','givenname'].includes(n))      return 'firstName'
        if (['othername','middlename'].includes(n))     return 'otherName'
        return n
      }
      const firstRow = rows[0] as Record<string, unknown>
      if (!firstRow) throw new Error('Excel file is empty')
      const colMap: Record<string, string> = {}
      Object.keys(firstRow).forEach(k => {
        const n = normalizeCol(k)
        if (['candidateid','lastName','firstName','otherName'].includes(n)) colMap[n] = k
      })
      if (!colMap.lastName || !colMap.firstName)
        throw new Error('Excel must have "lastName" and "firstName" columns')
      const candidates = (rows as Record<string, unknown>[]).map((row, i) => {
        const lastName  = String(row[colMap.lastName]  || '').trim()
        const firstName = String(row[colMap.firstName] || '').trim()
        if (!lastName || !firstName) throw new Error(`Row ${i + 2} is missing name fields`)
        return {
          candidateid: colMap.candidateid ? String(row[colMap.candidateid] || '').trim() || null : null,
          lastName, firstName,
          otherName: colMap.otherName ? String(row[colMap.otherName] || '').trim() || null : null,
        }
      })
      setParsedExcelCandidates(candidates)
      toast.success(`Parsed ${candidates.length} candidates!`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to parse Excel file')
      setExcelFile(null); setParsedExcelCandidates([])
    }
  }

  const handleImportFromExcel = async () => {
    if (!excelFile || !parsedExcelCandidates.length) { setError('Please select a valid Excel file'); return }
    if (!selectedExamSessionId)    { setError('Please select an exam session');      return }
    if (!selectedSubjects.length)  { setError('Please select at least one subject'); return }
    try {
      setError(null); setIsLoading(true)
      toast.loading(`Importing ${parsedExcelCandidates.length} candidate(s)...`, { id: 'import-loading' })
      const candidates = parsedExcelCandidates
        .map(c => {
          const surname   = c.lastName?.trim()  || ''
          const firstname = c.firstName?.trim() || ''
          if (!surname || !firstname) return null
          return {
            ...(c.candidateid?.trim() && { id: c.candidateid.trim() }),
            surname, firstname,
            ...(c.otherName?.trim() && { othername: c.otherName.trim() }),
            sessionId: selectedExamSessionId,
            subjects:  selectedSubjects,
          }
        })
        .filter((c): c is NonNullable<typeof c> => c !== null)
      if (!candidates.length) throw new Error('No valid candidates to import')
      const result = await importCandidates({ candidates })
      toast.dismiss('import-loading')
      handleClose()
      result.failed > 0
        ? toast.warning('Import completed with errors', { description: `Success: ${result.success}, Failed: ${result.failed}` })
        : toast.success('Import completed', { description: `Successfully imported ${result.success} candidates` })
      onSuccess?.(result.success)
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Failed to import'
      toast.dismiss('import-loading')
      setError(msg); toast.error('Import failed', { description: msg })
    } finally { setIsLoading(false) }
  }

  // ---------------------------------------------------------------------------
  // Shared subject picker (API + Excel tabs)
  // ---------------------------------------------------------------------------
  const SubjectPicker = selectedExamSessionId ? (
    <div>
      <p className={labelCls}>Subjects <span className="text-red-400 normal-case font-normal text-xs">* up to 4</span></p>

      {!isLoadingSubjects && availableSubjects.length > 0 && (
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search subjects…"
            value={subjectSearch}
            onChange={(e) => setSubjectSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      )}

      <div className="border border-gray-200 rounded-lg p-2 max-h-44 overflow-y-auto">
        {isLoadingSubjects ? (
          <div className="flex items-center gap-2 py-3 px-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading subjects…
          </div>
        ) : availableSubjects.length === 0 ? (
          <p className="py-3 px-2 text-sm text-gray-500">No subjects for this session</p>
        ) : (() => {
          const filtered = availableSubjects.filter(s =>
            s.name.toLowerCase().includes(subjectSearch.toLowerCase())
          )
          return filtered.length === 0 ? (
            <p className="py-3 px-2 text-sm text-gray-500">No subjects match your search</p>
          ) : (
            <div className="space-y-0.5">
              {filtered.map(subject => (
                <label
                  key={subject.id}
                  className={`flex items-center gap-2.5 px-2 py-2 rounded-md cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedSubjects.includes(subject.id) ? 'bg-primary/5' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    value={subject.id}
                    checked={selectedSubjects.includes(subject.id)}
                    disabled={!selectedSubjects.includes(subject.id) && selectedSubjects.length >= 4}
                    onChange={(e) => {
                      if (e.target.checked && selectedSubjects.length < 4) {
                        setSelectedSubjects([...selectedSubjects, subject.id])
                      } else if (!e.target.checked) {
                        setSelectedSubjects(selectedSubjects.filter(id => id !== subject.id))
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/30 flex-shrink-0"
                  />
                  <span className="text-sm leading-tight">
                    {subject.name}
                    <span className="text-xs text-gray-400 ml-1.5">({subject.questionCount}q)</span>
                  </span>
                </label>
              ))}
            </div>
          )
        })()}
      </div>

      {selectedSubjects.length > 0 && (
        <p className="mt-1 text-xs text-primary font-medium">
          {selectedSubjects.length} subject{selectedSubjects.length > 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  ) : null

  // ---------------------------------------------------------------------------
  // Placeholder mapping row — only shown for ambiguous placeholders
  // ---------------------------------------------------------------------------
  const PlaceholderRow = ({
    placeholder, value, onChange,
  }: { placeholder: string; value: ImportValueKey | ''; onChange: (v: ImportValueKey | '') => void }) => (
    <div className="flex items-center gap-2 py-2 px-3 bg-amber-50 border border-amber-200 rounded-lg">
      <span className="text-xs text-amber-700 font-medium flex-shrink-0">Map</span>
      <code className="flex-shrink-0 bg-white text-gray-700 px-1.5 py-0.5 rounded font-mono text-xs border border-gray-200">
        {`{${placeholder}}`}
      </code>
      <span className="text-amber-500 flex-shrink-0 text-xs">→</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ImportValueKey | '')}
        className="flex-1 px-2 py-1 text-sm border border-amber-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
      >
        <option value="">Select value…</option>
        {IMPORT_VALUES.map(({ key, label }) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>
    </div>
  )

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? handleOpen() : handleClose())}>
      <DialogTrigger asChild>
        <Button variant="outline">Import Candidates</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl flex flex-col max-h-[90vh] p-0 gap-0">
        <div className="px-6 pt-6 pb-4 flex-shrink-0">
          <DialogHeader>
            <DialogTitle>Import Candidates</DialogTitle>
            <DialogDescription>Choose your import method below</DialogDescription>
          </DialogHeader>
        </div>

        {error && <div className="px-6 pb-2 flex-shrink-0"><Alert variant="destructive">{error}</Alert></div>}

        <Tabs value={importTab} onValueChange={setImportTab} className="flex flex-col flex-1 min-h-0">
          <div className="px-6 pb-3 flex-shrink-0">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="json">JSON</TabsTrigger>
              <TabsTrigger value="api">From API</TabsTrigger>
              <TabsTrigger value="excel">From Excel</TabsTrigger>
            </TabsList>
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-2">

          {/* ── JSON Tab ── */}
          <TabsContent value="json" className="space-y-3 pt-3">
            <div>
              <Label htmlFor="jsonData">JSON Data</Label>
              <textarea
                id="jsonData"
                className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono mt-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder={`[\n  {\n    "surname": "Doe",\n    "firstname": "John",\n    "sessionId": "...",\n    "subjects": ["..."]\n  }\n]`}
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
              />
            </div>
          </TabsContent>

          {/* ── API Tab ── */}
          <TabsContent value="api" className="pt-3 space-y-3">

            {/* Session setup — always visible, above step cards */}
            <div className="grid grid-cols-2 gap-3 pb-1">
              <div>
                <label className={labelCls}>Center</label>
                <select
                  aria-label="Select a center"
                  value={selectedCenterId}
                  onChange={(e) => setSelectedCenterId(e.target.value)}
                  className={selectCls}
                >
                  <option value="">Select…</option>
                  {centers.map(c => <option key={c.id} value={c.id}>{c.centerName}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Exam Session</label>
                <select
                  aria-label="Select an exam session"
                  value={selectedExamSessionId}
                  onChange={(e) => setSelectedExamSessionId(e.target.value)}
                  className={selectCls}
                >
                  <option value="">Select…</option>
                  {examSessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>

            {/* ── Step 1: Load Classes ── */}
            <StepCard
              number={1}
              title="Load Classes"
              status={classStepStatus}
              badge={
                selectedClassId
                  ? classes.find(c => c.classid === selectedClassId)?.classname
                  : classes.length ? `${classes.length} classes available` : undefined
              }
              collapsible
            >
              <div>
                <label className={labelCls}>API Configuration</label>
                <select
                  aria-label="Select API for classes"
                  value={classApiId}
                  onChange={(e) => handleClassApiChange(e.target.value)}
                  className={selectCls}
                >
                  <option value="">Select an API configuration…</option>
                  {apiConfigurations.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {classApiConfig && (
                  <p className="mt-1 text-xs text-gray-400 font-mono truncate" title={classApiConfig.apiEndpoint}>
                    {classApiConfig.apiEndpoint}
                  </p>
                )}
              </div>

              {classesError && (
                <p className="text-xs text-red-600 flex items-center gap-1.5 mt-1">
                  <XCircle className="w-3.5 h-3.5 flex-shrink-0" /> {classesError}
                </p>
              )}

              {classes.length > 0 && (
                <div>
                  <label className={labelCls}>Select Class</label>
                  <select
                    aria-label="Select a class"
                    value={selectedClassId}
                    onChange={(e) => handleClassChange(e.target.value)}
                    className={selectCls}
                  >
                    <option value="">Choose a class…</option>
                    {classes.map(({ classid, classname }) => (
                      <option key={classid} value={classid}>{classname}</option>
                    ))}
                  </select>
                </div>
              )}
            </StepCard>

            {/* ── Step 2: Load Students ── */}
            <StepCard
              number={2}
              title="Load Students"
              status={studentStepStatus}
              badge={
                activeStudents.length
                  ? selectedSubclassId
                    ? `${visibleStudents.length} of ${totalStudentCount ?? activeStudents.length} students (${subClasses.find(s => s.classarmid === selectedSubclassId)?.classarmname ?? 'filtered'})`
                    : `${totalStudentCount ?? activeStudents.length} student${(totalStudentCount ?? activeStudents.length) !== 1 ? 's' : ''}`
                  : undefined
              }
              collapsible
            >
              {/* API selector */}
              <div>
                <label className={labelCls}>API Configuration</label>
                <select
                  aria-label="Select API for students"
                  value={studentApiId}
                  onChange={(e) => handleStudentApiChange(e.target.value)}
                  className={selectCls}
                >
                  <option value="">Select an API configuration…</option>
                  {apiConfigurations.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              {/* Manual mapping for ambiguous placeholders only */}
              {studentAmbiguous.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs text-amber-700 font-medium">
                    These URL placeholders need to be mapped:
                  </p>
                  {studentAmbiguous.map(p => (
                    <PlaceholderRow
                      key={p}
                      placeholder={p}
                      value={studentMap[p] ?? ''}
                      onChange={(v) => handleStudentMapChange(p, v)}
                    />
                  ))}
                </div>
              )}

              {studentApiConfig && studentPreviewUrl && (
                <p className="text-xs text-gray-400 font-mono truncate" title={studentPreviewUrl}>
                  ↗ {studentPreviewUrl}
                </p>
              )}

              {studentsError && (
                <p className="text-xs text-red-600 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 flex-shrink-0" /> {studentsError}
                </p>
              )}

              {/* Subclass filter — derived from stream data, no API call needed */}
              {subClasses.length > 0 && (
                <div className="pt-1 border-t border-gray-100">
                  <label className={labelCls}>
                    Filter by Subclass
                    <span className="text-gray-400 normal-case font-normal ml-1">(optional)</span>
                  </label>
                  <select
                    aria-label="Filter by subclass"
                    value={selectedSubclassId}
                    onChange={(e) => setSelectedSubclassId(e.target.value)}
                    className={selectCls}
                  >
                    <option value="">
                      All subclasses ({totalStudentCount ?? activeStudents.length} students)
                    </option>
                    {subClasses.map(({ classarmid, classarmname }) => {
                      const count = activeStudents.filter(s => s.streamId === classarmid).length
                      return (
                        <option key={classarmid} value={classarmid}>
                          {classarmname} ({count} student{count !== 1 ? 's' : ''})
                        </option>
                      )
                    })}
                  </select>
                  {totalStudentCount !== null && totalStudentCount > activeStudents.length && (
                    <p className="mt-1 text-xs text-amber-600">
                      Showing {activeStudents.length} of {totalStudentCount} students (API is paginated — only the first page is loaded)
                    </p>
                  )}
                </div>
              )}

              {activeStudents.length > 0 && (
                <p className="text-xs text-green-700 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  {visibleStudents.length} student{visibleStudents.length !== 1 ? 's' : ''} ready to import
                  {totalStudentCount !== null && totalStudentCount > activeStudents.length && !selectedSubclassId && (
                    <span className="text-amber-600 font-normal">
                      ({totalStudentCount - activeStudents.length} more on later pages)
                    </span>
                  )}
                </p>
              )}
            </StepCard>

            {/* ── Step 3: Select Subjects ── */}
            <StepCard
              number={3}
              title="Select Subjects"
              status={subjectStepStatus}
              badge={selectedSubjects.length ? `${selectedSubjects.length} selected` : undefined}
            >
              {SubjectPicker}
            </StepCard>

          </TabsContent>

          {/* ── Excel Tab ── */}
          <TabsContent value="excel" className="space-y-4 pt-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Center</label>
                <select
                  aria-label="Select a center"
                  value={selectedCenterId}
                  onChange={(e) => setSelectedCenterId(e.target.value)}
                  className={selectCls}
                >
                  <option value="">Select…</option>
                  {centers.map(c => <option key={c.id} value={c.id}>{c.centerName}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Exam Session</label>
                <select
                  aria-label="Select an exam session"
                  value={selectedExamSessionId}
                  onChange={(e) => setSelectedExamSessionId(e.target.value)}
                  className={selectCls}
                >
                  <option value="">Select…</option>
                  {examSessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className={labelCls}>Excel File</label>
              <div className="flex gap-2">
                <input
                  aria-label="Select an Excel file"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                  className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-lg file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                />
                <Button type="button" variant="outline" onClick={downloadSampleExcel} size="sm">
                  <Download className="h-4 w-4 mr-1.5" /> Sample
                </Button>
              </div>
              {excelFile && (
                <p className="mt-1.5 text-xs text-gray-500">
                  {excelFile.name}
                  {parsedExcelCandidates.length > 0 && (
                    <span className="ml-2 text-green-600 font-medium">✓ {parsedExcelCandidates.length} rows parsed</span>
                  )}
                </p>
              )}
              <p className="mt-1.5 text-xs text-gray-400">
                Columns: <code className="font-mono">candidateid</code> (opt), <code className="font-mono">lastName</code>, <code className="font-mono">firstName</code>, <code className="font-mono">otherName</code> (opt)
              </p>
            </div>

            {SubjectPicker}
          </TabsContent>
          </div>
        </Tabs>

        <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>Cancel</Button>
            <Button onClick={handleImport} disabled={isLoading}>
              {isLoading ? 'Importing…' : `Import from ${importTab === 'json' ? 'JSON' : importTab === 'api' ? 'API' : 'Excel'}`}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
