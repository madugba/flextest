/**
 * Exam Session Types
 */

export type SessionStatus = 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'

export interface ExamSession {
  id: string
  name: string
  date: string
  hallCapacity: number
  totalQuestion: number
  totalCompulsorySubject: number
  totalCompulsoryQuestion: number
  totalOtherQuestions: number
  time: string
  duration: number
  status: SessionStatus
  compulsorySubjectId: string | null
  centerId: string | null
  createdAt: string
  updatedAt: string
  center?: {
    id: string
    centerName: string
    state: string
  }
  compulsorySubject?: {
    id: string
    name: string
  }
}

export interface CreateExamSessionRequest {
  name: string
  date: string
  hallCapacity: number
  totalQuestion: number
  totalCompulsorySubject: number
  totalCompulsoryQuestion: number
  totalOtherQuestions: number
  time: string
  duration: number
  status?: SessionStatus
  compulsorySubjectId: string
  centerId?: string
}

export interface UpdateExamSessionRequest {
  name?: string
  date?: string
  hallCapacity?: number
  totalQuestion?: number
  totalCompulsorySubject?: number
  totalCompulsoryQuestion?: number
  totalOtherQuestions?: number
  time?: string
  duration?: number
  status?: SessionStatus
  compulsorySubjectId?: string
  centerId?: string
}

/**
 * Session Statistics
 * Aggregated statistics for exam session reporting
 */
export interface SessionStatistics {
  scheduled: number
  absent: number
  present?: number
  submitted: number
  averageScore?: number
  passCount?: number
  failCount?: number
  passPercentage?: number
}

/**
 * Score Distribution Bucket
 * Groups scores into ranges for statistical visualization
 */
export interface ScoreDistributionBucket {
  range: string // "0-20", "21-40", "41-60", "61-80", "81-100"
  count: number
  percentage: number
}

/**
 * Subject Performance Metrics
 * Performance statistics per subject
 */
export interface SubjectPerformance {
  subjectId: string
  subjectName: string
  avgScore: number
  avgCorrectAnswers: number
  totalAttempted: number
}

/**
 * Session Analysis
 * Comprehensive statistical analysis for completed exam sessions
 */
export interface SessionAnalysis {
  sessionId: string
  sessionName: string
  sessionDate: string
  totalCandidates: number
  submittedCount: number
  scoreDistribution: ScoreDistributionBucket[]
  subjectWisePerformance: SubjectPerformance[]
  passingTrend: {
    pass: number
    fail: number
    passPercentage: number
  }
  topScorers: Array<{
    candidateId: string
    candidateName: string
    score: number
  }>
  timestamp: string
}

/**
 * Session Report Data
 * Extended exam session with statistics for reports page
 */
export interface SessionReportData extends ExamSession {
  statistics: SessionStatistics
}

/**
 * Session Scores
 * Detailed scores per candidate per subject using active score configuration
 */
export interface SessionScores {
  sessionId: string
  sessionName: string
  sessionDate: string
  candidates: Array<{
    candidateId: string
    candidateName: string
    subjects: Array<{
      subjectId: string
      subjectName: string
      correctAnswers: number
      wrongAnswers: number
      skippedQuestions: number
      totalQuestions: number
      score: number
      scoreConfig: {
        name: string
        formula: string
        scoringType: string
      }
    }>
    totalScore: number
  }>
  timestamp: string
}
