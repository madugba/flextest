import type { Dispatch, SetStateAction } from 'react'

export interface HandleNextDeps {
  currentStep: number
  isCenterFormValid: boolean
  isAdminFormValid: boolean
  setCurrentStep: Dispatch<SetStateAction<number>>
}

export function createHandleNext(deps: HandleNextDeps): () => void {
  const { currentStep, isCenterFormValid, isAdminFormValid, setCurrentStep } = deps

  return () => {
    if (currentStep === 1 && !isCenterFormValid) return
    if (currentStep === 2 && !isAdminFormValid) return
    setCurrentStep((prev) => Math.min(prev + 1, 3))
  }
}
