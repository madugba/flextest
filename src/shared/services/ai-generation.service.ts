import OpenAI from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AIModelConfiguration } from '@/entities/ai-model'
import {
  MODEL_CONFIGS,
  buildPrompt,
  getCircuitBreaker,
  parseAIResponse,
} from './ai-generation.helpers'
import type { GenerateQuestionsRequest, GeneratedQuestion } from './ai-generation.types'

export type { GenerateQuestionsRequest, GeneratedQuestion } from './ai-generation.types'

async function generateWithOpenAI(
  model: AIModelConfiguration,
  request: GenerateQuestionsRequest
): Promise<GeneratedQuestion[]> {
  const openai = new OpenAI({
    apiKey: model.apiKey,
    dangerouslyAllowBrowser: true,
  })

  const config = MODEL_CONFIGS.OPENAI
  const prompt = buildPrompt(request)
  const normalizedModelName = (model.modelName || 'gpt-4-turbo-preview').toLowerCase().trim()

  const completion = await openai.chat.completions.create({
    model: normalizedModelName,
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
  })

  const content = completion.choices[0]?.message?.content
  if (!content) {
    throw new Error('No response from OpenAI')
  }

  return parseAIResponse(content)
}

async function generateWithGemini(
  model: AIModelConfiguration,
  request: GenerateQuestionsRequest
): Promise<GeneratedQuestion[]> {
  const genAI = new GoogleGenerativeAI(model.apiKey)
  const geminiDefaultModel = 'gemini-2.5-flash'
  const geminiModelMigrations: Record<string, string> = {
    gemini: 'gemini-2.5-flash',
    'gemini-pro': 'gemini-2.5-pro',
    'gemini-1.5-pro': 'gemini-2.5-pro',
    'gemini-1.5-flash': 'gemini-2.5-flash',
  }
  let modelName = (model.modelName || geminiDefaultModel).toLowerCase().trim()

  if (geminiModelMigrations[modelName]) {
    console.warn(`[Gemini] Migrating deprecated model "${modelName}" to "${geminiModelMigrations[modelName]}"`)
    modelName = geminiModelMigrations[modelName]
  }

  const geminiModel = genAI.getGenerativeModel({
    model: modelName,
  })

  const config = MODEL_CONFIGS.GEMINI
  const prompt = buildPrompt(request)

  const result = await geminiModel.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: config.temperature,
      maxOutputTokens: config.maxTokens,
    },
  })

  const response = await result.response
  const content = response.text()

  if (!content) {
    throw new Error('No response from Gemini')
  }

  return parseAIResponse(content)
}

async function generateWithDeepSeek(
  model: AIModelConfiguration,
  request: GenerateQuestionsRequest
): Promise<GeneratedQuestion[]> {
  const openai = new OpenAI({
    apiKey: model.apiKey,
    baseURL: 'https://api.deepseek.com/v1',
    dangerouslyAllowBrowser: true,
  })

  const config = MODEL_CONFIGS.DEEPSEEK
  const prompt = buildPrompt(request)
  const normalizedModelName = (model.modelName || 'deepseek-chat').toLowerCase().trim()

  const completion = await openai.chat.completions.create({
    model: normalizedModelName,
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
  })

  const content = completion.choices[0]?.message?.content
  if (!content) {
    throw new Error('No response from DeepSeek')
  }

  return parseAIResponse(content)
}

export async function generateQuestions(
  request: GenerateQuestionsRequest
): Promise<GeneratedQuestion[]> {
  const circuitBreaker = getCircuitBreaker(request.model.id)

  return circuitBreaker.execute(async () => {
    switch (request.model.provider) {
      case 'OPENAI':
        return generateWithOpenAI(request.model, request)
      case 'GEMINI':
        return generateWithGemini(request.model, request)
      case 'DEEPSEEK':
        return generateWithDeepSeek(request.model, request)
      default:
        throw new Error(`Unsupported AI provider: ${request.model.provider}`)
    }
  })
}
