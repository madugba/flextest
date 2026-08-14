export interface DataCounts {
  sessions: number
  candidates: number
  questions: number
  answers: number
  results: number
  lastSession?: {
    name: string
    date: string
  } | null
}
