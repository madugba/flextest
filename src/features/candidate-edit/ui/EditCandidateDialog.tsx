'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Alert } from '@/shared/ui/Alert'
import { useEditCandidate } from '../model/useEditCandidate'
import { CandidateInfoHeader } from './CandidateInfoHeader'
import { ContactInfoFields } from './ContactInfoFields'
import { DialogActions } from './DialogActions'
import { RegistrationDetails } from './RegistrationDetails'
import { SubjectSelection } from './SubjectSelection'

interface EditCandidateDialogProps {
  children: (props: { onEdit: (id: string) => void }) => React.ReactNode
  onSuccess?: () => void
}

export function EditCandidateDialog({ children, onSuccess }: EditCandidateDialogProps) {
  const {
    isOpen,
    isLoading,
    isFetching,
    error,
    candidate,
    formData,
    setFormData,
    subjects,
    selectedSubjects,
    toggleSubject,
    handleOpen,
    handleClose,
    handleSubmit,
  } = useEditCandidate(onSuccess)

  return (
    <>
      {children({ onEdit: handleOpen })}
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Candidate</DialogTitle>
            <DialogDescription>
              Update candidate contact information and account status
            </DialogDescription>
          </DialogHeader>

          {error && <Alert variant="destructive" className="mt-4">{error}</Alert>}

          {isFetching && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {candidate && !isFetching && (
            <div className="space-y-6 mt-4">
              <CandidateInfoHeader candidate={candidate} />
              <RegistrationDetails candidate={candidate} />
              <ContactInfoFields formData={formData} setFormData={setFormData} isLoading={isLoading} />
              <SubjectSelection
                subjects={subjects}
                selectedSubjects={selectedSubjects}
                toggleSubject={toggleSubject}
                isLoading={isLoading}
              />
            </div>
          )}

          <DialogActions
            isLoading={isLoading}
            isFetching={isFetching}
            onClose={handleClose}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
