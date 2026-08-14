'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Center } from '@/entities/center'
import { getAllCenters } from '@/entities/center'
import type { ExamSession } from '@/entities/exam-session'
import { getAllExamSessions } from '@/entities/exam-session'
import type { APIConfiguration } from '@/entities/api-configuration'
import { getAllAPIConfigurations } from '@/entities/api-configuration'
import { getSubjectsWithQuestionsBySession } from '@/entities/subject'
import { toast } from 'sonner'
import {
  buildEndpoint,
  extractDataArray,
  extractPlaceholders,
  parseClass,
  parseStudent,
  proxyFetch,
  smartAutoMap,
} from '../lib/import-utils'
import type {
  ClassEntry,
  ExcelCandidate,
  ImportValueKey,
  SchoolPortalStudent,
  StepStatus,
  SubjectWithQuestionCount,
} from './types'

export function useCandidateImportState() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [importTab, setImportTab] = useState('json')
  const [jsonData, setJsonData] = useState('')

  const [centers, setCenters] = useState<Center[]>([])
  const [examSessions, setExamSessions] = useState<ExamSession[]>([])
  const [apiConfigurations, setApiConfigurations] = useState<APIConfiguration[]>([])
  const [selectedCenterId, setSelectedCenterId] = useState('')
  const [selectedExamSessionId, setSelectedExamSessionId] = useState('')

  const [classApiId, setClassApiId] = useState('')
  const [classes, setClasses] = useState<ClassEntry[]>([])
  const [selectedClassId, setSelectedClassId] = useState('')
  const [isLoadingClasses, setIsLoadingClasses] = useState(false)
  const [classesError, setClassesError] = useState<string | null>(null)

  const [selectedSubclassId, setSelectedSubclassId] = useState('')

  const [studentApiId, setStudentApiId] = useState('')
  const [studentPlaceholders, setStudentPlaceholders] = useState<string[]>([])
  const [studentMap, setStudentMap] = useState<Record<string, ImportValueKey>>({})
  const [activeStudents, setActiveStudents] = useState<SchoolPortalStudent[]>([])
  const [totalStudentCount, setTotalStudentCount] = useState<number | null>(null)
  const [isLoadingStudents, setIsLoadingStudents] = useState(false)
  const [studentsError, setStudentsError] = useState<string | null>(null)

  const [availableSubjects, setAvailableSubjects] = useState<SubjectWithQuestionCount>([])
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false)
  const [subjectSearch, setSubjectSearch] = useState('')

  const [excelFile, setExcelFile] = useState<File | null>(null)
  const [parsedExcelCandidates, setParsedExcelCandidates] = useState<ExcelCandidate[]>([])

  const classApiConfig = useMemo(
    () => apiConfigurations.find((c) => c.id === classApiId) ?? null,
    [apiConfigurations, classApiId]
  )
  const studentApiConfig = useMemo(
    () => apiConfigurations.find((c) => c.id === studentApiId) ?? null,
    [apiConfigurations, studentApiId]
  )

  const runtimeValues = useMemo(
    (): Record<ImportValueKey, string> => ({ classId: selectedClassId }),
    [selectedClassId]
  )

  const studentAllMapped = useMemo(
    () => studentPlaceholders.every((p) => !!studentMap[p]),
    [studentPlaceholders, studentMap]
  )
  const studentAmbiguous = useMemo(
    () => studentPlaceholders.filter((p) => !studentMap[p]),
    [studentPlaceholders, studentMap]
  )
  const studentPreviewUrl = useMemo(
    () => (studentApiConfig ? buildEndpoint(studentApiConfig.apiEndpoint, studentMap, runtimeValues) : ''),
    [studentApiConfig, studentMap, runtimeValues]
  )

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

  const classStepStatus: StepStatus =
    isLoadingClasses ? 'loading'
    : classesError ? 'error'
    : selectedClassId ? 'done'
    : 'idle'

  const studentStepStatus: StepStatus =
    !selectedClassId ? 'locked'
    : isLoadingStudents ? 'loading'
    : studentsError ? 'error'
    : activeStudents.length > 0 ? 'done'
    : 'idle'

  const visibleStudents = useMemo(() => {
    if (!activeStudents.length) return []
    if (!selectedSubclassId) return activeStudents
    return activeStudents.filter((s) => s.streamId === selectedSubclassId)
  }, [activeStudents, selectedSubclassId])

  const subjectStepStatus: StepStatus =
    !visibleStudents.length ? 'locked'
    : selectedSubjects.length > 0 ? 'done'
    : 'idle'

  const loadCenters = useCallback(async () => {
    try {
      const data = await getAllCenters()
      setCenters(data)
      if (data.length > 0) setSelectedCenterId(data[0].id)
    } catch {
      /* silent */
    }
  }, [])

  const loadExamSessions = useCallback(async () => {
    try {
      const sessions = await getAllExamSessions()
      const active = sessions.filter((s) => s.status === 'SCHEDULED' || s.status === 'ACTIVE')
      setExamSessions(active)
      if (active.length > 0) setSelectedExamSessionId(active[0].id)
    } catch {
      /* silent */
    }
  }, [])

  const loadAPIConfigurations = useCallback(async () => {
    try {
      setApiConfigurations(await getAllAPIConfigurations())
    } catch {
      /* silent */
    }
  }, [])

  const loadClasses = useCallback(async (config: APIConfiguration) => {
    setIsLoadingClasses(true)
    setClassesError(null)
    setClasses([])
    setSelectedClassId('')
    setSelectedSubclassId('')
    setActiveStudents([])
    try {
      const raw = await proxyFetch(config.apiEndpoint, config.apiKey ?? undefined)
      const parsed = extractDataArray(raw).map(parseClass).filter((c): c is NonNullable<typeof c> => c !== null)
      if (!parsed.length) throw new Error('No classes returned from API')
      setClasses(parsed)
    } catch (err) {
      setClassesError(err instanceof Error ? err.message : 'Failed to load classes')
    } finally {
      setIsLoadingClasses(false)
    }
  }, [])

  const loadStudents = useCallback(
    async (config: APIConfiguration, map: Record<string, ImportValueKey>, values: Record<ImportValueKey, string>) => {
      setIsLoadingStudents(true)
      setStudentsError(null)
      setActiveStudents([])
      setTotalStudentCount(null)
      try {
        const endpoint = buildEndpoint(config.apiEndpoint, map, values)
        const raw = await proxyFetch(endpoint, config.apiKey ?? undefined)
        const parsed = extractDataArray(raw).map(parseStudent).filter((s): s is NonNullable<typeof s> => s !== null)
        if (!parsed.length) throw new Error('No students returned from API')
        setActiveStudents(parsed)
        const r = raw as Record<string, unknown>
        const pagination = (r.pagination ?? r.meta ?? r.page ?? null) as Record<string, unknown> | null
        const serverTotal = typeof pagination?.total === 'number' ? pagination.total : null
        setTotalStudentCount(serverTotal)
      } catch (err) {
        setStudentsError(err instanceof Error ? err.message : 'Failed to load students')
      } finally {
        setIsLoadingStudents(false)
      }
    },
    []
  )

  const loadSubjectsForSession = useCallback(async () => {
    if (!selectedExamSessionId) {
      setAvailableSubjects([])
      setSelectedSubjects([])
      return
    }
    try {
      setIsLoadingSubjects(true)
      setAvailableSubjects(await getSubjectsWithQuestionsBySession(selectedExamSessionId))
      setSelectedSubjects([])
    } catch {
      toast.error('Failed to load subjects')
    } finally {
      setIsLoadingSubjects(false)
    }
  }, [selectedExamSessionId])

  useEffect(() => {
    if (isOpen) {
      loadCenters()
      loadExamSessions()
      loadAPIConfigurations()
    }
  }, [isOpen, loadCenters, loadExamSessions, loadAPIConfigurations])

  useEffect(() => {
    if (selectedExamSessionId) loadSubjectsForSession()
  }, [selectedExamSessionId, loadSubjectsForSession])

  useEffect(() => {
    if (studentApiConfig && studentAllMapped && selectedClassId) {
      loadStudents(studentApiConfig, studentMap, runtimeValues)
    }
  }, [studentApiConfig, studentAllMapped, selectedClassId, studentMap, runtimeValues, loadStudents])

  const handleClassApiChange = (id: string) => {
    setClassApiId(id)
    setClasses([])
    setSelectedClassId('')
    setSelectedSubclassId('')
    setActiveStudents([])
    setTotalStudentCount(null)
    setClassesError(null)
    const config = apiConfigurations.find((c) => c.id === id)
    if (config) loadClasses(config)
  }

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId)
    setSelectedSubclassId('')
    setActiveStudents([])
    setStudentsError(null)
    setTotalStudentCount(null)
  }

  const handleStudentApiChange = (id: string) => {
    setStudentApiId(id)
    setActiveStudents([])
    setTotalStudentCount(null)
    setStudentsError(null)
    setSelectedSubclassId('')
    const config = apiConfigurations.find((c) => c.id === id) ?? null
    const found = config ? extractPlaceholders(config.apiEndpoint) : []
    setStudentPlaceholders(found)
    setStudentMap(smartAutoMap(found, 'classId'))
  }

  const handleStudentMapChange = (placeholder: string, valueKey: ImportValueKey | '') => {
    setStudentMap((prev) => {
      const next = { ...prev }
      if (valueKey) next[placeholder] = valueKey
      else delete next[placeholder]
      return next
    })
    setActiveStudents([])
    setTotalStudentCount(null)
    setStudentsError(null)
    setSelectedSubclassId('')
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
    setClassApiId('')
    setClasses([])
    setSelectedClassId('')
    setClassesError(null)
    setSelectedSubclassId('')
    setStudentApiId('')
    setStudentPlaceholders([])
    setStudentMap({})
    setActiveStudents([])
    setTotalStudentCount(null)
    setStudentsError(null)
    setAvailableSubjects([])
    setSelectedSubjects([])
    setSubjectSearch('')
    setExcelFile(null)
    setParsedExcelCandidates([])
    setImportTab('json')
    if (centers.length > 0) setSelectedCenterId(centers[0].id)
    if (examSessions.length > 0) setSelectedExamSessionId(examSessions[0].id)
  }

  return {
    isOpen,
    setIsOpen,
    isLoading,
    setIsLoading,
    error,
    setError,
    importTab,
    setImportTab,
    jsonData,
    setJsonData,
    centers,
    setCenters,
    examSessions,
    setExamSessions,
    apiConfigurations,
    setApiConfigurations,
    selectedCenterId,
    setSelectedCenterId,
    selectedExamSessionId,
    setSelectedExamSessionId,
    classApiId,
    setClassApiId,
    classes,
    setClasses,
    selectedClassId,
    setSelectedClassId,
    isLoadingClasses,
    setIsLoadingClasses,
    classesError,
    setClassesError,
    selectedSubclassId,
    setSelectedSubclassId,
    studentApiId,
    setStudentApiId,
    studentPlaceholders,
    setStudentPlaceholders,
    studentMap,
    setStudentMap,
    activeStudents,
    setActiveStudents,
    totalStudentCount,
    setTotalStudentCount,
    isLoadingStudents,
    setIsLoadingStudents,
    studentsError,
    setStudentsError,
    availableSubjects,
    setAvailableSubjects,
    selectedSubjects,
    setSelectedSubjects,
    isLoadingSubjects,
    setIsLoadingSubjects,
    subjectSearch,
    setSubjectSearch,
    excelFile,
    setExcelFile,
    parsedExcelCandidates,
    setParsedExcelCandidates,
    classApiConfig,
    studentApiConfig,
    runtimeValues,
    studentAllMapped,
    studentAmbiguous,
    studentPreviewUrl,
    subClasses,
    classStepStatus,
    studentStepStatus,
    visibleStudents,
    subjectStepStatus,
    handleClassApiChange,
    handleClassChange,
    handleStudentApiChange,
    handleStudentMapChange,
    handleOpen,
    handleClose,
  }
}

export type CandidateImportState = ReturnType<typeof useCandidateImportState>
