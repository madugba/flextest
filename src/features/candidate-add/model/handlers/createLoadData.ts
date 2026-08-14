import type { Dispatch, SetStateAction } from 'react'
import type { ExamSession } from '@/entities/exam-session'
import type { Subject } from '@/entities/subject'
import { getAllExamSessions } from '@/entities/exam-session'
import { getAllSubjects } from '@/entities/subject'
import { getActiveSessions } from '../selectors/getActiveSessions'

interface CreateLoadDataDeps {
  setSessions: Dispatch<SetStateAction<ExamSession[]>>
  setSubjects: Dispatch<SetStateAction<Subject[]>>
}

export function createLoadData({ setSessions, setSubjects }: CreateLoadDataDeps) {
  return async () => {
    try {
      const [sessionsData, subjectsData] = await Promise.all([
        getAllExamSessions(),
        getAllSubjects(),
      ])
      setSessions(getActiveSessions(sessionsData))
      setSubjects(subjectsData)
    } catch (err) {
      console.error('Failed to load sessions or subjects:', err)
    }
  }
}
