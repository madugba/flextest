import type { CreateAdminRequest, UpdatePasswordRequest } from '../model/types'

export const MIN_PASSWORD_LENGTH = 8

export function validateCreateAdmin(data: CreateAdminRequest): string | null {
  if (!data.email || !data.email.includes('@')) {
    return 'Valid email is required'
  }

  if (!data.password || data.password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
  }

  if (!data.firstName || data.firstName.trim().length === 0) {
    return 'First name is required'
  }

  if (!data.lastName || data.lastName.trim().length === 0) {
    return 'Last name is required'
  }

  return null
}

export function validatePasswordChange(data: UpdatePasswordRequest): string | null {
  if (!data.currentPassword || data.currentPassword.length === 0) {
    return 'Current password is required'
  }

  if (!data.newPassword || data.newPassword.length < MIN_PASSWORD_LENGTH) {
    return `New password must be at least ${MIN_PASSWORD_LENGTH} characters`
  }

  if (data.currentPassword === data.newPassword) {
    return 'New password must be different from current password'
  }

  return null
}

export function getAdminFullName(admin: { firstName: string; lastName: string }): string {
  return `${admin.firstName} ${admin.lastName}`
}

export function getAdminStatusLabel(isActive: boolean): string {
  return isActive ? 'Active' : 'Blocked'
}
