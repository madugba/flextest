import type { Dispatch, SetStateAction } from 'react'
import type { Center } from '@/entities/center'
import { EMPTY_AI_MODEL_FORM, type AIModelFormData } from '../types'

export function createHandleCreate(
  setIsCreating: Dispatch<SetStateAction<boolean>>,
  setFormData: Dispatch<SetStateAction<AIModelFormData>>,
  centers: Center[]
) {
  return () => {
    setIsCreating(true)
    setFormData({
      ...EMPTY_AI_MODEL_FORM,
      centerId: centers.length > 0 ? centers[0].id : '',
    })
  }
}
