import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/label'
import type { Dispatch, SetStateAction } from 'react'
import type { UpdateCandidateRequest } from '@/entities/candidate'

interface ContactInfoFieldsProps {
  formData: UpdateCandidateRequest
  setFormData: Dispatch<SetStateAction<UpdateCandidateRequest>>
  isLoading: boolean
}

export function ContactInfoFields({ formData, setFormData, isLoading }: ContactInfoFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">Contact Information</h3>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="candidate@example.com"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={isLoading}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            placeholder="Enter phone number"
            value={formData.phone || ''}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            disabled={isLoading}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor="isActive" className="text-sm font-normal cursor-pointer">
            Account is active
          </Label>
        </div>
      </div>
    </div>
  )
}
