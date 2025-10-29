'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/label'
import { Alert } from '@/shared/ui/Alert'
import type { Center } from '@/entities/center'
import { useEditCenter } from '../model/useEditCenter'

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
            <div className="grid gap-2">
              <Label htmlFor="centerName">Center Name</Label>
              <Input
                id="centerName"
                value={formData.centerName || ''}
                onChange={(e) => setFormData({ ...formData, centerName: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state || ''}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lga">LGA</Label>
                <Input
                  id="lga"
                  value={formData.lga || ''}
                  onChange={(e) => setFormData({ ...formData, lga: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
