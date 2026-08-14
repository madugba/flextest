import type { ChangeEvent } from 'react'
import { Button } from '@/shared/ui/Button'
import { Label } from '@/shared/ui/label'
import { Input } from '@/shared/ui/Input'
import { Download } from 'lucide-react'

interface ImportFilePickerProps {
  onFileSelect: (event: ChangeEvent<HTMLInputElement>) => Promise<void>
  onDownloadSample: () => void
}

export function ImportFilePicker({ onFileSelect, onDownloadSample }: ImportFilePickerProps) {
  return (
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
  )
}
