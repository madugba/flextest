'use client'

import { Button } from '@/shared/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Alert } from '@/shared/ui/Alert'
import { useAddAdmin } from '../model/useAddAdmin'
import { AdminCredentialFields } from './AdminCredentialFields'
import { AdminNameFields } from './AdminNameFields'

interface AddAdminDialogProps {
  onSuccess?: () => void
}

export function AddAdminDialog({ onSuccess }: AddAdminDialogProps) {
  const {
    isOpen,
    isLoading,
    error,
    formData,
    setFormData,
    handleOpen,
    handleClose,
    handleSubmit,
  } = useAddAdmin(onSuccess)

  return (
    <>
      <Button onClick={handleOpen}>Add New Admin</Button>

      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Admin</DialogTitle>
            <DialogDescription>
              Create a new administrator account. They will receive an email with login
              instructions.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive" className="mb-2">
              {error}
            </Alert>
          )}

          <div className="space-y-4 py-4">
            <AdminNameFields formData={formData} setFormData={setFormData} isLoading={isLoading} />
            <AdminCredentialFields formData={formData} setFormData={setFormData} isLoading={isLoading} />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Admin'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
