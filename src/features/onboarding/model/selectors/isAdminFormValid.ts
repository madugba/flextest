import type { AdminData } from '../types'

export function isAdminFormValid(adminData: AdminData): boolean {
  return (
    Object.values(adminData).every((value) => value.trim() !== '') &&
    adminData.password === adminData.confirmPassword &&
    adminData.password.length >= 8
  )
}
