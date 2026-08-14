import type { Dispatch, SetStateAction } from 'react'
import type { Center } from '@/entities/center'
import { EMPTY_API_CONFIGURATION_FORM, type APIConfigurationFormData } from '../types'

export function createHandleCreate(
  setIsCreating: Dispatch<SetStateAction<boolean>>,
  setFormData: Dispatch<SetStateAction<APIConfigurationFormData>>,
  centers: Center[]
) {
  return () => {
    setIsCreating(true)
    setFormData({
      ...EMPTY_API_CONFIGURATION_FORM,
      centerId: centers.length > 0 ? centers[0].id : '',
    })
  }
}
