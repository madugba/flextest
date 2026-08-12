import type { Dispatch, SetStateAction } from 'react'
import type { useRouter } from 'next/navigation'
import { completeOnboarding } from '@/shared/api/onboardingApi'
import { clearCenterCache } from '@/shared/lib'
import type { AdminData, CenterData } from '../types'

export interface HandleCompleteOnboardingDeps {
  centerData: CenterData
  adminData: AdminData
  setIsSubmitting: Dispatch<SetStateAction<boolean>>
  setError: Dispatch<SetStateAction<string>>
  router: ReturnType<typeof useRouter>
}

export function createHandleCompleteOnboarding(
  deps: HandleCompleteOnboardingDeps
): () => Promise<void> {
  const { centerData, adminData, setIsSubmitting, setError, router } = deps

  return async () => {
    setIsSubmitting(true)
    setError('')

    try {
      await completeOnboarding({
        centerName: centerData.centerName,
        address: centerData.address,
        phone: centerData.phone,
        email: centerData.email,
        state: centerData.state,
        lga: centerData.lga,
        adminFirstName: adminData.firstName,
        adminLastName: adminData.lastName,
        adminEmail: adminData.email,
        adminPassword: adminData.password,
      })

      clearCenterCache()
      router.push('/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete setup')
      setIsSubmitting(false)
    }
  }
}
