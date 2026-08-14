import type { AIModelProvider } from '@/entities/ai-model'

export function getProviderDisplayName(provider: AIModelProvider): string {
  switch (provider) {
    case 'OPENAI':
      return 'OpenAI'
    case 'GEMINI':
      return 'Google Gemini'
    case 'DEEPSEEK':
      return 'DeepSeek'
    default:
      return provider
  }
}
