import type { Dispatch, SetStateAction } from 'react'

export function createHandleCancel(setIsEditing: Dispatch<SetStateAction<boolean>>) {
  return () => {
    setIsEditing(false)
  }
}
