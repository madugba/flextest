import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { useBulkImportQuestionsMutation } from '@/entities/question'
import type { ParsedRow, ValidParsedRow } from '../types'

export interface HandleImportDeps {
  parsedRows: ParsedRow[]
  subjectId: string
  sessionId: string
  importMutation: ReturnType<typeof useBulkImportQuestionsMutation>
  setImportDialogOpen: Dispatch<SetStateAction<boolean>>
  setImportFile: Dispatch<SetStateAction<File | null>>
  setParsedRows: Dispatch<SetStateAction<ParsedRow[]>>
}

export function createHandleImport(deps: HandleImportDeps): () => Promise<void> {
  const { parsedRows, subjectId, sessionId, importMutation, setImportDialogOpen, setImportFile, setParsedRows } =
    deps

  return async () => {
    const validRows = parsedRows.filter((r): r is ValidParsedRow => r.valid)
    if (validRows.length === 0) {
      toast.error('No valid questions to import')
      return
    }

    try {
      const result = await importMutation.mutateAsync({
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to import questions'
      toast.error(msg)
    }
  }
}
