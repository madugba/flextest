export interface TimerApiResponse {
  remainingSeconds: number
  durationSeconds: number
  status: 'RUNNING' | 'PAUSED' | 'STOPPED'
  source?: string
}
