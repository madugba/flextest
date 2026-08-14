import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/label'
import type { Dispatch, SetStateAction } from 'react'
import type { UpdateCenterRequest } from '@/entities/center'

interface EditCenterIdentityFieldsProps {
  formData: UpdateCenterRequest
  setFormData: Dispatch<SetStateAction<UpdateCenterRequest>>
}

export function EditCenterIdentityFields({ formData, setFormData }: EditCenterIdentityFieldsProps) {
  return (
    <>
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
    </>
  )
}
