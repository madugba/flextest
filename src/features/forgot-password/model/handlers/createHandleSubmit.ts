import type { Dispatch, FormEvent, SetStateAction } from 'react'

export interface HandleSubmitDeps {
  setLoading: Dispatch<SetStateAction<boolean>>
  setError: Dispatch<SetStateAction<string>>
  setSubmitted: Dispatch<SetStateAction<boolean>>
}

export function createHandleSubmit(
  deps: HandleSubmitDeps
): (e: FormEvent) => Promise<void> {
  const { setLoading, setError, setSubmitted } = deps

  return async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }
}
