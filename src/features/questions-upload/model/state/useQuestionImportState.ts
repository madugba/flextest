import { useState } from 'react'
import type { ParsedRow } from '../types'

export function useQuestionImportState() {
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [, setImportFile] = useState<File | null>(null)
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([])
  const [isImporting, setIsImporting] = useState(false)

  return {
    importDialogOpen,
    setImportDialogOpen,
    setImportFile,
    parsedRows,
    setParsedRows,
    isImporting,
    setIsImporting,
  }
}
