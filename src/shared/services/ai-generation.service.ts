import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AIModelConfiguration, AIModelProvider } from '@/entities/ai-model';

export interface GenerateQuestionsRequest {
  model: AIModelConfiguration;
  subjectName: string;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  additionalInstructions?: string;
  numQuestions: number;
}

export interface GeneratedQuestion {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: 'A' | 'B' | 'C' | 'D';
}

/**
 * Simple Circuit Breaker for AI calls
 */
class CircuitBreaker {
  private failures = 0;
  private lastFailTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private readonly failureThreshold = 3;
  private readonly recoveryTimeout = 30000; // 30 seconds

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Check if circuit is open
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailTime < this.recoveryTimeout) {
        throw new Error('Service temporarily unavailable. Please try again later.');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
    }
  }

  private onFailure() {
    this.failures++;
    this.lastFailTime = Date.now();
    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }
}

const MODEL_CONFIGS: Record<AIModelProvider, { maxTokens: number; temperature: number }> = {
  OPENAI: { maxTokens: 16000, temperature: 0.7 },
  GEMINI: { maxTokens: 30000, temperature: 0.7 },
  DEEPSEEK: { maxTokens: 16000, temperature: 0.7 },
};

const circuitBreakers = new Map<string, CircuitBreaker>();

function getCircuitBreaker(modelId: string): CircuitBreaker {
  if (!circuitBreakers.has(modelId)) {
    circuitBreakers.set(modelId, new CircuitBreaker());
  }
  return circuitBreakers.get(modelId)!;
}

/**
 * Build prompt for AI
 */
function buildPrompt(request: GenerateQuestionsRequest): string {
  const difficultyDescriptions = {
    easy: 'beginner-level students, testing fundamental concepts and basic understanding',
    medium: 'intermediate students, requiring application of concepts and analytical thinking',
    hard: 'advanced students, demanding deep understanding, critical thinking, and problem-solving skills',
  };

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

Generate ${request.numQuestions} questions now. Ensure the JSON is valid and properly formatted.`;
}

/**
 * Parse and validate AI response
 */
function parseAIResponse(content: string): GeneratedQuestion[] {
  try {
    // Remove markdown code blocks if present
    let jsonContent = content.trim();
    if (jsonContent.startsWith('```json')) {
      jsonContent = jsonContent.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/```\n?/g, '').replace(/```\n?$/g, '');
    }

    const parsed = JSON.parse(jsonContent);
    const questions: unknown[] = parsed.questions || [];

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('No questions found in AI response');
    }

    // Validate each question
    return questions.map((q, index) => {
      // Type guard to ensure q is an object with expected properties
      if (typeof q !== 'object' || q === null) {
        throw new Error(`Question ${index + 1} is not a valid object`);
      }

      const question = q as Record<string, unknown>;

      if (!question.question || !question.optionA || !question.optionB || !question.optionC || !question.optionD || !question.answer) {
        throw new Error(`Question ${index + 1} is missing required fields`);
      }

      const answer = String(question.answer).toUpperCase();
      if (!['A', 'B', 'C', 'D'].includes(answer)) {
        throw new Error(`Question ${index + 1} has invalid answer: ${answer}`);
      }

      return {
        question: String(question.question).trim(),
        optionA: String(question.optionA).trim(),
        optionB: String(question.optionB).trim(),
        optionC: String(question.optionC).trim(),
        optionD: String(question.optionD).trim(),
        answer: answer as 'A' | 'B' | 'C' | 'D',
      };
    });
  } catch (error: unknown) {
    console.error('Failed to parse AI response:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to parse AI response: ${message}`);
  }
}

/**
 * Generate questions using OpenAI
 */
async function generateWithOpenAI(
  model: AIModelConfiguration,
  request: GenerateQuestionsRequest
): Promise<GeneratedQuestion[]> {
  const openai = new OpenAI({
    apiKey: model.apiKey,
    dangerouslyAllowBrowser: true, // Required for client-side usage
  });

  const config = MODEL_CONFIGS.OPENAI;
  const prompt = buildPrompt(request);

  // Normalize model name to lowercase
  const modelName = (model.modelName || 'gpt-4-turbo-preview').toLowerCase().trim();

  const completion = await openai.chat.completions.create({
    model: modelName,
    messages: [
      {
        role: 'system',
        content:
          'You are an expert exam question writer. Generate high-quality, accurate multiple-choice questions suitable for academic exams. Each question must be clear, unambiguous, and have exactly one correct answer.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: config.temperature,
    max_tokens: config.maxTokens,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  return parseAIResponse(content);
}

/**
 * Generate questions using Google Gemini
 */
async function generateWithGemini(
  model: AIModelConfiguration,
  request: GenerateQuestionsRequest
): Promise<GeneratedQuestion[]> {
  const genAI = new GoogleGenerativeAI(model.apiKey);

  // Normalize model name to lowercase to match Gemini API expectations
  // Valid models (2025): gemini-2.5-pro, gemini-2.5-flash, gemini-2.5-flash-lite
  // Legacy models (deprecated April 2025): gemini-pro, gemini-1.5-pro, gemini-1.5-flash
  let modelName = (model.modelName || 'gemini-2.5-flash').toLowerCase().trim();

  // Auto-migrate deprecated model names to current equivalents
  const modelMigrations: Record<string, string> = {
    'gemini': 'gemini-2.5-flash',
    'gemini-pro': 'gemini-2.5-pro',
    'gemini-1.5-pro': 'gemini-2.5-pro',
    'gemini-1.5-flash': 'gemini-2.5-flash',
  };

  if (modelMigrations[modelName]) {
    console.warn(`[Gemini] Migrating deprecated model "${modelName}" to "${modelMigrations[modelName]}"`);
    modelName = modelMigrations[modelName];
  }

  const geminiModel = genAI.getGenerativeModel({
    model: modelName,
  });

  const config = MODEL_CONFIGS.GEMINI;
  const prompt = buildPrompt(request);

  const result = await geminiModel.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: config.temperature,
      maxOutputTokens: config.maxTokens,
    },
  });

  const response = await result.response;
  const content = response.text();

  if (!content) {
    throw new Error('No response from Gemini');
  }

  return parseAIResponse(content);
}

/**
 * Generate questions using DeepSeek (OpenAI-compatible)
 */
async function generateWithDeepSeek(
  model: AIModelConfiguration,
  request: GenerateQuestionsRequest
): Promise<GeneratedQuestion[]> {
  const openai = new OpenAI({
    apiKey: model.apiKey,
    baseURL: 'https://api.deepseek.com/v1',
    dangerouslyAllowBrowser: true,
  });

  const config = MODEL_CONFIGS.DEEPSEEK;
  const prompt = buildPrompt(request);

  // Normalize model name to lowercase
  const modelName = (model.modelName || 'deepseek-chat').toLowerCase().trim();

  const completion = await openai.chat.completions.create({
    model: modelName,
    messages: [
      {
        role: 'system',
        content:
          'You are an expert exam question writer. Generate high-quality, accurate multiple-choice questions suitable for academic exams. Each question must be clear, unambiguous, and have exactly one correct answer.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: config.temperature,
    max_tokens: config.maxTokens,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from DeepSeek');
  }

  return parseAIResponse(content);
}

/**
 * Main function to generate questions
 */
export async function generateQuestions(
  request: GenerateQuestionsRequest
): Promise<GeneratedQuestion[]> {
  const circuitBreaker = getCircuitBreaker(request.model.id);

  return circuitBreaker.execute(async () => {
    switch (request.model.provider) {
      case 'OPENAI':
        return generateWithOpenAI(request.model, request);
      case 'GEMINI':
        return generateWithGemini(request.model, request);
      case 'DEEPSEEK':
        return generateWithDeepSeek(request.model, request);
      default:
        throw new Error(`Unsupported AI provider: ${request.model.provider}`);
    }
  });
}
