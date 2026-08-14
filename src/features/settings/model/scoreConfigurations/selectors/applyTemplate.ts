import { FORMULA_TEMPLATES, type ScoringType } from '@/entities/score-configuration'
import type { ScoreFormData } from '../types'

export function applyTemplate(templateKey: string): ScoreFormData | null {
  if (!templateKey) return null
  const template = FORMULA_TEMPLATES[templateKey as keyof typeof FORMULA_TEMPLATES]
  if (!template) return null
  return {
    name: template.name,
    description: template.description,
    formula: template.formula,
    scoringType: template.scoringType as ScoringType,
    negativeMarking: 'negativeMarking' in template ? template.negativeMarking : false,
    negativeMarkValue: 'negativeMarkValue' in template ? template.negativeMarkValue : undefined,
    maxScore: 100,
    passingScore: 40,
    gradeRanges: {},
  }
}
