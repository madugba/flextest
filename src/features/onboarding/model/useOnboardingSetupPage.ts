'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ONBOARDING_STEPS } from './constants'
import { createHandleAdminChange } from './handlers/createHandleAdminChange'
import { createHandleBack } from './handlers/createHandleBack'
import { createHandleCenterChange } from './handlers/createHandleCenterChange'
import { createHandleCompleteOnboarding } from './handlers/createHandleCompleteOnboarding'
import { createHandleNext } from './handlers/createHandleNext'
import { isAdminFormValid } from './selectors/isAdminFormValid'
import { isCenterFormValid } from './selectors/isCenterFormValid'
import type { AdminData, CenterData } from './types'

export function useOnboardingSetupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [centerData, setCenterData] = useState<CenterData>({
    centerName: '',
    address: '',
    phone: '',
    email: '',
    state: '',
    lga: '',
  })

  const [adminData, setAdminData] = useState<AdminData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleCenterChange = createHandleCenterChange({ setCenterData })
  const handleAdminChange = createHandleAdminChange({ setAdminData })

  const centerFormValid = isCenterFormValid(centerData)
  const adminFormValid = isAdminFormValid(adminData)

  const handleNext = createHandleNext({
    currentStep,
    isCenterFormValid: centerFormValid,
    isAdminFormValid: adminFormValid,
    setCurrentStep,
  })

  const handleBack = createHandleBack({ currentStep, router, setCurrentStep })
  const handleSubmit = createHandleCompleteOnboarding({
    centerData,
    adminData,
    setIsSubmitting,
    setError,
    router,
  })

  return {
    currentStep,
    isSubmitting,
    error,
    centerData,
    adminData,
    handleCenterChange,
    handleAdminChange,
    centerFormValid,
    adminFormValid,
    handleNext,
    handleBack,
    handleSubmit,
    steps: ONBOARDING_STEPS,
  }
}
