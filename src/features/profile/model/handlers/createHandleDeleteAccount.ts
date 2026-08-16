import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { useDeleteAdminMutation } from '@/entities/admin'
import type { User } from '@/shared/api/authApi'

interface RouterLike {
  push: (href: string) => void
}

interface CreateHandleDeleteAccountDeps {
  user: User | null
  router: RouterLike
  logout: () => void | Promise<void>
  deleteMutation: ReturnType<typeof useDeleteAdminMutation>
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>
}

export function createHandleDeleteAccount({
  user,
  router,
  logout,
  deleteMutation,
  setShowDeleteDialog,
}: CreateHandleDeleteAccountDeps) {
  return async () => {
    if (!user?.id) return

    try {
      await deleteMutation.mutateAsync(user.id)

      toast.success('Account deleted successfully', {
        description: 'Your account has been permanently deleted.',
      })

      setTimeout(() => {
        void logout()
        router.push('/login')
      }, 1000)
    } catch (err: unknown) {
      toast.error('Failed to delete account', {
        description: err instanceof Error ? err.message : 'An unexpected error occurred',
      })
      setShowDeleteDialog(false)
    }
  }
}
