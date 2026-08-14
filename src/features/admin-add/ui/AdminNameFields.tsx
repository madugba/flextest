import { Input } from '@/shared/ui/Input'
import type { Dispatch, SetStateAction } from 'react'
import type { CreateAdminRequest } from '@/entities/admin'

interface AdminNameFieldsProps {
  formData: CreateAdminRequest
  setFormData: Dispatch<SetStateAction<CreateAdminRequest>>
  isLoading: boolean
}

export function AdminNameFields({ formData, setFormData, isLoading }: AdminNameFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <label htmlFor="firstName" className="text-sm font-medium">
          First Name
        </label>
        <Input
          id="firstName"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          placeholder="John"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="lastName" className="text-sm font-medium">
          Last Name
        </label>
        <Input
          id="lastName"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          placeholder="Doe"
          disabled={isLoading}
        />
      </div>
    </>
  )
}
