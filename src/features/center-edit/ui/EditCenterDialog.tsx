'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { Alert } from '@/shared/ui/Alert'
import type { Center } from '@/entities/center'
import { useEditCenter } from '../model/useEditCenter'
import { EditCenterContactFields } from './EditCenterContactFields'
import { EditCenterDialogFooter } from './EditCenterDialogFooter'
import { EditCenterIdentityFields } from './EditCenterIdentityFields'
import { EditCenterLocationFields } from './EditCenterLocationFields'

interface EditCenterDialogProps {
  onSuccess?: () => void
  children: (props: { onEdit: (center: Center) => void }) => React.ReactNode
}

export function EditCenterDialog({ onSuccess, children }: EditCenterDialogProps) {
  const {
    isOpen,
    isLoading,
    error,
    formData,
    setFormData,
    handleOpen,
    handleClose,
    handleSubmit,
  } = useEditCenter(onSuccess)

  return (
    <>
      {children({ onEdit: handleOpen })}
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Center</DialogTitle>
            <DialogDescription>Update center information</DialogDescription>
          </DialogHeader>

          {error && <Alert variant="destructive">{error}</Alert>}

          <div className="grid gap-4">
            <EditCenterIdentityFields formData={formData} setFormData={setFormData} />
            <EditCenterLocationFields formData={formData} setFormData={setFormData} />
            <EditCenterContactFields formData={formData} setFormData={setFormData} />
          </div>

          <EditCenterDialogFooter isLoading={isLoading} onClose={handleClose} onSubmit={handleSubmit} />
        </DialogContent>
      </Dialog>
    </>
  )
}
