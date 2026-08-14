import type { AnswerOption } from '@/entities/question'
import type { InvalidParsedRow, ParsedRow, ValidParsedRow } from '../model/types'

function getField(row: Record<string, unknown>, fieldName: string): unknown {
  if (row[fieldName] !== undefined) return row[fieldName]
  const lower = fieldName.toLowerCase()
  for (const key in row) {
    if (key.toLowerCase() === lower) return row[key]
  }
  const norm = fieldName.toLowerCase().replace(/[\s_]/g, '')
  for (const key in row) {
    if (key.toLowerCase().replace(/[\s_]/g, '') === norm) return row[key]
  }
  return undefined
}

export function buildParsedRow(row: Record<string, unknown>, rowNumber: number): ParsedRow {
  const q = getField(row, 'question')
  const oA = getField(row, 'optionA')
  const oB = getField(row, 'optionB')
  const oC = getField(row, 'optionC')
  const oD = getField(row, 'optionD')
  const a = getField(row, 'answer')

  const question = q != null ? String(q).trim() : ''
  const optionA = oA != null ? String(oA).trim() : ''
  const optionB = oB != null ? String(oB).trim() : ''
  const optionC = oC != null ? String(oC).trim() : ''
  const optionD = oD != null ? String(oD).trim() : ''
  const answer = a != null ? String(a).trim().toUpperCase() : ''

  const errors: string[] = []
  if (!question) errors.push('Question text is empty')
  if (!optionA) errors.push('Option A is empty')
  if (!optionB) errors.push('Option B is empty')
  if (!optionC) errors.push('Option C is empty')
  if (!optionD) errors.push('Option D is empty')
  if (!answer) {
    errors.push('Answer is empty')
  } else if (!['A', 'B', 'C', 'D'].includes(answer)) {
    errors.push(`Answer "${answer}" must be A, B, C, or D`)
  }

  if (errors.length > 0) {
    return {
      rowNumber,
      valid: false,
      errors,
      question,
      optionA,
      optionB,
      optionC,
      optionD,
      answer,
    } as InvalidParsedRow
  }
  return {
    rowNumber,
    valid: true,
    question,
    optionA,
    optionB,
    optionC,
    optionD,
    answer: answer as AnswerOption,
  } as ValidParsedRow
}
