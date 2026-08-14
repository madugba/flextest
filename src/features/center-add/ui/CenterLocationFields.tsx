import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/label'
import type { Dispatch, SetStateAction } from 'react'
import type { CreateCenterRequest } from '@/entities/center'

interface CenterLocationFieldsProps {
  formData: CreateCenterRequest
  setFormData: Dispatch<SetStateAction<CreateCenterRequest>>
}

export function CenterLocationFields({ formData, setFormData }: CenterLocationFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="grid gap-2">
        <Label htmlFor="state">State</Label>
        <Input
          id="state"
          placeholder="Enter state"
          value={formData.state}
          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="lga">LGA</Label>
        <Input
          id="lga"
          placeholder="Enter LGA"
          value={formData.lga}
          onChange={(e) => setFormData({ ...formData, lga: e.target.value })}
        />
      </div>
    </div>
  )
}
