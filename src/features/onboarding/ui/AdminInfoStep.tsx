import type { ChangeEvent } from 'react'
import type { AdminData } from '../model/types'
import { StepTextField } from './StepTextField'

interface AdminInfoStepProps {
  adminData: AdminData
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export function AdminInfoStep({ adminData, onChange }: AdminInfoStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Configure Admin Information
      </h2>
      <p className="text-gray-600 mb-6">
        Create your administrator account
      </p>

      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <StepTextField
            name="firstName"
            label="First Name *"
            value={adminData.firstName}
            placeholder="First name"
            onChange={onChange}
          />
          <StepTextField
            name="lastName"
            label="Last Name *"
            value={adminData.lastName}
            placeholder="Last name"
            onChange={onChange}
          />
        </div>

        <StepTextField
          name="email"
          label="Email Address *"
          type="email"
          value={adminData.email}
          placeholder="admin@example.com"
          onChange={onChange}
        />

        <StepTextField
          name="password"
          label="Password *"
          type="password"
          value={adminData.password}
          placeholder="Minimum 8 characters"
          minLength={8}
          footer={
            <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>
          }
          onChange={onChange}
        />

        <StepTextField
          name="confirmPassword"
          label="Confirm Password *"
          type="password"
          value={adminData.confirmPassword}
          placeholder="Confirm your password"
          footer={
            adminData.confirmPassword &&
            adminData.password !== adminData.confirmPassword && (
              <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
            )
          }
          onChange={onChange}
        />
      </div>
    </div>
  )
}
