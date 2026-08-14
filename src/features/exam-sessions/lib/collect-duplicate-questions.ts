import {
  getQuestionsBySubjectAndSession,
  bulkImportQuestions,
  type CreateQuestionRequest,
} from '@/entities/question'

export async function collectDuplicateQuestions(
  sessionId: string,
  subjectIds: string[],
  newSessionId: string
): Promise<CreateQuestionRequest[]> {
  const allQuestions: CreateQuestionRequest[] = []
  for (const subjectId of subjectIds) {
    const questions = await getQuestionsBySubjectAndSession(subjectId, sessionId)
    for (const q of questions) {
      allQuestions.push({
        question: q.question,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        answer: q.answer,
        subjectId: q.subjectId,
        sessionId: newSessionId,
      })
    }
  }

  if (allQuestions.length > 0) {
    await bulkImportQuestions({ questions: allQuestions })
  }

  return allQuestions
}
