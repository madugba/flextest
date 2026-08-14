export interface CandidateProgressRef {
  current: Map<string, { attempted: number; totalQuestions: number }>
}
