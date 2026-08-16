'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { getAllAPIConfigurations, type APIConfiguration } from '@/entities/api-configuration'
import { toast } from 'sonner'
import { buildEndpoint, extractPlaceholders, parseSubject, proxyFetch } from '../lib/import-utils'
import type { ClassResponse, SubjectResponse, ValueKey } from './types'

export function useSubjectImport(open: boolean, onOpenChange: (open: boolean) => void) {
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

  const allPlaceholdersMapped = useMemo(
    () => placeholders.length === 0 || placeholders.every((p) => !!placeholderMap[p]),
    [placeholders, placeholderMap]
  )

  const readyToFetch = !!(selectedClassId && subjectConfig && allPlaceholdersMapped)

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

  const handleImport = () => {
    if (subjects.length === 0) { toast.error('No subjects to import'); return }
    sessionStorage.setItem('pending_subject_import', JSON.stringify(subjects))
    onOpenChange(false)
    router.push('/dashboard/subjects/confirm-import')
  }

  return {
    apiConfigurations,
    classConfigId,
    classes,
    isLoadingClasses,
    classesError,
    selectedClassId,
    subjectConfigId,
    subjectConfig,
    placeholders,
    placeholderMap,
    subjects,
    isLoadingSubjects,
    subjectsError,
    classConfig,
    selectedClassName,
    loadClasses,
    handleClassApiChange,
    handleClassChange,
    handleSubjectApiChange,
    handlePlaceholderMap,
    handleReset,
    handleImport,
  }
}
