import type { Dispatch, SetStateAction } from 'react'
import { EMPTY_EXAM_SESSION_FORM, type ExamSessionFormData } from '../types'

export function createUpdateFormField(setFormData: Dispatch<SetStateAction<ExamSessionFormData>>) {
  return (field: keyof ExamSessionFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }
}

export function createResetForm(setFormData: Dispatch<SetStateAction<ExamSessionFormData>>) {
  return () => {
    setFormData(EMPTY_EXAM_SESSION_FORM)
  }
}
