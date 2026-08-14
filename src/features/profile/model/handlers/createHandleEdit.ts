import type { Dispatch, SetStateAction } from 'react'
import type { User } from '@/shared/api/authApi'

export function createHandleEdit(
  setIsEditing: Dispatch<SetStateAction<boolean>>,
  setFirstName: Dispatch<SetStateAction<string>>,
  setLastName: Dispatch<SetStateAction<string>>,
  user: User | null
) {
  return () => {
    setIsEditing(true)
    setFirstName(user?.firstName || '')
    setLastName(user?.lastName || '')
  }
}
