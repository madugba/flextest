import { getAllCandidates, getCandidateById, createCandidate, updateCandidate, deleteCandidate, importCandidates, logoutCandidate, bulkLogoutCandidates } from '@/entities/candidate/api/candidateApi'
import { apiClient, ApiError } from '@/shared/api/client'

describe('Candidate API', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('getAllCandidates', () => {
    it('should fetch all candidates without filters', async () => {
      const mockResponse = {
        candidates: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      }

      jest.spyOn(apiClient, 'get').mockResolvedValue({
        success: true,
        status: 200,
        data: mockResponse,
      })

      const result = await getAllCandidates()

      expect(apiClient.get).toHaveBeenCalledWith('/candidates')
      expect(result).toEqual(mockResponse)
    })

    it('should fetch candidates with filters', async () => {
      const mockResponse = {
        candidates: [{ id: '1', firstName: 'John', lastName: 'Doe' }],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      }

      jest.spyOn(apiClient, 'get').mockResolvedValue({
        success: true,
        status: 200,
        data: mockResponse,
      })

      const result = await getAllCandidates({
        page: 1,
        limit: 10,
        search: 'John',
        status: 'ACTIVE',
        sessionId: 'session-1',
      })

      expect(apiClient.get).toHaveBeenCalledWith(
        '/candidates?page=1&limit=10&search=John&status=ACTIVE&sessionId=session-1'
      )
      expect(result).toEqual(mockResponse)
    })

    it('should throw ApiError when response is not successful', async () => {
      jest.spyOn(apiClient, 'get').mockResolvedValue({
        success: false,
        status: 500,
        error: { message: 'Server error', code: 'SERVER_ERROR' },
      })

      await expect(getAllCandidates()).rejects.toThrow(ApiError)
    })

    it('should handle unknown errors', async () => {
      jest.spyOn(apiClient, 'get').mockRejectedValue(new Error('Network error'))

      await expect(getAllCandidates()).rejects.toThrow(ApiError)
    })
  })

  describe('getCandidateById', () => {
    it('should fetch candidate by ID', async () => {
      const mockCandidate = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        isVerified: true,
        isActive: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      }

      jest.spyOn(apiClient, 'get').mockResolvedValue({
        success: true,
        status: 200,
        data: mockCandidate,
      })

      const result = await getCandidateById('1')

      expect(apiClient.get).toHaveBeenCalledWith('/candidates/1')
      expect(result).toEqual(mockCandidate)
    })

    it('should throw ApiError when candidate not found', async () => {
      jest.spyOn(apiClient, 'get').mockResolvedValue({
        success: false,
        status: 404,
        error: { message: 'Candidate not found', code: 'NOT_FOUND' },
      })

      await expect(getCandidateById('1')).rejects.toThrow(ApiError)
    })
  })

  describe('createCandidate', () => {
    it('should create a new candidate', async () => {
      const mockCandidate = {
        id: '1',
        surname: 'Doe',
        firstname: 'John',
        email: 'john@example.com',
        isVerified: false,
        isActive: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      }

      const createData = {
        surname: 'Doe',
        firstname: 'John',
        email: 'john@example.com',
        sessionId: 'session-1',
        subjects: ['subject-1'],
      }

      jest.spyOn(apiClient, 'post').mockResolvedValue({
        success: true,
        status: 201,
        data: mockCandidate,
      })

      const result = await createCandidate(createData)

      expect(apiClient.post).toHaveBeenCalledWith('/candidates', createData)
      expect(result).toEqual(mockCandidate)
    })

    it('should throw ApiError on validation error', async () => {
      jest.spyOn(apiClient, 'post').mockResolvedValue({
        success: false,
        status: 400,
        error: { message: 'Validation failed', code: 'VALIDATION_ERROR' },
      })

      await expect(
        createCandidate({
          surname: '',
          firstname: 'John',
          sessionId: 'session-1',
          subjects: [],
        })
      ).rejects.toThrow(ApiError)
    })
  })

  describe('updateCandidate', () => {
    it('should update candidate', async () => {
      const mockCandidate = {
        id: '1',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        isVerified: true,
        isActive: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-02',
      }

      jest.spyOn(apiClient, 'patch').mockResolvedValue({
        success: true,
        status: 200,
        data: mockCandidate,
      })

      const result = await updateCandidate('1', { firstName: 'Jane' })

      expect(apiClient.patch).toHaveBeenCalledWith('/candidates/1', { firstName: 'Jane' })
      expect(result).toEqual(mockCandidate)
    })
  })

  describe('deleteCandidate', () => {
    it('should delete candidate', async () => {
      jest.spyOn(apiClient, 'delete').mockResolvedValue({
        success: true,
        status: 200,
        data: { message: 'Candidate deleted' },
      })

      await deleteCandidate('1')

      expect(apiClient.delete).toHaveBeenCalledWith('/candidates/1')
    })

    it('should throw ApiError when deletion fails', async () => {
      jest.spyOn(apiClient, 'delete').mockResolvedValue({
        success: false,
        status: 404,
        error: { message: 'Candidate not found', code: 'NOT_FOUND' },
      })

      await expect(deleteCandidate('1')).rejects.toThrow(ApiError)
    })
  })

  describe('importCandidates', () => {
    it('should import candidates in bulk', async () => {
      const mockResponse = {
        message: 'Import completed',
        success: 5,
        failed: 1,
        errors: [{ index: 0, error: 'Invalid email' }],
      }

      const importData = {
        candidates: [
          {
            surname: 'Doe',
            firstname: 'John',
            sessionId: 'session-1',
            subjects: ['subject-1'],
          },
        ],
      }

      jest.spyOn(apiClient, 'post').mockResolvedValue({
        success: true,
        status: 200,
        data: mockResponse,
      })

      const result = await importCandidates(importData)

      expect(apiClient.post).toHaveBeenCalledWith('/candidates/import', importData)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('logoutCandidate', () => {
    it('should logout a candidate', async () => {
      const mockResponse = {
        candidateId: '1',
        message: 'Candidate logged out',
      }

      jest.spyOn(apiClient, 'post').mockResolvedValue({
        success: true,
        status: 200,
        data: mockResponse,
      })

      const result = await logoutCandidate('1', 'Manual logout')

      expect(apiClient.post).toHaveBeenCalledWith('/candidates/1/logout', { reason: 'Manual logout' })
      expect(result).toEqual(mockResponse)
    })

    it('should logout without reason', async () => {
      const mockResponse = {
        candidateId: '1',
        message: 'Candidate logged out',
      }

      jest.spyOn(apiClient, 'post').mockResolvedValue({
        success: true,
        status: 200,
        data: mockResponse,
      })

      await logoutCandidate('1')

      expect(apiClient.post).toHaveBeenCalledWith('/candidates/1/logout', {})
    })
  })

  describe('bulkLogoutCandidates', () => {
    it('should logout multiple candidates', async () => {
      const mockResponse = {
        message: 'Bulk logout completed',
        results: {
          successful: ['1', '2'],
          failed: [],
          totalProcessed: 2,
        },
      }

      jest.spyOn(apiClient, 'post').mockResolvedValue({
        success: true,
        status: 200,
        data: mockResponse,
      })

      const result = await bulkLogoutCandidates(['1', '2'], 'Bulk logout')

      expect(apiClient.post).toHaveBeenCalledWith('/candidates/bulk-logout', {
        candidateIds: ['1', '2'],
        reason: 'Bulk logout',
      })
      expect(result).toEqual(mockResponse)
    })
  })
})

