import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { useUpdateAdminMutation } from '@/entities/admin'
import type { User } from '@/shared/api/authApi'

interface CreateHandleSaveDeps {
  user: User | null
  firstName: string
  lastName: string
  updateUser: (userData: Partial<User>) => void
  updateMutation: ReturnType<typeof useUpdateAdminMutation>
  setIsEditing: Dispatch<SetStateAction<boolean>>
}

export function createHandleSave({
  user,
  firstName,
  lastName,
  updateUser,
  updateMutation,
  setIsEditing,
}: CreateHandleSaveDeps) {
  return async () => {
    if (!user?.id) return

    try {
      const updated = await updateMutation.mutateAsync({
        id: user.id,
        data: { firstName, lastName },
      })

      updateUser(updated as Partial<User>)

      toast.success('Profile updated successfully!', {
        description: 'Your profile information has been updated.',
      })
      setIsEditing(false)
    } catch (err: unknown) {
      toast.error('Failed to update profile', {
        description: err instanceof Error ? err.message : 'An unexpected error occurred',
      })
    }
  }
}
