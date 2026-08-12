import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { PoolClient } from 'pg'

// ---------------------------------------------------------------------------
// Formula evaluator
// ---------------------------------------------------------------------------
function computeScore(
  correct: number,
  wrong: number,
  total: number,
  formula: string,
  negativeMarking: boolean,
  negMarkValue: number
): number {
  const skipped = Math.max(0, total - correct - wrong)
  const attempted = correct + wrong

  // Long names match what the Settings formula builder actually inserts
  // (entities/score-configuration/model/types.ts AVAILABLE_PLACEHOLDERS) —
  // every formula built through the UI uses these. Short aliases are kept
  // only in case a formula was ever hand-typed with the old names.
  const replacements: Array<[RegExp, number]> = [
    [/\{correctAnswers\}/gi,   correct],
    [/\{wrongAnswers\}/gi,     wrong],
    [/\{skippedQuestions\}/gi, skipped],
    [/\{totalQuestions\}/gi,   total],
    [/\{attemptedQuestions\}/gi, attempted],
    [/\{correct\}/gi, correct],
    [/\{wrong\}/gi,   wrong],
    [/\{total\}/gi,   total],
    [/\{skipped\}/gi, skipped],
  ]

  let expr = formula
  for (const [pattern, value] of replacements) {
    expr = expr.replace(pattern, value.toString())
  }

  if (/^[\d\s+\-*/().]+$/.test(expr)) {
    try {
      const result = Number(Function(`'use strict'; return (${expr})`)())
      if (isFinite(result)) return Math.max(0, result)
    } catch { /* fall through */ }
  }

  const base = negativeMarking ? correct - wrong * negMarkValue : correct
  return Math.max(0, base)
}

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params
  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 })
  }

  let client: PoolClient | undefined
  try {
    client = await db.connect()

    // 1. Session info
    const sessionRes = await client.query<{ id: string; name: string; date: Date; center_id: string | null }>(
      `SELECT id, name, date, center_id FROM exam_sessions WHERE id = $1`,
      [sessionId]
    )
    if (sessionRes.rows.length === 0) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }
    const session = sessionRes.rows[0]

    // 2. Candidates who have at least one answer for this session.
    //    candidate_results is not populated by the backend, so candidate_answers
    //    is the reliable source. candidate.status is not used because it changes
    //    when a candidate is reassigned after submitting.
    const candidatesRes = await client.query<{
      id: string
      first_name: string
      last_name: string
      surname: string | null
      firstname: string | null
    }>(
      `SELECT id, first_name, last_name, surname, firstname
       FROM (
         SELECT DISTINCT c.id, c.first_name, c.last_name, c.surname, c.firstname
         FROM candidate_answers ca
         JOIN candidates c ON c.id = ca.candidate_id
         WHERE ca.session_id = $1
       ) t
       ORDER BY
         COALESCE(NULLIF(t.surname,   ''), t.last_name),
         COALESCE(NULLIF(t.firstname, ''), t.first_name)`,
      [sessionId]
    )

    // 3. Questions for the session (joined with subject name)
    const questionsRes = await client.query<{
      id: string
      subject_id: string
      subject_name: string
      correct_answer: string
    }>(
      `SELECT q.id, q.subject_id, s.name AS subject_name, q.answer AS correct_answer
       FROM questions q
       JOIN subjects s ON s.id = q.subject_id
       WHERE q.session_id = $1`,
      [sessionId]
    )

    // 4. All candidate answers for the session
    const answersRes = await client.query<{
      candidate_id: string
      question_id: string
      answer: string | null
    }>(
      `SELECT candidate_id, question_id, answer
       FROM candidate_answers
       WHERE session_id = $1`,
      [sessionId]
    )

    // 5. Active score configuration for this session's center (fallback to plain correct count).
    //    isActive is scoped per-center (score_configurations.center_id), so this must be
    //    filtered by the session's own center — not just "any" active row in the table.
    const scoreConfigRes = session.center_id
      ? await client.query<{
          name: string
          formula: string
          scoring_type: string
          negative_marking: boolean
          negative_mark_value: string | null
        }>(
          `SELECT name, formula, scoring_type, negative_marking, negative_mark_value
           FROM score_configurations
           WHERE is_active = true AND center_id = $1
           ORDER BY updated_at DESC
           LIMIT 1`,
          [session.center_id]
        )
      : { rows: [] as Array<{
          name: string
          formula: string
          scoring_type: string
          negative_marking: boolean
          negative_mark_value: string | null
        }> }

    const scoreConfig = scoreConfigRes.rows[0] ?? {
      name: 'Default',
      formula: 'correct',
      scoring_type: 'POINTS',
      negative_marking: false,
      negative_mark_value: null,
    }
    const negMarkValue = scoreConfig.negative_mark_value
      ? parseFloat(scoreConfig.negative_mark_value)
      : 0

    // Build per-subject question index
    const subjectMap = new Map<
      string,
      { id: string; name: string; questions: typeof questionsRes.rows }
    >()
    for (const q of questionsRes.rows) {
      if (!subjectMap.has(q.subject_id)) {
        subjectMap.set(q.subject_id, { id: q.subject_id, name: q.subject_name, questions: [] })
      }
      subjectMap.get(q.subject_id)!.questions.push(q)
    }

    // Build answer lookup: `${candidateId}:${questionId}` → answer
    const answerMap = new Map<string, string | null>()
    for (const a of answersRes.rows) {
      answerMap.set(`${a.candidate_id}:${a.question_id}`, a.answer)
    }

    const subjects = Array.from(subjectMap.values())

    const candidates = candidatesRes.rows.map((cand) => {
      const displayName = [
        cand.surname   || cand.last_name,
        cand.firstname || cand.first_name,
      ]
        .filter(Boolean)
        .join(' ')

      const subjectScores = subjects.map((subj) => {
        let correct = 0
        let wrong   = 0

        for (const q of subj.questions) {
          const given = answerMap.get(`${cand.id}:${q.id}`)
          if (given == null) continue
          if (given === q.correct_answer) correct++
          else wrong++
        }

        const total   = subj.questions.length
        const skipped = total - correct - wrong
        const score   = computeScore(
          correct, wrong, total,
          scoreConfig.formula,
          scoreConfig.negative_marking,
          negMarkValue
        )

        return {
          subjectId:        subj.id,
          subjectName:      subj.name,
          correctAnswers:   correct,
          wrongAnswers:     wrong,
          skippedQuestions: skipped,
          totalQuestions:   total,
          score,
          scoreConfig: {
            name:        scoreConfig.name,
            formula:     scoreConfig.formula,
            scoringType: scoreConfig.scoring_type,
          },
        }
      })

      const totalScore = subjectScores.reduce((sum, s) => sum + s.score, 0)

      return {
        candidateId:   cand.id,
        candidateName: displayName,
        subjects:      subjectScores,
        totalScore,
      }
    })

    return NextResponse.json({
      sessionId:   session.id,
      sessionName: session.name,
      sessionDate: session.date.toISOString(),
      candidates,
      timestamp:   new Date().toISOString(),
    })
  } catch (err) {
    console.error('[session-scores] error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Database error' },
      { status: 500 }
    )
  } finally {
    try { client?.release() } catch { /* ignore */ }
  }
}
