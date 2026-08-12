'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
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
import { Loader2, RefreshCw, CheckCircle2 } from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ImportSubjectsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ClassItem {
  id: string
  name: string
  level?: number | string
  code?: string
  [key: string]: unknown
}

interface ClassResponse {
  data?: ClassItem[]
  success?: boolean
}

interface SubjectItem {
  id?: string
  name?: string
  subjectid?: string
  subjectname?: string
  code?: string
  [key: string]: unknown
}

interface SubjectResponse {
  // Shape: { data: [...], classId, className, ... }
  data?:     SubjectItem[] | string[]
  // Alternative shapes
  subjects?: SubjectItem[] | string[]
  success?:  boolean
}

// Values a placeholder can be mapped to.
// Add more entries here as new runtime values become available.
const AVAILABLE_VALUES = [
  { key: 'classId', label: 'Class ID (selected class)' },
] as const

type ValueKey = typeof AVAILABLE_VALUES[number]['key']

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Routes external API calls through the server-side proxy to avoid CORS. */
async function proxyFetch(url: string, apiKey?: string): Promise<unknown> {
  const response = await fetch('/api/import/proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, apiKey }),
  })
  const data = await response.json() as { error?: string }
  if (!response.ok) {
    throw new Error(data.error ?? `Request failed (${response.status})`)
  }
  return data
}

const SELECT_CLS =
  'w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed'

function extractPlaceholders(template: string): string[] {
  return [...template.matchAll(/\{([^}]+)\}/g)].map((m) => m[1])
}

function buildEndpoint(
  template: string,
  map: Record<string, ValueKey>,
  runtimeValues: Record<ValueKey, string>
): string {
  const placeholders = extractPlaceholders(template)

  if (placeholders.length === 0) {
    return `${template}/${encodeURIComponent(runtimeValues.classId)}`
  }

  let url = template
  for (const placeholder of placeholders) {
    const valueKey = map[placeholder]
    if (valueKey && runtimeValues[valueKey]) {
      url = url.replace(`{${placeholder}}`, encodeURIComponent(runtimeValues[valueKey]))
    }
  }
  return url
}

function parseSubject(item: unknown): { subjectid?: string; subjectname: string } {
  if (typeof item === 'string') return { subjectname: item }
  if (typeof item !== 'object' || item === null) return { subjectname: String(item) }
  const obj = item as Record<string, unknown>
  if (obj.subjectid !== undefined || obj.subjectname !== undefined) {
    return {
      subjectid:   typeof obj.subjectid   === 'string' ? obj.subjectid   : undefined,
      subjectname: typeof obj.subjectname === 'string' ? obj.subjectname : '',
    }
  }
  return {
    subjectid:   typeof obj.id   === 'string' ? obj.id   : undefined,
    subjectname: typeof obj.name === 'string' ? obj.name : '',
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function ImportSubjectsDialog({ open, onOpenChange }: ImportSubjectsDialogProps) {
  const router = useRouter()

  const [apiConfigurations, setApiConfigurations] = useState<APIConfiguration[]>([])

  // Step 1 — API config for classes
  const [classConfigId, setClassConfigId] = useState('')

  // Step 2 — classes
  const [classes,          setClasses]          = useState<{ classid: string; classname: string }[]>([])
  const [isLoadingClasses, setIsLoadingClasses] = useState(false)
  const [classesError,     setClassesError]     = useState<string | null>(null)

  // Step 3 — selected class
  const [selectedClassId, setSelectedClassId] = useState('')

  // Step 4 — API config for subjects
  const [subjectConfigId, setSubjectConfigId] = useState('')
  const [subjectConfig,   setSubjectConfig]   = useState<APIConfiguration | null>(null)

  // Step 4b — placeholder mapping
  const [placeholders,   setPlaceholders]   = useState<string[]>([])
  const [placeholderMap, setPlaceholderMap] = useState<Record<string, ValueKey>>({})

  // Step 5 — subjects
  const [subjects,          setSubjects]          = useState<Array<{ subjectid?: string; subjectname: string }>>([])
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false)
  const [subjectsError,     setSubjectsError]     = useState<string | null>(null)

  // ---------------------------------------------------------------------------
  // Derived
  // ---------------------------------------------------------------------------
  const allPlaceholdersMapped = useMemo(
    () => placeholders.length === 0 || placeholders.every((p) => !!placeholderMap[p]),
    [placeholders, placeholderMap]
  )

  const readyToFetch = !!(selectedClassId && subjectConfig && allPlaceholdersMapped)

  // ---------------------------------------------------------------------------
  // Loaders
  // ---------------------------------------------------------------------------
  const loadAPIConfigurations = useCallback(async () => {
    try {
      const data = await getAllAPIConfigurations()
      setApiConfigurations(data)
    } catch {
      toast.error('Failed to load API configurations')
    }
  }, [])

  const loadClasses = useCallback(async (config: APIConfiguration) => {
    setIsLoadingClasses(true)
    setClassesError(null)
    setClasses([])
    setSelectedClassId('')
    setSubjects([])
    setSubjectsError(null)

    try {
      const data = (await proxyFetch(config.apiEndpoint, config.apiKey ?? undefined)) as ClassResponse
      const items = data.data

      if (!Array.isArray(items) || items.length === 0) {
        setClassesError('No classes returned from API')
        return
      }

      setClasses(
        items.map((item) => ({
          classid:   item.id,
          classname: item.level != null
            ? `${item.name} ${item.level}`
            : item.name,
        }))
      )
    } catch (err) {
      setClassesError(err instanceof Error ? err.message : 'Failed to load classes')
    } finally {
      setIsLoadingClasses(false)
    }
  }, [])

  const fetchSubjects = useCallback(
    async (classId: string, config: APIConfiguration, map: Record<string, ValueKey>) => {
      setIsLoadingSubjects(true)
      setSubjectsError(null)
      setSubjects([])

      try {
        const runtimeValues: Record<ValueKey, string> = { classId }
        const endpoint = buildEndpoint(config.apiEndpoint, map, runtimeValues)

        const data = (await proxyFetch(endpoint, config.apiKey ?? undefined)) as SubjectResponse
        let subjectList: Array<{ subjectid?: string; subjectname: string }> = []

        if (Array.isArray(data)) {
          subjectList = (data as unknown[]).map(parseSubject)
        } else if (Array.isArray(data.data)) {
          subjectList = data.data.map(parseSubject)
        } else if (Array.isArray(data.subjects)) {
          subjectList = data.subjects.map(parseSubject)
        }

        if (subjectList.length === 0) throw new Error('No subjects found for this class')

        setSubjects(subjectList)
      } catch (err) {
        setSubjectsError(err instanceof Error ? err.message : 'Failed to fetch subjects')
      } finally {
        setIsLoadingSubjects(false)
      }
    },
    []
  )

  // ---------------------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (open) {
      loadAPIConfigurations()
    }
  }, [open, loadAPIConfigurations])

  // Auto-fetch subjects when class + subject API + all mappings are ready
  useEffect(() => {
    if (readyToFetch && subjectConfig) {
      fetchSubjects(selectedClassId, subjectConfig, placeholderMap)
    }
  }, [readyToFetch, selectedClassId, subjectConfig, placeholderMap, fetchSubjects])

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const classConfig = useMemo(
    () => apiConfigurations.find((c) => c.id === classConfigId) ?? null,
    [apiConfigurations, classConfigId]
  )

  const handleClassApiChange = (configId: string) => {
    setClassConfigId(configId)
    setClasses([])
    setSelectedClassId('')
    setSubjects([])
    setSubjectsError(null)
    setClassesError(null)

    const config = apiConfigurations.find((c) => c.id === configId)
    if (config) loadClasses(config)
  }

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId)
    setSubjects([])
    setSubjectsError(null)
  }

  const handleSubjectApiChange = (configId: string) => {
    const config = apiConfigurations.find((c) => c.id === configId) ?? null
    setSubjectConfigId(configId)
    setSubjectConfig(config)
    setSubjects([])
    setSubjectsError(null)

    const found = config ? extractPlaceholders(config.apiEndpoint) : []
    setPlaceholders(found)

    // Auto-map a single placeholder to classId as a convenience default
    const autoMap: Record<string, ValueKey> = {}
    if (found.length === 1) autoMap[found[0]] = 'classId'
    setPlaceholderMap(autoMap)
  }

  const handlePlaceholderMap = (placeholder: string, valueKey: ValueKey | '') => {
    setPlaceholderMap((prev) => {
      const next = { ...prev }
      if (valueKey) next[placeholder] = valueKey
      else delete next[placeholder]
      return next
    })
    setSubjects([])
    setSubjectsError(null)
  }

  const handleImport = () => {
    if (subjects.length === 0) { toast.error('No subjects to import'); return }
    sessionStorage.setItem('pending_subject_import', JSON.stringify(subjects))
    onOpenChange(false)
    router.push('/dashboard/subjects/confirm-import')
  }

  const handleReset = () => {
    setClassConfigId('')
    setClasses([])
    setSelectedClassId('')
    setSubjectConfigId('')
    setSubjectConfig(null)
    setPlaceholders([])
    setPlaceholderMap({})
    setSubjects([])
    setSubjectsError(null)
    setClassesError(null)
  }

  const selectedClassName = classes.find((c) => c.classid === selectedClassId)?.classname

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Subjects from API</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">

          {/* ── Step 1: Select API for classes ── */}
          <div className="space-y-1.5">
            <Label htmlFor="classApiSelect">
              Step 1 — Select API to fetch classes <span className="text-red-500">*</span>
            </Label>

            <select
              id="classApiSelect"
              value={classConfigId}
              onChange={(e) => handleClassApiChange(e.target.value)}
              disabled={apiConfigurations.length === 0}
              aria-label="Select API configuration for classes"
              className={SELECT_CLS}
            >
              <option value="">Select API configuration…</option>
              {apiConfigurations.map((config) => (
                <option key={config.id} value={config.id}>
                  {config.name}{config.isSchoolPortal ? ' (School Portal)' : ''}
                </option>
              ))}
            </select>

            {isLoadingClasses && (
              <div className="flex items-center gap-2 text-sm text-gray-500 pt-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading classes…
              </div>
            )}
            {classesError && <p className="text-xs text-red-500">{classesError}</p>}
          </div>

          {/* ── Step 2: Select class ── */}
          <div className={`space-y-1.5 transition-opacity ${classConfigId && classes.length > 0 ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <div className="flex items-center justify-between">
              <Label htmlFor="classSelect">
                Step 2 — Select class <span className="text-red-500">*</span>
              </Label>
              {classConfig && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => loadClasses(classConfig)}
                  disabled={isLoadingClasses}
                  className="h-7 text-xs"
                >
                  <RefreshCw className={`h-3 w-3 mr-1 ${isLoadingClasses ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              )}
            </div>

            <select
              id="classSelect"
              value={selectedClassId}
              onChange={(e) => handleClassChange(e.target.value)}
              disabled={classes.length === 0}
              aria-label="Select class"
              className={SELECT_CLS}
            >
              <option value="">Select a class…</option>
              {classes.map(({ classid, classname }) => (
                <option key={classid} value={classid}>{classname}</option>
              ))}
            </select>
          </div>

          {/* ── Step 3: Select API for subjects ── */}
          <div className={`space-y-1.5 transition-opacity ${selectedClassId ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <Label htmlFor="subjectApiSelect">
              Step 3 — Select API to fetch subjects
              {selectedClassName ? ` for ${selectedClassName}` : ''}{' '}
              <span className="text-red-500">*</span>
            </Label>

            <select
              id="subjectApiSelect"
              value={subjectConfigId}
              onChange={(e) => handleSubjectApiChange(e.target.value)}
              disabled={!selectedClassId || apiConfigurations.length === 0}
              aria-label="Select API configuration for subjects"
              className={SELECT_CLS}
            >
              <option value="">Select API configuration…</option>
              {apiConfigurations.map((config) => (
                <option key={config.id} value={config.id}>
                  {config.name}{config.isSchoolPortal ? ' (School Portal)' : ''}
                </option>
              ))}
            </select>

            {subjectConfig && (
              <p className="text-xs text-gray-400 font-mono break-all">
                {subjectConfig.apiEndpoint}
              </p>
            )}
          </div>

          {/* ── Step 4: Map placeholders (only when endpoint has {…} variables) ── */}
          {subjectConfig && placeholders.length > 0 && (
            <div className={`space-y-2 transition-opacity ${selectedClassId && subjectConfigId ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              <Label>
                Step 4 — Map URL placeholders <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-gray-500">
                Tell the system what value each placeholder in the endpoint represents.
              </p>

              <div className="rounded-md border divide-y">
                {placeholders.map((placeholder) => (
                  <div key={placeholder} className="flex items-center gap-3 px-3 py-2">
                    <code className="flex-shrink-0 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono">
                      {`{${placeholder}}`}
                    </code>

                    <span className="text-gray-400 text-sm flex-shrink-0">→</span>

                    <select
                      value={placeholderMap[placeholder] ?? ''}
                      onChange={(e) => handlePlaceholderMap(placeholder, e.target.value as ValueKey | '')}
                      aria-label={`Map {${placeholder}}`}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">— select a value —</option>
                      {AVAILABLE_VALUES.map(({ key, label }) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>

                    {placeholderMap[placeholder] === 'classId' && selectedClassId && (
                      <span
                        className="text-xs text-green-600 font-mono truncate min-w-0 max-w-[110px]"
                        title={selectedClassId}
                      >
                        = {selectedClassId.slice(0, 8)}…
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Loading subjects ── */}
          {isLoadingSubjects && (
            <div className="flex items-center gap-2 text-sm text-gray-600 py-1">
              <Loader2 className="h-4 w-4 animate-spin" />
              Fetching subjects from API…
            </div>
          )}

          {/* ── Subjects found ── */}
          {!isLoadingSubjects && subjects.length > 0 && (
            <div className="flex items-center gap-3 p-4 border rounded-lg bg-green-50 border-green-200">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p className="text-sm font-medium text-green-800">
                <span className="text-lg font-bold">{subjects.length}</span>{' '}
                subject{subjects.length !== 1 ? 's' : ''} found — ready to import
              </p>
            </div>
          )}

          {/* ── Subject fetch error ── */}
          {subjectsError && (
            <div className="p-4 border border-destructive rounded-lg bg-destructive/10">
              <p className="text-sm text-destructive">{subjectsError}</p>
            </div>
          )}
        </div>

        {/* ── Actions ── */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleReset}>Reset</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
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
