import * as XLSX from 'xlsx'
import type { ParsedRow } from '../model/types'
import { buildParsedRow } from './build-parsed-row'

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
