import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { getAllCenters, type Center } from '@/entities/center'

export function createLoadCenters(setCenters: Dispatch<SetStateAction<Center[]>>) {
  return async () => {
    try {
      const data = await getAllCenters()
      setCenters(data)
    } catch {
      toast.error('Failed to load centers')
    }
  }
}
