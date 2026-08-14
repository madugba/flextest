import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/label'
import type { Dispatch, SetStateAction } from 'react'
import type { CreateCenterRequest } from '@/entities/center'

interface CenterIdentityFieldsProps {
  formData: CreateCenterRequest
  setFormData: Dispatch<SetStateAction<CreateCenterRequest>>
}

export function CenterIdentityFields({ formData, setFormData }: CenterIdentityFieldsProps) {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="centerName">Center Name</Label>
        <Input
          id="centerName"
          placeholder="Enter center name"
          value={formData.centerName}
          onChange={(e) => setFormData({ ...formData, centerName: e.target.value })}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          placeholder="Enter full address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>
    </>
  )
}
