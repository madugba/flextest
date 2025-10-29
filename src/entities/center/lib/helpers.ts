import type { Center } from '../model/types'

/**
 * Get center display name
 * @param center Center object
 * @returns Formatted center name
 */
export function getCenterDisplayName(center: Center): string {
  return center.centerName
}

/**
 * Get center full address
 * @param center Center object
 * @returns Formatted full address
 */
export function getCenterFullAddress(center: Center): string {
  return `${center.address}, ${center.lga}, ${center.state}`
}

/**
 * Get center short address (just LGA and State)
 * @param center Center object
 * @returns Formatted short address
 */
export function getCenterShortAddress(center: Center): string {
  return `${center.lga}, ${center.state}`
}
