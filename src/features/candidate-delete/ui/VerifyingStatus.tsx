import { Spinner } from '@/shared/ui/Spinner'

export function VerifyingStatus() {
  return (
    <div className="flex items-center gap-3 py-4 text-sm text-muted-foreground">
      <Spinner className="h-4 w-4" />
      Checking session status…
    </div>
  )
}
