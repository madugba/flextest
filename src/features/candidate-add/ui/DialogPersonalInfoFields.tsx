import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/label'
import type { Dispatch, SetStateAction } from 'react'
import type { CreateCandidateRequest } from '@/entities/candidate'

interface DialogPersonalInfoFieldsProps {
  formData: CreateCandidateRequest
  setFormData: Dispatch<SetStateAction<CreateCandidateRequest>>
}

export function DialogPersonalInfoFields({ formData, setFormData }: DialogPersonalInfoFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="surname">
            Surname <span className="text-red-500">*</span>
          </Label>
          <Input
            id="surname"
            placeholder="Enter surname"
            value={formData.surname}
            onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="firstname">
            First Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstname"
            placeholder="Enter first name"
            value={formData.firstname}
            onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="othername">Other Name (Optional)</Label>
        <Input
          id="othername"
          placeholder="Enter other name"
          value={formData.othername || ''}
          onChange={(e) => setFormData({ ...formData, othername: e.target.value })}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email (Optional)</Label>
        <Input
          id="email"
          type="email"
          placeholder="candidate@example.com"
          value={formData.email || ''}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phone">Phone (Optional)</Label>
        <Input
          id="phone"
          placeholder="Enter phone number"
          value={formData.phone || ''}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>
    </>
  )
}
