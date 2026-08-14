import { getCenters } from '@/shared/api/centerApi'

interface RedirectRouter {
  replace: (href: string) => void
  push: (href: string) => void
}

export function createCheckAndRedirect(router: RedirectRouter): () => Promise<void> {
  return async () => {
    try {
      const centers = await getCenters()

      if (centers.length === 0) {
        router.replace('/onboarding')
        return
      }

      router.replace('/login')
    } catch (error) {
      console.error(error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      router.push(`/error?message=${encodeURIComponent(errorMessage)}`)
    }
  }
}
