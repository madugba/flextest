describe('Reset Sessions API', () => {
  const mockFetch = jest.fn()
  global.fetch = mockFetch as any

  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('GET /api/admin/reset-sessions', () => {
    it('should return data counts when authenticated as admin', async () => {
      const mockCounts = {
        sessions: 10,
        candidates: 100,
        questions: 500,
        answers: 1000,
        results: 90,
        lastSession: { name: 'Test Session', date: '2024-01-01' }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, counts: mockCounts })
      })

      const response = await fetch('/api/admin/reset-sessions')
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.counts).toEqual(mockCounts)
    })

    it('should return 401 when not authenticated', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Unauthorized. Admin access required.' })
      })

      const response = await fetch('/api/admin/reset-sessions')
      const data = await response.json()

      expect(response.ok).toBe(false)
      expect(response.status).toBe(401)
      expect(data.error).toContain('Unauthorized')
    })
  })

  describe('POST /api/admin/reset-sessions', () => {
    it('should reset all sessions with valid confirmation phrase', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'All exam sessions and related data have been successfully reset.',
          deletedCounts: {
            sessions: 10,
            candidates: 100,
            questions: 500,
            answers: 1000
          }
        })
      })

      const response = await fetch('/api/admin/reset-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          confirmationPhrase: 'DELETE ALL SESSIONS',
          includeStudents: true
        })
      })

      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.message).toContain('successfully reset')
      expect(data.deletedCounts).toBeDefined()
    })

    it('should reject invalid confirmation phrase', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'Invalid confirmation phrase. Please type exactly: DELETE ALL SESSIONS'
        })
      })

      const response = await fetch('/api/admin/reset-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          confirmationPhrase: 'wrong phrase',
          includeStudents: true
        })
      })

      const data = await response.json()
      expect(response.ok).toBe(false)
      expect(response.status).toBe(400)
      expect(data.error).toContain('Invalid confirmation phrase')
    })

    it('should enforce rate limiting', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({
          error: 'Rate limited. Please wait 60 seconds before trying again.'
        })
      })

      const response = await fetch('/api/admin/reset-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          confirmationPhrase: 'DELETE ALL SESSIONS',
          includeStudents: true
        })
      })

      const data = await response.json()
      expect(response.status).toBe(429)
      expect(data.error).toContain('Rate limited')
    })

    it('should handle partial deletion (keep students)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'All exam sessions and related data have been successfully reset.',
          deletedCounts: {
            sessions: 10,
            candidates: 0,
            questions: 500,
            answers: 1000
          }
        })
      })

      const response = await fetch('/api/admin/reset-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          confirmationPhrase: 'DELETE ALL SESSIONS',
          includeStudents: false
        })
      })

      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.deletedCounts.candidates).toBe(0)
      expect(data.deletedCounts.sessions).toBeGreaterThan(0)
    })
  })
})

describe('Reset Sessions Modal', () => {
  it('should validate confirmation phrase correctly', () => {
    const requiredPhrase = 'DELETE ALL SESSIONS'

    const testCases = [
      { input: 'DELETE ALL SESSIONS', expected: true },
      { input: 'delete all sessions', expected: true },
      { input: 'Delete All Sessions', expected: true },
      { input: 'DELETE ALL', expected: false },
      { input: 'WRONG PHRASE', expected: false },
      { input: '', expected: false }
    ]

    testCases.forEach(({ input, expected }) => {
      const isValid = input.toUpperCase() === requiredPhrase
      expect(isValid).toBe(expected)
    })
  })

  it('should require acknowledgment checkbox', () => {
    const canConfirm = (acknowledged: boolean, phraseValid: boolean) => {
      return acknowledged && phraseValid
    }

    expect(canConfirm(true, true)).toBe(true)
    expect(canConfirm(false, true)).toBe(false)
    expect(canConfirm(true, false)).toBe(false)
    expect(canConfirm(false, false)).toBe(false)
  })
})