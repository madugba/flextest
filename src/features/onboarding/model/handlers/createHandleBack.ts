import type { Dispatch, SetStateAction } from 'react'
import type { useRouter } from 'next/navigation'

export interface HandleBackDeps {
  currentStep: number
  router: ReturnType<typeof useRouter>
  setCurrentStep: Dispatch<SetStateAction<number>>
}

export function createHandleBack(deps: HandleBackDeps): () => void {
  const { currentStep, router, setCurrentStep } = deps

  return () => {
    if (currentStep === 1) {
      router.push('/onboarding')
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 1))
    }
  }
}
