import * as XLSX from 'xlsx'
import type { AnswerOption } from '@/entities/question'
import type { InvalidParsedRow, ParsedRow, ValidParsedRow } from '../model/types'

export const SAMPLE_QUESTION_ROWS = [
  {
    question: 'What is 2 + 2?',
    optionA: '3',
    optionB: '4',
    optionC: '5',
    optionD: '6',
    answer: 'B',
  },
  {
    question: 'What is the capital of France?',
    optionA: 'London',
    optionB: 'Berlin',
    optionC: 'Paris',
    optionD: 'Madrid',
    answer: 'C',
  },
  {
    question: 'Which planet is known as the Red Planet?',
    optionA: 'Venus',
    optionB: 'Mars',
    optionC: 'Jupiter',
    optionD: 'Saturn',
    answer: 'B',
  },
] as const

export function downloadSampleQuestionWorkbook(): void {
  const worksheet = XLSX.utils.json_to_sheet([...SAMPLE_QUESTION_ROWS])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Questions')
  XLSX.writeFile(workbook, 'questions_sample.xlsx')
}

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

function buildParsedRow(
  row: Record<string, unknown>,
  rowNumber: number
): ParsedRow {
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

export async function parseQuestionWorkbook(file: File): Promise<ParsedRow[]> {
  const data = await file.arrayBuffer()
  const workbook = XLSX.read(data)
  const worksheet = workbook.Sheets[workbook.SheetNames[0]!]!

  const rawArrays = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][]

  if (rawArrays.length === 0) {
    throw new Error('The Excel file is empty or has no data rows')
  }

  const EXPECTED = ['question', 'optiona', 'optionb', 'optionc', 'optiond', 'answer']
  const firstRow = (rawArrays[0] ?? []) as unknown[]
  const firstRowNorm = firstRow.map((c) => String(c ?? '').toLowerCase().replace(/[\s_]/g, ''))
  const hasHeaderRow = firstRowNorm.some((cell) => EXPECTED.includes(cell))

  let dataRows: Record<string, unknown>[]
  let firstDataRowNumber: number

  if (hasHeaderRow) {
    dataRows = XLSX.utils.sheet_to_json(worksheet) as Record<string, unknown>[]
    firstDataRowNumber = 2
  } else {
    const POSITIONAL = ['question', 'optionA', 'optionB', 'optionC', 'optionD', 'answer']
    dataRows = rawArrays.map((row) => {
      const obj: Record<string, unknown> = {}
      POSITIONAL.forEach((name, i) => {
        obj[name] = (row as unknown[])[i]
      })
      return obj
    })
    firstDataRowNumber = 1
  }

  if (dataRows.length === 0) {
    throw new Error('The Excel file has no data rows')
  }

  const nonEmptyDataRows = dataRows
    .map((row, i) => ({ row, originalIndex: i }))
    .filter(({ row }) => Object.values(row).some((v) => v != null && String(v).trim() !== ''))

  if (nonEmptyDataRows.length === 0) {
    throw new Error('The Excel file has no data rows')
  }

  return nonEmptyDataRows.map(({ row, originalIndex }) =>
    buildParsedRow(row, firstDataRowNumber + originalIndex)
  )
}
