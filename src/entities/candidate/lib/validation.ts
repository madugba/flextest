import { z } from 'zod'

/**
 * Create candidate validation schema
 */
export const createCandidateSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  profileUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
})

/**
 * Update candidate validation schema
 */
export const updateCandidateSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  phone: z.string().optional(),
  profileUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  isActive: z.boolean().optional(),
})

/**
 * Validate create candidate data
 */
export function validateCreateCandidate(data: unknown) {
  return createCandidateSchema.safeParse(data)
}

/**
 * Validate update candidate data
 */
export function validateUpdateCandidate(data: unknown) {
  return updateCandidateSchema.safeParse(data)
}
