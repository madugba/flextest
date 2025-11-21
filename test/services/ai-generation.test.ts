import { generateQuestions } from '@/shared/services/ai-generation.service'
import type { AIModelConfiguration } from '@/entities/ai-model'
import OpenAI from 'openai'

jest.mock('openai')
jest.mock('@google/generative-ai')

describe('AI Generation Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('generateQuestions - Response Parsing', () => {
    it('should parse responses with JSON code fences', async () => {
      const mockModel: AIModelConfiguration = {
        id: 'test-model',
        provider: 'OPENAI',
        modelName: 'gpt-4',
        apiKey: 'test-key',
      }

      const mockCompletion = {
        choices: [
          {
            message: {
              content: '```json\n{"questions": [{"question": "What is 2+2?", "optionA": "3", "optionB": "4", "optionC": "5", "optionD": "6", "answer": "B"}]}\n```',
            },
          },
        ],
      }

      const mockOpenAI = {
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue(mockCompletion),
          },
        },
      }

      ;(OpenAI as jest.MockedClass<typeof OpenAI>).mockImplementation(() => mockOpenAI as unknown as OpenAI)

      const result = await generateQuestions({
        model: mockModel,
        subjectName: 'Mathematics',
        difficultyLevel: 'easy',
        numQuestions: 1,
      })

      expect(result).toHaveLength(1)
      expect(result[0].answer).toBe('B')
    })

    it('should parse responses without code fences', async () => {
      const mockModel: AIModelConfiguration = {
        id: 'test-model',
        provider: 'OPENAI',
        modelName: 'gpt-4',
        apiKey: 'test-key',
      }

      const mockCompletion = {
        choices: [
          {
            message: {
              content: '{"questions": [{"question": "Test?", "optionA": "A", "optionB": "B", "optionC": "C", "optionD": "D", "answer": "A"}]}',
            },
          },
        ],
      }

      const mockOpenAI = {
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue(mockCompletion),
          },
        },
      }

      ;(OpenAI as jest.MockedClass<typeof OpenAI>).mockImplementation(() => mockOpenAI as unknown as OpenAI)

      const result = await generateQuestions({
        model: mockModel,
        subjectName: 'Math',
        difficultyLevel: 'easy',
        numQuestions: 1,
      })

      expect(result).toHaveLength(1)
    })
  })

  describe('generateQuestions', () => {
    const mockModel: AIModelConfiguration = {
      id: 'test-model',
      provider: 'OPENAI',
      modelName: 'gpt-4',
      apiKey: 'test-key',
    }

    it('should generate questions with OpenAI', async () => {
      const mockCompletion = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                questions: [
                  {
                    question: 'What is 2+2?',
                    optionA: '3',
                    optionB: '4',
                    optionC: '5',
                    optionD: '6',
                    answer: 'B',
                  },
                ],
              }),
            },
          },
        ],
      }

      const mockOpenAI = {
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue(mockCompletion),
          },
        },
      }

      ;(OpenAI as jest.MockedClass<typeof OpenAI>).mockImplementation(() => mockOpenAI as unknown as OpenAI)

      const result = await generateQuestions({
        model: mockModel,
        subjectName: 'Mathematics',
        difficultyLevel: 'easy',
        numQuestions: 1,
      })

      expect(result).toHaveLength(1)
      expect(result[0].question).toBe('What is 2+2?')
      expect(mockOpenAI.chat.completions.create).toHaveBeenCalled()
    })

    it('should handle circuit breaker open state', async () => {
      const mockModel: AIModelConfiguration = {
        id: 'failing-model',
        provider: 'OPENAI',
        modelName: 'gpt-4',
        apiKey: 'test-key',
      }

      const mockOpenAI = {
        chat: {
          completions: {
            create: jest.fn().mockRejectedValue(new Error('API Error')),
          },
        },
      }

      ;(OpenAI as jest.MockedClass<typeof OpenAI>).mockImplementation(() => mockOpenAI as unknown as OpenAI)

      // Trigger failures to open circuit breaker
      for (let i = 0; i < 3; i++) {
        try {
          await generateQuestions({
            model: mockModel,
            subjectName: 'Math',
            difficultyLevel: 'easy',
            numQuestions: 1,
          })
        } catch {
          // Expected to fail
        }
      }

      // Circuit should be open now
      await expect(
        generateQuestions({
          model: mockModel,
          subjectName: 'Math',
          difficultyLevel: 'easy',
          numQuestions: 1,
        })
      ).rejects.toThrow('Service temporarily unavailable')
    })

    it('should throw error for unsupported provider', async () => {
      const invalidModel: AIModelConfiguration = {
        id: 'invalid',
        provider: 'INVALID' as AIModelConfiguration['provider'],
        modelName: 'test',
        apiKey: 'key',
      }

      await expect(
        generateQuestions({
          model: invalidModel,
          subjectName: 'Math',
          difficultyLevel: 'easy',
          numQuestions: 1,
        })
      ).rejects.toThrow('Unsupported AI provider')
    })

    it('should throw error when no questions in response', async () => {
      const mockModel: AIModelConfiguration = {
        id: 'test-model',
        provider: 'OPENAI',
        modelName: 'gpt-4',
        apiKey: 'test-key',
      }

      const mockCompletion = {
        choices: [
          {
            message: {
              content: JSON.stringify({ data: [] }),
            },
          },
        ],
      }

      const mockOpenAI = {
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue(mockCompletion),
          },
        },
      }

      ;(OpenAI as jest.MockedClass<typeof OpenAI>).mockImplementation(() => mockOpenAI as unknown as OpenAI)

      await expect(
        generateQuestions({
          model: mockModel,
          subjectName: 'Math',
          difficultyLevel: 'easy',
          numQuestions: 1,
        })
      ).rejects.toThrow('No questions found')
    })

    it('should throw error for invalid answer', async () => {
      const mockModel: AIModelConfiguration = {
        id: 'test-model',
        provider: 'OPENAI',
        modelName: 'gpt-4',
        apiKey: 'test-key',
      }

      const mockCompletion = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                questions: [
                  {
                    question: 'Test?',
                    optionA: 'A',
                    optionB: 'B',
                    optionC: 'C',
                    optionD: 'D',
                    answer: 'E',
                  },
                ],
              }),
            },
          },
        ],
      }

      const mockOpenAI = {
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue(mockCompletion),
          },
        },
      }

      ;(OpenAI as jest.MockedClass<typeof OpenAI>).mockImplementation(() => mockOpenAI as unknown as OpenAI)

      await expect(
        generateQuestions({
          model: mockModel,
          subjectName: 'Math',
          difficultyLevel: 'easy',
          numQuestions: 1,
        })
      ).rejects.toThrow('invalid answer')
    })
  })
})

