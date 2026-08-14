import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { updateAdmin } from '@/entities/admin'
import type { User } from '@/shared/api/authApi'

interface CreateHandleSaveDeps {
  user: User | null
  firstName: string
  lastName: string
  updateUser: (userData: Partial<User>) => void
  setIsLoading: Dispatch<SetStateAction<boolean>>
  setIsEditing: Dispatch<SetStateAction<boolean>>
}

export function createHandleSave({
  user,
  firstName,
  lastName,
  updateUser,
  setIsLoading,
  setIsEditing,
}: CreateHandleSaveDeps) {
  return async () => {
    if (!user?.id) return

    try {
      setIsLoading(true)

      const updated = await updateAdmin(user.id, { firstName, lastName })

      updateUser(updated as Partial<User>)

      toast.success('Profile updated successfully!', {
        description: 'Your profile information has been updated.',
      })
      setIsEditing(false)
    } catch (err: unknown) {
      toast.error('Failed to update profile', {
        description: err instanceof Error ? err.message : 'An unexpected error occurred',
      })
    } finally {
      setIsLoading(false)
    }
  }
}
