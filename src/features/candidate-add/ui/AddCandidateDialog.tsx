'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/Button'
import { Alert } from '@/shared/ui/Alert'
import { useAddCandidateForm } from '../model/useAddCandidateForm'
import { DialogPersonalInfoFields } from './DialogPersonalInfoFields'
import { DialogSessionField } from './DialogSessionField'
import { DialogPictureField } from './DialogPictureField'
import { DialogSubjectsField } from './DialogSubjectsField'

interface AddCandidateDialogProps {
  onSuccess?: () => void
}

export function AddCandidateDialog({ onSuccess }: AddCandidateDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const {
    isLoading,
    error,
    formData,
    sessions,
    subjects,
    selectedSubjects,
    setFormData,
    toggleSubject,
    handleSubmit,
  } = useAddCandidateForm(() => {
    setIsOpen(false)
    onSuccess?.()
  })

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleOpen = () => {
    setIsOpen(true)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? handleOpen() : handleClose())}>
      <DialogTrigger asChild>
        <Button>Add Candidate</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Candidate</DialogTitle>
          <DialogDescription>
            Create a new candidate and assign subjects
          </DialogDescription>
        </DialogHeader>

        {error && <Alert variant="destructive">{error}</Alert>}

        <div className="grid gap-4">
          <DialogPersonalInfoFields formData={formData} setFormData={setFormData} />
          <DialogSessionField formData={formData} setFormData={setFormData} sessions={sessions} />
          <DialogPictureField formData={formData} setFormData={setFormData} />
          <DialogSubjectsField
            subjects={subjects}
            selectedSubjects={selectedSubjects}
            toggleSubject={toggleSubject}
          />
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Candidate'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
