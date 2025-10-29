'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/Button'
import { Label } from '@/shared/ui/label'
import { Alert } from '@/shared/ui/Alert'
import { useImportCandidates } from '../model/useImportCandidates'

interface ImportCandidatesDialogProps {
  onSuccess?: (count: number) => void
}

export function ImportCandidatesDialog({ onSuccess }: ImportCandidatesDialogProps) {
  const {
    isOpen,
    isLoading,
    error,
    jsonData,
    setJsonData,
    handleOpen,
    handleClose,
    handleSubmit,
  } = useImportCandidates(onSuccess)

  const exampleJson = `[
  {
    "email": "john.doe@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+234 800 123 4567"
  },
  {
    "email": "jane.smith@example.com",
    "password": "password123",
    "firstName": "Jane",
    "lastName": "Smith"
  }
]`

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? handleOpen() : handleClose())}>
      <DialogTrigger asChild>
        <Button variant="outline">Import Candidates</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Import Candidates (Demo)</DialogTitle>
          <DialogDescription>
            Paste JSON array of candidates to import them in bulk
          </DialogDescription>
        </DialogHeader>

        {error && <Alert variant="destructive">{error}</Alert>}

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="jsonData">JSON Data</Label>
            <textarea
              id="jsonData"
              className="min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
              placeholder={exampleJson}
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
            />
          </div>

          <div className="rounded-md bg-muted p-4 text-sm">
            <p className="font-semibold mb-2">Required fields:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>email (string, valid email)</li>
              <li>password (string, min 8 characters)</li>
              <li>firstName (string)</li>
              <li>lastName (string)</li>
            </ul>
            <p className="font-semibold mt-3 mb-2">Optional fields:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>phone (string)</li>
              <li>profileUrl (string, valid URL)</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !jsonData.trim()}>
            {isLoading ? 'Importing...' : 'Import Candidates'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
