import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  getAllExamSessions,
  type ExamSession,
  type SessionStatus,
} from '@/entities/exam-session'
import { getAllCenters, type Center } from '@/entities/center'
import { getAllSubjects, type Subject } from '@/entities/subject'
import {
  getAllAPIConfigurations,
  type APIConfiguration,
} from '@/entities/api-configuration'

export function useExamSessionsData() {
  const [examSessions, setExamSessions] = useState<ExamSession[]>([])
  const [centers, setCenters] = useState<Center[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [apiConfigurations, setApiConfigurations] = useState<APIConfiguration[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<SessionStatus | ''>('')

  const fetchExamSessions = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getAllExamSessions(statusFilter || undefined)
      setExamSessions(data)
    } catch (error) {
      toast.error('Failed to load exam sessions', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  const fetchCenters = useCallback(async () => {
    try {
      const data = await getAllCenters()
      setCenters(data)
    } catch {
      toast.error('Failed to load centers')
    }
  }, [])

  const fetchSubjects = useCallback(async () => {
    try {
      const data = await getAllSubjects()
      setSubjects(data)
    } catch {
      toast.error('Failed to load subjects')
    }
  }, [])

  const fetchAPIConfigurations = useCallback(async () => {
    try {
      const data = await getAllAPIConfigurations()
      setApiConfigurations(data)
    } catch (error) {
      toast.error('Failed to load API configurations', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    }
  }, [])

  useEffect(() => {
    void fetchExamSessions()
  }, [fetchExamSessions])

  useEffect(() => {
    void fetchCenters()
    void fetchSubjects()
    void fetchAPIConfigurations()
  }, [fetchCenters, fetchSubjects, fetchAPIConfigurations])

  return {
    examSessions,
    setExamSessions,
    centers,
    setCenters,
    subjects,
    setSubjects,
    apiConfigurations,
    setApiConfigurations,
    loading,
    setLoading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    fetchExamSessions,
  }
}
