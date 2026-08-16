import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { config } from '@/shared/config'
import { ApiError } from './errors'
import type { ApiResponse } from './types'

export { ApiError } from './errors'
export type { ApiResponse } from './types'

export class ApiClient {
  private instance: AxiosInstance

  constructor(baseUrl: string) {
    this.instance = axios.create({
      baseURL: baseUrl,
      timeout: 20000,
      headers: {
        'Content-Type': 'application/json',
        ...(baseUrl.includes('ngrok') ? { 'ngrok-skip-browser-warning': 'true' } : {}),
      },
    })

    this.instance.interceptors.request.use(
      (config) => {
        const url = config.url || ''
        const requiresAuth = !/\/auth\/logout(\b|$)/.test(url)

        if (requiresAuth && typeof window !== 'undefined') {
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

    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const apiResponse = error.response.data as ApiResponse
          throw new ApiError(
            apiResponse.error?.message || 'An error occurred',
            apiResponse.error?.code,
            error.response.status,
            apiResponse.error?.details
          )
        } else if (error.request) {
          console.error('Network error: Unable to reach server', error.request)
          throw new ApiError('Network error: Unable to reach server', 'NETWORK_ERROR')
        } else {
          console.error('Unknown error', error)
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
