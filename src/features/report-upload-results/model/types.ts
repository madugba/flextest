import type { APIConfiguration } from '@/entities/api-configuration'

export type WizardStep = 'cohort' | 'pushApi' | 'review' | 'pushing' | 'summary'

export interface Cohort {
  id: string
  name: string
}

export interface CohortsResponse {
  data?: Cohort[]
  total?: number
}

export interface Module {
  id: string
  name: string
}

export interface ModulesResponse {
  data?: Module[]
  total?: number
}

export interface SchoolClass {
  id: string
  name: string
}

export interface SubjectRef {
  id: string
  name: string
}

/** Flextest subject id -> flexdesk module id, persisted across sessions. */
export type SubjectModuleMapping = Record<string, string>

export interface ScorePushPayload {
  cohortId: string
  moduleId: string
  userCode: string
  exam: string
  session: string
  date: string
  score: number
  totalQuestion?: number
  attempt?: number
  correct?: number
}

export interface ScorePushItem {
  payload: ScorePushPayload
  candidateName: string
  subjectName: string
}

export interface PushResult {
  item: ScorePushItem
  success: boolean
  error?: string
}

export interface PushProgress {
  completed: number
  total: number
  succeeded: number
  failed: number
}

export type ProxyMethod = 'GET' | 'POST'

export interface ProxyFetchOptions {
  method?: ProxyMethod
  apiKey?: string
  body?: unknown
}

export type { APIConfiguration }
