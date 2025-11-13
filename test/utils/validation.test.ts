import {
  validateCreateCandidate,
  validateUpdateCandidate,
  createCandidateSchema,
  updateCandidateSchema,
} from '@/entities/candidate/lib/validation'

describe('Candidate Validation', () => {
  describe('createCandidateSchema', () => {
    it('should validate valid candidate data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      }

      const result = createCandidateSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      }

      const result = createCandidateSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email')
      }
    })

    it('should reject short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'short',
        firstName: 'John',
        lastName: 'Doe',
      }

      const result = createCandidateSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('password')
      }
    })

    it('should reject missing required fields', () => {
      const invalidData = {
        email: 'test@example.com',
      }

      const result = createCandidateSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should accept optional fields', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
        profileUrl: 'https://example.com/profile.jpg',
      }

      const result = createCandidateSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('updateCandidateSchema', () => {
    it('should validate partial update data', () => {
      const validData = {
        firstName: 'Jane',
      }

      const result = updateCandidateSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate empty object', () => {
      const result = updateCandidateSchema.safeParse({})
      expect(result.success).toBe(true)
    })

    it('should reject invalid email format', () => {
      const invalidData = {
        email: 'invalid-email',
      }

      const result = updateCandidateSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should accept valid URL for profileUrl', () => {
      const validData = {
        profileUrl: 'https://example.com/profile.jpg',
      }

      const result = updateCandidateSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should accept empty string for profileUrl', () => {
      const validData = {
        profileUrl: '',
      }

      const result = updateCandidateSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('validateCreateCandidate', () => {
    it('should return success result for valid data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      }

      const result = validateCreateCandidate(validData)
      expect(result.success).toBe(true)
    })

    it('should return error result for invalid data', () => {
      const invalidData = {
        email: 'invalid',
      }

      const result = validateCreateCandidate(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('validateUpdateCandidate', () => {
    it('should return success result for valid partial data', () => {
      const validData = {
        firstName: 'Jane',
      }

      const result = validateUpdateCandidate(validData)
      expect(result.success).toBe(true)
    })

    it('should return success result for empty object', () => {
      const result = validateUpdateCandidate({})
      expect(result.success).toBe(true)
    })

    it('should return error result for invalid data', () => {
      const invalidData = {
        email: 'invalid-email',
      }

      const result = validateUpdateCandidate(invalidData)
      expect(result.success).toBe(false)
    })
  })
})

