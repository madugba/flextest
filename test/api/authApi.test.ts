import { login, logout, getCurrentUser, setAuthToken, getAuthToken, removeAuthToken } from '@/shared/api/authApi'
import { apiClient, ApiError } from '@/shared/api/client'

describe('Auth API', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('login', () => {
    it('should login successfully', async () => {
      const mockResponse = {
        user: {
          id: '1',
          email: 'admin@example.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'ADMIN',
          centerId: 'center-1',
          permissions: ['read', 'write'],
        },
        token: {
          accessToken: 'token-123',
          expiresIn: '3600',
          tokenType: 'Bearer',
        },
      }

      jest.spyOn(apiClient, 'post').mockResolvedValue({
        success: true,
        status: 200,
        data: mockResponse,
      })

      const result = await login({
        email: 'admin@example.com',
        password: 'password123',
      })

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'admin@example.com',
        password: 'password123',
      })
      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockResponse)
    })

    it('should throw ApiError on login failure', async () => {
      jest.spyOn(apiClient, 'post').mockResolvedValue({
        success: false,
        status: 401,
        error: { message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' },
      })

      await expect(
        login({
          email: 'admin@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow(ApiError)
    })
  })

  describe('logout', () => {
    it('should logout successfully', async () => {
      jest.spyOn(apiClient, 'post').mockResolvedValue({
        success: true,
        status: 200,
      })

      await logout()

      expect(apiClient.post).toHaveBeenCalledWith('/auth/logout', {})
    })

    it('should handle logout failure gracefully', async () => {
      jest.spyOn(apiClient, 'post').mockResolvedValue({
        success: false,
        status: 500,
        error: { message: 'Logout failed', code: 'LOGOUT_FAILED' },
      })

      await expect(logout()).rejects.toThrow(ApiError)
    })
  })

  describe('getCurrentUser', () => {
    it('should fetch current user', async () => {
      const mockUser = {
        id: '1',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        centerId: 'center-1',
        permissions: ['read', 'write'],
      }

      jest.spyOn(apiClient, 'get').mockResolvedValue({
        success: true,
        status: 200,
        data: mockUser,
      })

      const result = await getCurrentUser()

      expect(apiClient.get).toHaveBeenCalledWith('/auth/me')
      expect(result).toEqual(mockUser)
    })

    it('should throw ApiError when user not found', async () => {
      jest.spyOn(apiClient, 'get').mockResolvedValue({
        success: false,
        status: 401,
        error: { message: 'Unauthorized', code: 'UNAUTHORIZED' },
      })

      await expect(getCurrentUser()).rejects.toThrow(ApiError)
    })
  })

  describe('Token Management', () => {
    it('should set and get auth token', () => {
      setAuthToken('test-token-123')
      expect(getAuthToken()).toBe('test-token-123')
    })

    it('should remove auth token', () => {
      setAuthToken('test-token-123')
      removeAuthToken()
      expect(getAuthToken()).toBeNull()
    })

    it('should return null when no token exists', () => {
      expect(getAuthToken()).toBeNull()
    })
  })
})

