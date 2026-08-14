'use client'

import type { ChangeEvent, Dispatch, SetStateAction } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/Button'
import { Loader2 } from 'lucide-react'
import type { ParsedRow } from '../model/types'
import { ImportFilePicker } from './ImportFilePicker'
import { ImportValidationBanner } from './ImportValidationBanner'
import { ImportQuestionsTable } from './ImportQuestionsTable'

interface ImportQuestionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isImporting: boolean
  parsedRows: ParsedRow[]
  setParsedRows: Dispatch<SetStateAction<ParsedRow[]>>
  setImportFile: Dispatch<SetStateAction<File | null>>
  onFileSelect: (event: ChangeEvent<HTMLInputElement>) => Promise<void>
  onDownloadSample: () => void
  onImport: () => Promise<void>
}

export function ImportQuestionsDialog({
  open,
  onOpenChange,
  isImporting,
  parsedRows,
  setParsedRows,
  setImportFile,
  onFileSelect,
  onDownloadSample,
  onImport,
}: ImportQuestionsDialogProps) {
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && !isImporting) {
      setImportFile(null)
      setParsedRows([])
    }
    onOpenChange(nextOpen)
  }

  const validCount = parsedRows.filter((r) => r.valid).length
  const invalidCount = parsedRows.length - validCount

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-h-[92vh] flex flex-col transition-all duration-200"
        style={
          parsedRows.length > 0 ? { width: '100vw', maxWidth: '100vw', borderRadius: 0 } : undefined
        }
      >
        <DialogHeader>
          <DialogTitle>Import Questions from Excel</DialogTitle>
          <DialogDescription>
            Select a file to preview all questions — valid and invalid — before importing.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-1">
          <ImportFilePicker onFileSelect={onFileSelect} onDownloadSample={onDownloadSample} />

          {parsedRows.length > 0 && (
            <ImportValidationBanner validCount={validCount} invalidCount={invalidCount} />
          )}

          {parsedRows.length > 0 && <ImportQuestionsTable parsedRows={parsedRows} />}
        </div>

        <DialogFooter className="pt-2 border-t mt-2 shrink-0">
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isImporting}>
            Cancel
          </Button>
          {parsedRows.length > 0 && (
            <Button onClick={onImport} disabled={validCount === 0 || isImporting}>
              {isImporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Importing…
                </>
              ) : (
                `Import ${validCount} Valid Question${validCount !== 1 ? 's' : ''}`
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
