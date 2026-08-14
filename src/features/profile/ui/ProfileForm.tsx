import type { Dispatch, SetStateAction } from 'react'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

interface ProfileFormProps {
  firstName: string
  setFirstName: Dispatch<SetStateAction<string>>
  lastName: string
  setLastName: Dispatch<SetStateAction<string>>
  isLoading: boolean
  onSave: () => void
  onCancel: () => void
}

export function ProfileForm({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  isLoading,
  onSave,
  onCancel,
}: ProfileFormProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          fullWidth
          required
        />
        <Input
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          fullWidth
          required
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <strong>Note:</strong> Email and phone number cannot be changed from this page. Contact
        support if you need to update these fields.
      </div>

      <div className="flex space-x-3 pt-4">
        <Button onClick={onSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button onClick={onCancel} variant="outline" disabled={isLoading}>
          Cancel
        </Button>
      </div>
    </>
  )
}
