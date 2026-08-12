import type { CenterData } from '../types'

export function isCenterFormValid(centerData: CenterData): boolean {
  return Object.values(centerData).every((value) => value.trim() !== '')
}
