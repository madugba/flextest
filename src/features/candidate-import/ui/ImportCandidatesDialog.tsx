'use client'

import { Alert } from '@/shared/ui/Alert'
import { Button } from '@/shared/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { ImportApiTab } from './ImportApiTab'
import { ImportDialogFooter } from './ImportDialogFooter'
import { ImportExcelTab } from './ImportExcelTab'
import { ImportJsonTab } from './ImportJsonTab'
import type { ImportCandidatesDialogProps } from '../model/types'
import { useCandidateImportState } from '../model/useCandidateImportState'
import { useImportActions } from '../model/useImportActions'

export function ImportCandidatesDialog({ onSuccess }: ImportCandidatesDialogProps) {
  const state = useCandidateImportState()
  const { handleImport, handleFileSelect, downloadSampleExcel } = useImportActions(state, onSuccess)
  const { isOpen, handleOpen, handleClose, error, importTab, setImportTab, isLoading } = state

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? handleOpen() : handleClose())}>
      <DialogTrigger asChild>
        <Button variant="outline">Import Candidates</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl flex flex-col max-h-[90vh] p-0 gap-0">
        <div className="px-6 pt-6 pb-4 flex-shrink-0">
          <DialogHeader>
            <DialogTitle>Import Candidates</DialogTitle>
            <DialogDescription>Choose your import method below</DialogDescription>
          </DialogHeader>
        </div>

        {error && <div className="px-6 pb-2 flex-shrink-0"><Alert variant="destructive">{error}</Alert></div>}

        <Tabs value={importTab} onValueChange={setImportTab} className="flex flex-col flex-1 min-h-0">
          <div className="px-6 pb-3 flex-shrink-0">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="json">JSON</TabsTrigger>
              <TabsTrigger value="api">From API</TabsTrigger>
              <TabsTrigger value="excel">From Excel</TabsTrigger>
            </TabsList>
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-2">
            <ImportJsonTab jsonData={state.jsonData} onChange={state.setJsonData} />
            <ImportApiTab state={state} />
            <ImportExcelTab state={state} onFileSelect={handleFileSelect} onDownloadSample={downloadSampleExcel} />
          </div>
        </Tabs>

        <ImportDialogFooter isLoading={isLoading} onCancel={handleClose} onImport={handleImport} importTab={importTab} />
      </DialogContent>
    </Dialog>
  )
}
