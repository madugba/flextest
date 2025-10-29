import type { CreateCenterRequest, UpdateCenterRequest } from '../model/types'

/**
 * Validate center creation data
 * @param data Center creation data
 * @returns Error message or null if valid
 */
export function validateCreateCenter(data: CreateCenterRequest): string | null {
  if (!data.centerName?.trim()) {
    return 'Center name is required'
  }
  if (data.centerName.length > 255) {
    return 'Center name must not exceed 255 characters'
  }
  if (!data.address?.trim()) {
    return 'Address is required'
  }
  if (data.address.length > 500) {
    return 'Address must not exceed 500 characters'
  }
  if (!data.phone?.trim()) {
    return 'Phone number is required'
  }
  if (!data.email?.trim()) {
    return 'Email is required'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return 'Invalid email format'
  }
  if (!data.state?.trim()) {
    return 'State is required'
  }
  if (!data.lga?.trim()) {
    return 'LGA is required'
  }
  return null
}

/**
 * Validate center update data
 * @param data Center update data
 * @returns Error message or null if valid
 */
export function validateUpdateCenter(data: UpdateCenterRequest): string | null {
  if (data.centerName !== undefined && !data.centerName.trim()) {
    return 'Center name cannot be empty'
  }
  if (data.centerName && data.centerName.length > 255) {
    return 'Center name must not exceed 255 characters'
  }
  if (data.address !== undefined && !data.address.trim()) {
    return 'Address cannot be empty'
  }
  if (data.address && data.address.length > 500) {
    return 'Address must not exceed 500 characters'
  }
  if (data.phone !== undefined && !data.phone.trim()) {
    return 'Phone number cannot be empty'
  }
  if (data.email !== undefined) {
    if (!data.email.trim()) {
      return 'Email cannot be empty'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return 'Invalid email format'
    }
  }
  if (data.state !== undefined && !data.state.trim()) {
    return 'State cannot be empty'
  }
  if (data.lga !== undefined && !data.lga.trim()) {
    return 'LGA cannot be empty'
  }
  return null
}
