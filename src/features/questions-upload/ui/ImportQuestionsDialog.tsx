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
import { Label } from '@/shared/ui/label'
import { Input } from '@/shared/ui/Input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'
import { Download, Loader2, ShieldCheck, ShieldX } from 'lucide-react'
import type { ParsedRow } from '../model/types'

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
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Label htmlFor="excel-file" className="text-sm font-medium">
                Select Excel file (.xlsx / .xls)
              </Label>
              <Input
                id="excel-file"
                type="file"
                accept=".xlsx,.xls"
                onChange={onFileSelect}
                className="mt-1"
              />
            </div>
            <div className="shrink-0 pt-5">
              <Button onClick={onDownloadSample} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Sample template
              </Button>
            </div>
          </div>

          {parsedRows.length > 0 && (
            <div
              className={`flex items-center gap-3 p-3 rounded-lg border text-sm ${
                invalidCount > 0
                  ? 'bg-amber-50 border-amber-200 text-amber-800'
                  : 'bg-green-50 border-green-200 text-green-800'
              }`}
            >
              {invalidCount > 0 ? (
                <ShieldX className="h-5 w-5 text-amber-500 shrink-0" />
              ) : (
                <ShieldCheck className="h-5 w-5 text-green-600 shrink-0" />
              )}
              <span>
                <strong>{validCount}</strong> valid &nbsp;·&nbsp;
                <strong>{invalidCount}</strong> invalid
                {invalidCount > 0 && ' — only valid questions will be imported'}
              </span>
            </div>
          )}

          {parsedRows.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto max-h-[50vh] overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-muted z-10">
                    <TableRow>
                      <TableHead className="w-10">#</TableHead>
                      <TableHead className="min-w-[200px]">Question</TableHead>
                      <TableHead className="min-w-[110px]">Opt A</TableHead>
                      <TableHead className="min-w-[110px]">Opt B</TableHead>
                      <TableHead className="min-w-[110px]">Opt C</TableHead>
                      <TableHead className="min-w-[110px]">Opt D</TableHead>
                      <TableHead className="w-12">Ans</TableHead>
                      <TableHead className="min-w-[180px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedRows.map((row) => (
                      <TableRow
                        key={row.rowNumber}
                        className={row.valid ? '' : 'bg-red-50 hover:bg-red-100'}
                      >
                        <TableCell className="text-muted-foreground text-xs">
                          {row.rowNumber}
                        </TableCell>
                        <TableCell>
                          <span className="block max-w-[240px] truncate text-xs" title={row.question}>
                            {row.question || (
                              <span className="text-muted-foreground italic">empty</span>
                            )}
                          </span>
                        </TableCell>
                        {(['optionA', 'optionB', 'optionC', 'optionD'] as const).map((field) => (
                          <TableCell key={field}>
                            <span
                              className={`block max-w-[130px] truncate text-xs ${
                                row.valid && row.answer === field.slice(-1).toUpperCase()
                                  ? 'font-semibold text-green-700'
                                  : ''
                              }`}
                              title={row[field]}
                            >
                              {row[field] || (
                                <span className="text-muted-foreground italic">empty</span>
                              )}
                            </span>
                          </TableCell>
                        ))}
                        <TableCell>
                          <span
                            className={`text-xs font-medium ${
                              row.valid ? 'text-green-700' : 'text-red-600'
                            }`}
                          >
                            {row.answer || '—'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {row.valid ? (
                            <span className="inline-flex items-center gap-1 text-xs text-green-700 font-medium">
                              <ShieldCheck className="h-3.5 w-3.5" />
                              Valid
                            </span>
                          ) : (
                            <span className="inline-flex flex-col gap-0.5">
                              {row.errors.map((err, i) => (
                                <span key={i} className="text-xs text-red-600 leading-tight">
                                  · {err}
                                </span>
                              ))}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
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
