import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { bulkImportQuestions } from '@/entities/question'
import type { ParsedRow, ValidParsedRow } from '../types'

export interface HandleImportDeps {
  parsedRows: ParsedRow[]
  subjectId: string
  sessionId: string
  setIsImporting: Dispatch<SetStateAction<boolean>>
  setImportDialogOpen: Dispatch<SetStateAction<boolean>>
  setImportFile: Dispatch<SetStateAction<File | null>>
  setParsedRows: Dispatch<SetStateAction<ParsedRow[]>>
  loadData: (bypassCache?: boolean) => Promise<void>
}

export function createHandleImport(deps: HandleImportDeps): () => Promise<void> {
  const {
    parsedRows,
    subjectId,
    sessionId,
    setIsImporting,
    setImportDialogOpen,
    setImportFile,
    setParsedRows,
    loadData,
  } = deps

  return async () => {
    const validRows = parsedRows.filter((r): r is ValidParsedRow => r.valid)
    if (validRows.length === 0) {
      toast.error('No valid questions to import')
      return
    }

    try {
      setIsImporting(true)

      const result = await bulkImportQuestions({
        questions: validRows.map(({ question, optionA, optionB, optionC, optionD, answer }) => ({
          question,
          optionA,
          optionB,
          optionC,
          optionD,
          answer,
          subjectId,
          sessionId,
        })),
      })

      toast.success(`Successfully imported ${result.success} of ${result.total} questions!`)
      sessionStorage.setItem('questions-uploaded', sessionId)
      setImportDialogOpen(false)
      setImportFile(null)
      setParsedRows([])
      await loadData(true)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to import questions'
      toast.error(msg)
    } finally {
      setIsImporting(false)
    }
  }
}
