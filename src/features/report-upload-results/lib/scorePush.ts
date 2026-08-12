import { format } from 'date-fns'
import type { SessionScores } from '@/entities/exam-session'
import type { Cohort, ScorePushItem, SubjectModuleMapping, SubjectRef } from '../model/types'

function parseCohort(item: unknown): Cohort | null {
  if (typeof item !== 'object' || item === null) return null
  const o = item as Record<string, unknown>
  const id = String(o.id ?? '').trim()
  const name = String(o.name ?? '').trim()
  if (!id || !name) return null
  return { id, name }
}

/** Parses a cohorts API response ({ data: [{id, name}], total }) into a flat list. */
export function extractCohorts(raw: unknown): Cohort[] {
  const arr = Array.isArray(raw) ? raw : (raw as { data?: unknown })?.data
  if (!Array.isArray(arr)) return []
  return arr.map(parseCohort).filter((c): c is Cohort => c !== null)
}

export function formatPushDate(dateString: string): string {
  return format(new Date(dateString), 'yyyy-MM-dd')
}

/** Every distinct subject scored in this session, deduplicated by subject id. */
export function extractDistinctSubjects(scores: SessionScores): SubjectRef[] {
  const seen = new Map<string, string>()
  for (const candidate of scores.candidates) {
    for (const subject of candidate.subjects) {
      if (!seen.has(subject.subjectId)) seen.set(subject.subjectId, subject.subjectName)
    }
  }
  return Array.from(seen.entries()).map(([id, name]) => ({ id, name }))
}

/**
 * Flattens a session's candidate x subject scores into one push item per score.
 * Skips a subject when: there's no module mapping for it yet (caller is expected
 * to have gated on a complete mapping before reaching this point), the candidate
 * attempted zero questions, or got zero correct — nothing meaningful to push.
 */
export function buildScorePayloads(
  scores: SessionScores,
  cohort: Cohort,
  subjectModuleMapping: SubjectModuleMapping
): ScorePushItem[] {
  const date = formatPushDate(scores.sessionDate)

  return scores.candidates.flatMap((candidate) =>
    candidate.subjects.flatMap((subject) => {
      const moduleId = subjectModuleMapping[subject.subjectId]
      if (!moduleId) return []

      const attempted = subject.correctAnswers + subject.wrongAnswers
      if (attempted === 0 || subject.correctAnswers === 0) return []

      return [{
        payload: {
          cohortId: cohort.id,
          moduleId,
          userCode: candidate.candidateId,
          exam: cohort.name,
          session: scores.sessionName,
          date,
          score: subject.score,
          totalQuestion: subject.totalQuestions,
          attempt: attempted,
          correct: subject.correctAnswers,
        },
        candidateName: candidate.candidateName,
        subjectName: subject.subjectName,
      }]
    })
  )
}
