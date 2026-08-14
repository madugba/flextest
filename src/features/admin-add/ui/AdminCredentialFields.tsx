import { Input } from '@/shared/ui/Input'
import { MIN_PASSWORD_LENGTH } from '@/entities/admin'
import type { Dispatch, SetStateAction } from 'react'
import type { CreateAdminRequest } from '@/entities/admin'

interface AdminCredentialFieldsProps {
  formData: CreateAdminRequest
  setFormData: Dispatch<SetStateAction<CreateAdminRequest>>
  isLoading: boolean
}

export function AdminCredentialFields({ formData, setFormData, isLoading }: AdminCredentialFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="john@example.com"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder={`Minimum ${MIN_PASSWORD_LENGTH} characters`}
          disabled={isLoading}
        />
      </div>
    </>
  )
}
