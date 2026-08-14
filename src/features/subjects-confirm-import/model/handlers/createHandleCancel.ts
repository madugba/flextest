import { clearPendingImport } from '../storage'

interface RedirectRouter {
  push: (href: string) => void
}

interface CreateHandleCancelDeps {
  router: RedirectRouter
}

export function createHandleCancel(deps: CreateHandleCancelDeps) {
  const { router } = deps

  return () => {
    clearPendingImport()
    router.push('/dashboard/subjects')
  }
}
