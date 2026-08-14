import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/label'
import type { Dispatch, SetStateAction } from 'react'
import type { UpdateCenterRequest } from '@/entities/center'

interface EditCenterLocationFieldsProps {
  formData: UpdateCenterRequest
  setFormData: Dispatch<SetStateAction<UpdateCenterRequest>>
}

export function EditCenterLocationFields({ formData, setFormData }: EditCenterLocationFieldsProps) {
  return (
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
  )
}
