/**
 * API Configuration Types
 */

export interface APIConfiguration {
  id: string
  name: string
  apiEndpoint: string
  apiKey: string | null
  description?: string | null
  centerId: string
  isSchoolPortal: boolean
  createdAt: string
  updatedAt: string
  center?: {
    id: string
    centerName: string
    state: string
  }
}

export interface CreateAPIConfigurationRequest {
  name: string
  apiEndpoint: string
  apiKey?: string
  description?: string
  centerId: string
  isSchoolPortal?: boolean
}

export interface UpdateAPIConfigurationRequest {
  name?: string
  apiEndpoint?: string
  apiKey?: string
  description?: string
  centerId?: string
  isSchoolPortal?: boolean
}
