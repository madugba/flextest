import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { deleteAdmin } from '@/entities/admin'
import type { User } from '@/shared/api/authApi'

interface RouterLike {
  push: (href: string) => void
}

interface CreateHandleDeleteAccountDeps {
  user: User | null
  router: RouterLike
  logout: () => void | Promise<void>
  setIsLoading: Dispatch<SetStateAction<boolean>>
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>
}

export function createHandleDeleteAccount({
  user,
  router,
  logout,
  setIsLoading,
  setShowDeleteDialog,
}: CreateHandleDeleteAccountDeps) {
  return async () => {
    if (!user?.id) return

    try {
      setIsLoading(true)

      await deleteAdmin(user.id)

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
    } finally {
      setIsLoading(false)
    }
  }
}
