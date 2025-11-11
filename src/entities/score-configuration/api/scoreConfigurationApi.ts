import { apiClient } from '@/shared/api/client';
import type {
  ScoreConfiguration,
  CreateScoreConfigurationRequest,
  UpdateScoreConfigurationRequest,
  ValidateFormulaRequest,
  ValidateFormulaResponse,
  PreviewScoreRequest,
  PreviewScoreResponse,
} from '../model/types';

const BASE_URL = '/score-configurations';

export async function getAllScoreConfigurations(centerId?: string): Promise<ScoreConfiguration[]> {
  const params = centerId ? { centerId } : {};
  const response = await apiClient.get<ScoreConfiguration[]>(BASE_URL, { params });
  return response.data || [];
}

export async function getScoreConfigurationById(id: string): Promise<ScoreConfiguration> {
  const response = await apiClient.get<ScoreConfiguration>(`${BASE_URL}/${id}`);
  if (!response.data) {
    throw new Error('Score configuration not found');
  }
  return response.data;
}

export async function getScoreConfigurationsByCenterId(centerId: string): Promise<ScoreConfiguration[]> {
  const response = await apiClient.get<ScoreConfiguration[]>(`${BASE_URL}/by-center/${centerId}`);
  return response.data || [];
}

export async function getActiveScoreConfiguration(centerId: string): Promise<ScoreConfiguration | null> {
  try {
    const response = await apiClient.get<ScoreConfiguration>(`${BASE_URL}/active/${centerId}`);
    return response.data || null;
  } catch (error) {
    return null;
  }
}

export async function createScoreConfiguration(data: CreateScoreConfigurationRequest): Promise<ScoreConfiguration> {
  const response = await apiClient.post<ScoreConfiguration>(BASE_URL, data);
  if (!response.data) {
    throw new Error('Failed to create score configuration');
  }
  return response.data;
}

export async function updateScoreConfiguration(
  id: string,
  data: UpdateScoreConfigurationRequest
): Promise<ScoreConfiguration> {
  const response = await apiClient.put<ScoreConfiguration>(`${BASE_URL}/${id}`, data);
  if (!response.data) {
    throw new Error('Failed to update score configuration');
  }
  return response.data;
}

export async function activateScoreConfiguration(id: string): Promise<ScoreConfiguration> {
  const response = await apiClient.put<ScoreConfiguration>(`${BASE_URL}/${id}/activate`);
  if (!response.data) {
    throw new Error('Failed to activate score configuration');
  }
  return response.data;
}

export async function deleteScoreConfiguration(id: string): Promise<void> {
  await apiClient.delete(`${BASE_URL}/${id}`);
}

export async function validateFormula(data: ValidateFormulaRequest): Promise<ValidateFormulaResponse> {
  const response = await apiClient.post<ValidateFormulaResponse>(`${BASE_URL}/validate-formula`, data);
  if (!response.data) {
    throw new Error('Failed to validate formula');
  }
  return response.data;
}

export async function previewScore(data: PreviewScoreRequest): Promise<PreviewScoreResponse> {
  const response = await apiClient.post<PreviewScoreResponse>(`${BASE_URL}/preview`, data);
  if (!response.data) {
    throw new Error('Failed to preview score');
  }
  return response.data;
}