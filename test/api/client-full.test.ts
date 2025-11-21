import { ApiClient, ApiError, apiClient } from '@/shared/api/client'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

// Mock axios before importing ApiClient
jest.mock('axios', () => {
  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    request: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn(),
      },
      response: {
        use: jest.fn(),
      },
    },
  }

  return {
    __esModule: true,
    default: {
      create: jest.fn(() => mockAxiosInstance),
    },
  }
})

jest.mock('@/shared/config', () => ({
  config: {
    apiBaseUrl: 'http://localhost:3000/v1/api',
  },
}))

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('ApiClient Full Tests', () => {
  let mockAxiosInstance: jest.Mocked<AxiosInstance>
  let responseErrorHandler: ((error: any) => any) | undefined

  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    responseErrorHandler = undefined

    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
      request: jest.fn(),
      interceptors: {
        request: {
          use: jest.fn(() => 0),
        },
        response: {
          use: jest.fn((_, onRejected) => {
            responseErrorHandler = onRejected
            return 0
          }),
        },
      },
    } as any

    mockedAxios.create.mockReturnValue(mockAxiosInstance as any)
  })

  const triggerResponseError = (error: any) => {
    if (!responseErrorHandler) {
      return Promise.reject(error)
    }
    try {
      responseErrorHandler(error)
    } catch (err) {
      return Promise.reject(err)
    }
    return Promise.reject(error)
  }

  describe('Request Methods', () => {
    it('should make GET request', async () => {
      const mockResponse = {
        data: {
          success: true,
          status: 200,
          data: { id: '1', name: 'Test' },
        },
      }

      mockAxiosInstance.request.mockResolvedValue(mockResponse as any)

      const client = new ApiClient('http://localhost:3000')
      const result = await client.get('/test')

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/test',
      })
      expect(result).toEqual(mockResponse.data)
    })

    it('should make POST request with data', async () => {
      const mockResponse = {
        data: {
          success: true,
          status: 201,
          data: { id: '1', name: 'Created' },
        },
      }

      mockAxiosInstance.request.mockResolvedValue(mockResponse as any)

      const client = new ApiClient('http://localhost:3000')
      const result = await client.post('/test', { name: 'Test' })

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/test',
        data: { name: 'Test' },
      })
      expect(result).toEqual(mockResponse.data)
    })

    it('should make PUT request', async () => {
      const mockResponse = {
        data: {
          success: true,
          status: 200,
          data: { id: '1', name: 'Updated' },
        },
      }

      mockAxiosInstance.request.mockResolvedValue(mockResponse as any)

      const client = new ApiClient('http://localhost:3000')
      await client.put('/test/1', { name: 'Updated' })

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/test/1',
        data: { name: 'Updated' },
      })
    })

    it('should make PATCH request', async () => {
      const mockResponse = {
        data: {
          success: true,
          status: 200,
          data: { id: '1', name: 'Patched' },
        },
      }

      mockAxiosInstance.request.mockResolvedValue(mockResponse as any)

      const client = new ApiClient('http://localhost:3000')
      await client.patch('/test/1', { name: 'Patched' })

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: 'PATCH',
        url: '/test/1',
        data: { name: 'Patched' },
      })
    })

    it('should make DELETE request', async () => {
      const mockResponse = {
        data: {
          success: true,
          status: 200,
        },
      }

      mockAxiosInstance.request.mockResolvedValue(mockResponse as any)

      const client = new ApiClient('http://localhost:3000')
      await client.delete('/test/1')

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: 'DELETE',
        url: '/test/1',
      })
    })
  })

  describe('Request Interceptor', () => {
    it('should add auth token to requests', () => {
      localStorage.setItem('accessToken', 'test-token-123')

      const client = new ApiClient('http://localhost:3000')

      // Get the request interceptor
      const requestInterceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0]?.[0]
      if (!requestInterceptor) {
        // If interceptor wasn't captured, test the actual behavior
        expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled()
        return
      }

      const config: AxiosRequestConfig = {
        url: '/test',
        headers: {},
      }

      const result = requestInterceptor(config)

      expect(result.headers?.Authorization).toBe('Bearer test-token-123')
    })

    it('should not add token to logout endpoint', () => {
      localStorage.setItem('accessToken', 'test-token-123')

      const client = new ApiClient('http://localhost:3000')
      const requestInterceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0]?.[0]
      if (!requestInterceptor) {
        expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled()
        return
      }

      const config: AxiosRequestConfig = {
        url: '/auth/logout',
        headers: {},
      }

      const result = requestInterceptor(config)

      expect(result.headers?.Authorization).toBeUndefined()
    })

    it('should handle missing token gracefully', () => {
      const client = new ApiClient('http://localhost:3000')
      const requestInterceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0]?.[0]
      if (!requestInterceptor) {
        expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled()
        return
      }

      const config: AxiosRequestConfig = {
        url: '/test',
        headers: {},
      }

      const result = requestInterceptor(config)

      expect(result.headers?.Authorization).toBeUndefined()
    })
  })

  describe('Response Interceptor', () => {
    it('should handle API error response', async () => {
      const errorResponse = {
        response: {
          status: 400,
          data: {
            success: false,
            error: {
              message: 'Bad Request',
              code: 'BAD_REQUEST',
            },
          },
        },
      }

      mockAxiosInstance.request.mockImplementationOnce(() => triggerResponseError(errorResponse))

      const client = new ApiClient('http://localhost:3000')

      await expect(client.get('/test')).rejects.toThrow('Bad Request')
    })

    it('should handle network error', async () => {
      const networkError = {
        request: {},
      }

      mockAxiosInstance.request.mockImplementationOnce(() => triggerResponseError(networkError))

      const client = new ApiClient('http://localhost:3000')

      await expect(client.get('/test')).rejects.toThrow('Network error')
    })

    it('should handle unknown error', async () => {
      const unknownError = new Error('Unknown error')

      mockAxiosInstance.request.mockImplementationOnce(() => triggerResponseError(unknownError))

      const client = new ApiClient('http://localhost:3000')

      await expect(client.get('/test')).rejects.toThrow(ApiError)
    })
  })

  describe('Singleton Instance', () => {
    it('should use shared apiClient instance', () => {
      expect(apiClient).toBeInstanceOf(ApiClient)
    })
  })
})

