import type { Dispatch, SetStateAction } from 'react'
import { EMPTY_AI_MODEL_FORM, type AIModelFormData } from '../types'

export function createHandleCancel(
  setIsCreating: Dispatch<SetStateAction<boolean>>,
  setEditingId: Dispatch<SetStateAction<string | null>>,
  setFormData: Dispatch<SetStateAction<AIModelFormData>>
) {
  return () => {
    setIsCreating(false)
    setEditingId(null)
    setFormData({ ...EMPTY_AI_MODEL_FORM })
  }
}
