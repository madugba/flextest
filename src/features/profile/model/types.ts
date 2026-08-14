import type { Dispatch, SetStateAction } from 'react'
import type { User } from '@/shared/api/authApi'

export interface ProfilePageController {
  user: User | null
  isEditing: boolean
  isLoading: boolean
  showDeleteDialog: boolean
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>
  firstName: string
  setFirstName: Dispatch<SetStateAction<string>>
  lastName: string
  setLastName: Dispatch<SetStateAction<string>>
  handleEdit: () => void
  handleCancel: () => void
  handleSave: () => void
  handleDeleteAccount: () => void
}
