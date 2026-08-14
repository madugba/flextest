import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/label'
import type { Dispatch, SetStateAction } from 'react'
import type { CreateCandidateRequest } from '@/entities/candidate'

interface DialogPictureFieldProps {
  formData: CreateCandidateRequest
  setFormData: Dispatch<SetStateAction<CreateCandidateRequest>>
}

export function DialogPictureField({ formData, setFormData }: DialogPictureFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="picture">Picture URL (Optional)</Label>
      <Input
        id="picture"
        placeholder="https://example.com/photo.jpg"
        value={formData.picture || ''}
        onChange={(e) => setFormData({ ...formData, picture: e.target.value })}
      />
    </div>
  )
}
