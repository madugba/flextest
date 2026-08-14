'use client'

import type { ChangeEvent } from 'react'
import { toast } from 'sonner'
import { downloadSampleExcel, parseExcelFile } from '../lib/excel'
import type { CandidateImportState } from './useCandidateImportState'
import { createImportFromApi } from './handlers/createImportFromApi'
import { createImportFromExcel } from './handlers/createImportFromExcel'
import { createImportFromJson } from './handlers/createImportFromJson'

export function useImportActions(
  state: CandidateImportState,
  onSuccess?: (count: number) => void
) {
  const handleImportFromJson = createImportFromJson(state, onSuccess)
  const handleImportFromApi = createImportFromApi(state, onSuccess)
  const handleImportFromExcel = createImportFromExcel(state, onSuccess)
  const { importTab, setExcelFile, setParsedExcelCandidates } = state

  const handleImport = async () => {
    if (importTab === 'json') await handleImportFromJson()
    else if (importTab === 'api') await handleImportFromApi()
    else await handleImportFromExcel()
  }

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setExcelFile(file)
    try {
      const candidates = await parseExcelFile(file)
      setParsedExcelCandidates(candidates)
      toast.success(`Parsed ${candidates.length} candidates!`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to parse Excel file')
      setExcelFile(null)
      setParsedExcelCandidates([])
    }
  }

  return { handleImport, handleFileSelect, downloadSampleExcel }
}
