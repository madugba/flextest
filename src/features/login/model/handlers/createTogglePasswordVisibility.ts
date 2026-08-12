import type { Dispatch, SetStateAction } from 'react'

export interface TogglePasswordVisibilityDeps {
  showPassword: boolean
  setShowPassword: Dispatch<SetStateAction<boolean>>
}

export function createTogglePasswordVisibility(deps: TogglePasswordVisibilityDeps): () => void {
  const { showPassword, setShowPassword } = deps

  return () => {
    setShowPassword(!showPassword)
  }
}
