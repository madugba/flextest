export interface Admin {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  centerId: string | null
  center?: {
    id: string
    name: string
  } | null
  permissions: string[]
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateAdminRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  centerId?: string
  permissions?: string[]
  isActive?: boolean
}

export interface UpdateAdminRequest {
  firstName?: string
  lastName?: string
  centerId?: string | null
  permissions?: string[]
  isActive?: boolean
}

export interface UpdatePasswordRequest {
  currentPassword: string
  newPassword: string
}

export enum AdminStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
}
