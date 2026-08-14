import type { Dispatch, SetStateAction } from 'react'
import { EMPTY_API_CONFIGURATION_FORM, type APIConfigurationFormData } from '../types'

export function createHandleCancel(
  setIsCreating: Dispatch<SetStateAction<boolean>>,
  setEditingId: Dispatch<SetStateAction<string | null>>,
  setFormData: Dispatch<SetStateAction<APIConfigurationFormData>>
) {
  return () => {
    setIsCreating(false)
    setEditingId(null)
    setFormData({ ...EMPTY_API_CONFIGURATION_FORM })
  }
}
