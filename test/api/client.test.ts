import { ApiError } from '@/shared/api/client'

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
    apiBaseUrl: 'http://localhost:3000',
  },
}))

describe('ApiClient', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  describe('ApiError', () => {
    it('should create ApiError with message', () => {
      const error = new ApiError('Test error')
      expect(error.message).toBe('Test error')
      expect(error.name).toBe('ApiError')
    })

    it('should create ApiError with code and statusCode', () => {
      const error = new ApiError('Test error', 'TEST_CODE', 400)
      expect(error.code).toBe('TEST_CODE')
      expect(error.statusCode).toBe(400)
    })
  })
})

