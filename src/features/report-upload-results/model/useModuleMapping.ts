'use client'

import { useState } from 'react'
import { loadModuleMapping, saveModuleMapping } from '../lib/moduleMappingStorage'
import type { SubjectModuleMapping, SubjectRef } from './types'

/** Subject -> module mapping, persisted in localStorage so it's set once and reused on every push. */
export function useModuleMapping(subjects: SubjectRef[]) {
  const [mapping, setMapping] = useState<SubjectModuleMapping>(() => loadModuleMapping())

  const setSubjectModule = (subjectId: string, moduleId: string) => {
    setMapping((prev) => {
      const next = { ...prev, [subjectId]: moduleId }
      saveModuleMapping(next)
      return next
    })
  }

  const isComplete = subjects.length > 0 && subjects.every((s) => !!mapping[s.id])

  return { mapping, setSubjectModule, isComplete }
}
