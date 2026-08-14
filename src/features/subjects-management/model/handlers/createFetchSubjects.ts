import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { getAllSubjects, type Subject } from '@/entities/subject'

export function createFetchSubjects(
  setSubjects: Dispatch<SetStateAction<Subject[]>>,
  setLoading: Dispatch<SetStateAction<boolean>>
) {
  return async (searchQuery?: string) => {
    try {
      setLoading(true)
      const data = await getAllSubjects(searchQuery)
      setSubjects(data)
    } catch (error) {
      toast.error('Failed to load subjects', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setLoading(false)
    }
  }
}
