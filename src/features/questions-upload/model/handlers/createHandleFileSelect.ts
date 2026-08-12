import type { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { parseQuestionWorkbook } from '../../lib/question-excel'
import type { ParsedRow } from '../types'

export interface HandleFileSelectDeps {
  setImportFile: Dispatch<SetStateAction<File | null>>
  setParsedRows: Dispatch<SetStateAction<ParsedRow[]>>
}

export function createHandleFileSelect(
  deps: HandleFileSelectDeps
): (event: ChangeEvent<HTMLInputElement>) => Promise<void> {
  const { setImportFile, setParsedRows } = deps

  return async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImportFile(file)
    setParsedRows([])

    try {
      const rows = await parseQuestionWorkbook(file)

      setParsedRows(rows)
      const validCount = rows.filter((r) => r.valid).length
      const invalidCount = rows.length - validCount
      if (invalidCount > 0) {
        toast.warning(`${validCount} valid, ${invalidCount} invalid — review the table before importing`)
      } else {
        toast.success(`All ${validCount} questions are valid and ready to import`)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to parse Excel file'
      toast.error(msg)
      setImportFile(null)
      setParsedRows([])
    }
  }
}
