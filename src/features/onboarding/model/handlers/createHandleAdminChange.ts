import type { ChangeEvent, Dispatch, SetStateAction } from 'react'
import type { AdminData } from '../types'

export interface HandleAdminChangeDeps {
  setAdminData: Dispatch<SetStateAction<AdminData>>
}

export function createHandleAdminChange(
  deps: HandleAdminChangeDeps
): (e: ChangeEvent<HTMLInputElement>) => void {
  const { setAdminData } = deps

  return (e) => {
    setAdminData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }
}
