import { validateCreateCandidate, validateUpdateCandidate } from '@/entities/candidate/lib/validation'

describe('Candidate Validation', () => {
  describe('validateCreateCandidate', () => {
    it('should validate correct candidate data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '123-456-7890',
      }

      const result = validateCreateCandidate(validData)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      }

      const result = validateCreateCandidate(invalidData)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid email')
      }
    })

    it('should reject short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'short',
        firstName: 'John',
        lastName: 'Doe',
      }

      const result = validateCreateCandidate(invalidData)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 8 characters')
      }
    })

    it('should reject missing required fields', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'password123',
      }

      const result = validateCreateCandidate(invalidData)

      expect(result.success).toBe(false)
    })

    it('should accept optional fields', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phone: undefined,
        profileUrl: '',
      }

      const result = validateCreateCandidate(validData)

      expect(result.success).toBe(true)
    })
  })

  describe('validateUpdateCandidate', () => {
    it('should validate correct update data', () => {
      const validData = {
        email: 'updated@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
      }

      const result = validateUpdateCandidate(validData)

      expect(result.success).toBe(true)
    })

    it('should reject invalid email format', () => {
      const invalidData = {
        email: 'invalid-email',
      }

      const result = validateUpdateCandidate(invalidData)

      expect(result.success).toBe(false)
    })

    it('should allow partial updates', () => {
      const partialData = {
        firstName: 'Updated Name',
      }

      const result = validateUpdateCandidate(partialData)

      expect(result.success).toBe(true)
    })

    it('should validate boolean isActive', () => {
      const validData = {
        isActive: true,
      }

      const result = validateUpdateCandidate(validData)

      expect(result.success).toBe(true)
    })
  })
})

