import { ApiClient, ApiError, ApiResponse } from './client'
import { config } from '@/shared/config'


export interface ImportClassResponse {
    success: boolean,
    data: {
        classid: string,
        classname: string
    }[]
}

export interface ImportSubClassResponse {
    success: boolean,
    data?: {
        classarmid?: string,
        classarmname?: string
    }[]
}


class ImportDataApi {
    private apiClient: ApiClient

    constructor(apiEndPoint: string) {
        this.apiClient = new ApiClient(apiEndPoint)
    }

    importClass(): Promise<ApiResponse<{ classid: string; classname: string }[]>> {
        return this.apiClient.get<ImportClassResponse>('/api/import/class').then(response => {
            if (!response.success || !response.data) {
                throw new ApiError(response.error?.message || 'Failed to import class', response.error?.code || 'IMPORT_CLASS_FAILED')
            }
            return response as unknown as ApiResponse<{ classid: string; classname: string }[]>
        })
    }

    importSubClass(classid: string = "000"): Promise<ApiResponse<{ classarmid: string; classarmname: string }[]>> {
        return this.apiClient.get<ImportSubClassResponse>(`/api/import/subclass/${classid}`).then(response => {
            if (!response.success || !response.data) {
                throw new ApiError(response.error?.message || 'Failed to import subclass', response.error?.code || 'IMPORT_SUBCLASS_FAILED')
            }
            return response as unknown as ApiResponse<{ classarmid: string; classarmname: string }[]>
        })
    }
}

export const importApi = new ImportDataApi(config.importApiBaseUrl)