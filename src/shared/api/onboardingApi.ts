import { apiClient, ApiError } from './client'
import { Center } from './centerApi'

export interface Admin {
  id: string
  email: string
  firstName: string
  lastName: string
  centerId: string
  role: string
  isActive: boolean
  createdAt: string
}

export interface OnboardingData {
  centerName: string
  address: string
  phone: string
  email: string
  state: string
  lga: string
  adminFirstName: string
  adminLastName: string
  adminEmail: string
  adminPassword: string
}

export interface OnboardingResponse {
  success: boolean
  message: string
  data: {
    center: Center
    admin: Admin
  }
}

export interface OnboardingStatus {
  initialized: boolean
  message: string
}

/**
 * Complete onboarding by creating center and admin atomically
 * @param data Onboarding data (center + admin)
 * @returns Created center and admin
 * @throws ApiError on any API error
 */
export async function completeOnboarding(
  data: OnboardingData
): Promise<OnboardingResponse> {
  try {
    const response = await apiClient.post<OnboardingResponse>(
      '/onboarding',
      data
    )

    if (!response.success) {
      throw new ApiError(
        response.error?.message || 'Failed to complete onboarding',
        response.error?.code,
        undefined,
        response.error?.details
      )
    }

    return response.data as OnboardingResponse
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      'UNKNOWN_ERROR'
    )
  }
}

/**
 * Check if system is already initialized
 * @returns Onboarding status
 * @throws ApiError on any API error
 */
export async function checkOnboardingStatus(): Promise<OnboardingStatus> {
  try {
    const response = await apiClient.get<OnboardingStatus>('/onboarding/status')

    if (!response.success || !response.data) {
      throw new ApiError(
        response.error?.message || 'Failed to check onboarding status',
        response.error?.code,
        undefined,
        response.error?.details
      )
    }

    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      'UNKNOWN_ERROR'
    )
  }
}
