import { useState } from 'react'
import type { Subject } from '@/entities/subject'

export function useSubjectFormState() {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [subjectName, setSubjectName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  return {
    selectedSubject,
    setSelectedSubject,
    subjectName,
    setSubjectName,
    isSubmitting,
    setIsSubmitting,
  }
}
