import type { AIModelProvider } from '@/entities/ai-model'
import type { GenerateQuestionsRequest, GeneratedQuestion } from './ai-generation.types'

export class CircuitBreaker {
  private failures = 0
  private lastFailTime = 0
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED'
  private readonly failureThreshold = 3
  private readonly recoveryTimeoutMs = 30_000

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailTime < this.recoveryTimeoutMs) {
        throw new Error('Service temporarily unavailable. Please try again later.')
      }
      this.state = 'HALF_OPEN'
    }

    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private onSuccess() {
    this.failures = 0
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED'
    }
  }

  private onFailure() {
    this.failures++
    this.lastFailTime = Date.now()
    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN'
    }
  }
}

export const MODEL_CONFIGS: Record<AIModelProvider, { maxTokens: number; temperature: number }> = {
  OPENAI: { maxTokens: 16000, temperature: 0.7 },
  GEMINI: { maxTokens: 30000, temperature: 0.7 },
  DEEPSEEK: { maxTokens: 16000, temperature: 0.7 },
}

const circuitBreakers = new Map<string, CircuitBreaker>()

export function getCircuitBreaker(modelId: string): CircuitBreaker {
  if (!circuitBreakers.has(modelId)) {
    circuitBreakers.set(modelId, new CircuitBreaker())
  }
  return circuitBreakers.get(modelId)!
}

export function buildPrompt(request: GenerateQuestionsRequest): string {
  const difficultyDescriptions = {
    easy: 'beginner-level students, testing fundamental concepts and basic understanding',
    medium: 'intermediate students, requiring application of concepts and analytical thinking',
    hard: 'advanced students, demanding deep understanding, critical thinking, and problem-solving skills',
  }

  return `Generate ${request.numQuestions} high-quality multiple-choice exam questions for the subject "${request.subjectName}" at ${request.difficultyLevel} difficulty level.

Difficulty Context: These questions are for ${difficultyDescriptions[request.difficultyLevel]}.

${request.additionalInstructions ? `Additional Requirements: ${request.additionalInstructions}\n` : ''}

CRITICAL REQUIREMENTS:
1. Questions MUST be realistic and similar to actual academic exam questions
2. Each question must test genuine understanding, not trivial memorization
3. All four options (A, B, C, D) must be plausible and well-crafted
4. There must be exactly ONE clearly correct answer
5. Incorrect options (distractors) should be realistic common misconceptions
6. Questions should cover different topics/concepts within the subject
7. Use proper formatting for mathematical expressions, formulas, or symbols if needed
8. Avoid ambiguous or trick questions
9. Make questions appropriate for the specified difficulty level

FORMAT YOUR RESPONSE AS VALID JSON:
{
  "questions": [
    {
      "question": "Complete question text with proper formatting",
      "optionA": "First option text",
      "optionB": "Second option text",
      "optionC": "Third option text",
      "optionD": "Fourth option text",
      "answer": "A"
    }
  ]
}

Generate ${request.numQuestions} questions now. Ensure the JSON is valid and properly formatted.`
}

function stripCodeFences(payload: string): string {
  let result = payload.trim()
  if (result.startsWith('```json')) {
    result = result.replace(/```json\n?/g, '').replace(/```\n?$/g, '')
  } else if (result.startsWith('```')) {
    result = result.replace(/```\n?/g, '').replace(/```\n?$/g, '')
  }
  return result
}

export function parseAIResponse(content: string): GeneratedQuestion[] {
  try {
    const jsonContent = stripCodeFences(content)
    const parsed = JSON.parse(jsonContent)
    const questions: unknown[] = parsed.questions || []

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('No questions found in AI response')
    }

    return questions.map((q, index) => {
      if (typeof q !== 'object' || q === null) {
        throw new Error(`Question ${index + 1} is not a valid object`)
      }
      const question = q as Record<string, unknown>
      if (!question.question || !question.optionA || !question.optionB || !question.optionC || !question.optionD || !question.answer) {
        throw new Error(`Question ${index + 1} is missing required fields`)
      }
      const answer = String(question.answer).toUpperCase()
      if (!['A', 'B', 'C', 'D'].includes(answer)) {
        throw new Error(`Question ${index + 1} has invalid answer: ${answer}`)
      }
      return {
        question: String(question.question).trim(),
        optionA: String(question.optionA).trim(),
        optionB: String(question.optionB).trim(),
        optionC: String(question.optionC).trim(),
        optionD: String(question.optionD).trim(),
        answer: answer as 'A' | 'B' | 'C' | 'D',
      }
    })
  } catch (error: unknown) {
    console.error('Failed to parse AI response:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Failed to parse AI response: ${message}`)
  }
}
