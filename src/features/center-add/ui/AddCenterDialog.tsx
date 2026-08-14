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
import { Alert } from '@/shared/ui/Alert'
import { useAddCenter } from '../model/useAddCenter'
import { AddCenterDialogFooter } from './AddCenterDialogFooter'
import { CenterContactFields } from './CenterContactFields'
import { CenterIdentityFields } from './CenterIdentityFields'
import { CenterLocationFields } from './CenterLocationFields'

interface AddCenterDialogProps {
  onSuccess?: () => void
}

export function AddCenterDialog({ onSuccess }: AddCenterDialogProps) {
  const {
    isOpen,
    isLoading,
    error,
    formData,
    setFormData,
    handleOpen,
    handleClose,
    handleSubmit,
  } = useAddCenter(onSuccess)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? handleOpen() : handleClose())}>
      <DialogTrigger asChild>
        <Button>Add New Center</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Center</DialogTitle>
          <DialogDescription>
            Create a new center in the system
          </DialogDescription>
        </DialogHeader>

        {error && <Alert variant="destructive">{error}</Alert>}

        <div className="grid gap-4">
          <CenterIdentityFields formData={formData} setFormData={setFormData} />
          <CenterLocationFields formData={formData} setFormData={setFormData} />
          <CenterContactFields formData={formData} setFormData={setFormData} />
        </div>

        <AddCenterDialogFooter isLoading={isLoading} onClose={handleClose} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}
