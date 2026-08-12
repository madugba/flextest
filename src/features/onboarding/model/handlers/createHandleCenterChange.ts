import type { ChangeEvent, Dispatch, SetStateAction } from 'react'
import type { CenterData } from '../types'

export interface HandleCenterChangeDeps {
  setCenterData: Dispatch<SetStateAction<CenterData>>
}

export function createHandleCenterChange(
  deps: HandleCenterChangeDeps
): (e: ChangeEvent<HTMLInputElement>) => void {
  const { setCenterData } = deps

  return (e) => {
    setCenterData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }
}
