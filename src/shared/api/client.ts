import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { config } from '@/shared/config'

export interface ApiResponse<T = unknown> {
  success: boolean
  status: number
  data?: T
  error?: {
    message: string
    code?: string
    details?: unknown
  }
  meta?: {
    timestamp: string
    requestId?: string
    pagination?: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }
}

export class ApiError extends Error {
  constructor(
    public message: string,
    public code?: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ApiClient {
  private instance: AxiosInstance

  constructor(baseUrl: string) {
    this.instance = axios.create({
      baseURL: baseUrl,
      timeout: 20000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add auth token
    this.instance.interceptors.request.use(
      (config) => {
        // Skip Authorization header for logout endpoint
        const url = config.url || ''
        const isLogout = /\/auth\/logout(\b|$)/.test(url)

        if (!isLogout && typeof window !== 'undefined') {
          const token = localStorage.getItem('accessToken')
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor to handle API responses
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          // Server responded with error
          const apiResponse = error.response.data as ApiResponse
          throw new ApiError(
            apiResponse.error?.message || 'An error occurred',
            apiResponse.error?.code,
            error.response.status,
            apiResponse.error?.details
          )
        } else if (error.request) {
          // Request was made but no response
          throw new ApiError('Network error: Unable to reach server', 'NETWORK_ERROR')
        } else {
          // Something else happened
          throw new ApiError(error.message, 'UNKNOWN_ERROR')
        }
      }
    )
  }

  private async request<T>(
    config: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.instance.request(config)
    return response.data
  }

  async get<T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      method: 'GET',
      url: endpoint,
    })
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      method: 'POST',
      url: endpoint,
      data,
    })
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      method: 'PUT',
      url: endpoint,
      data,
    })
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      method: 'PATCH',
      url: endpoint,
      data,
    })
  }

  async delete<T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      method: 'DELETE',
      url: endpoint,
    })
  }
}

export const apiClient = new ApiClient(config.apiBaseUrl)
