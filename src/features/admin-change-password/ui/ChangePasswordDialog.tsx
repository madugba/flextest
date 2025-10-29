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
import { Input } from '@/shared/ui/Input'
import { Alert } from '@/shared/ui/Alert'
import { getAdminFullName, MIN_PASSWORD_LENGTH, type Admin } from '@/entities/admin'
import { useChangePassword } from '../model/useChangePassword'

interface ChangePasswordDialogProps {
  onSuccess?: () => void
  children: (props: { onChangePassword: (admin: Admin) => void }) => React.ReactNode
}

export function ChangePasswordDialog({ onSuccess, children }: ChangePasswordDialogProps) {
  const {
    isOpen,
    isLoading,
    error,
    selectedAdmin,
    formData,
    setFormData,
    handleOpen,
    handleClose,
    handleSubmit,
  } = useChangePassword(onSuccess)

  return (
    <>
      {children({ onChangePassword: handleOpen })}

      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Change password for {selectedAdmin && getAdminFullName(selectedAdmin)}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive" className="mb-2">
              {error}
            </Alert>
          )}

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="currentPassword" className="text-sm font-medium">
                Current Password
              </label>
              <Input
                id="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData({ ...formData, currentPassword: e.target.value })
                }
                placeholder="Enter current password"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-sm font-medium">
                New Password
              </label>
              <Input
                id="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                placeholder={`Minimum ${MIN_PASSWORD_LENGTH} characters`}
                disabled={isLoading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Changing...' : 'Change Password'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
