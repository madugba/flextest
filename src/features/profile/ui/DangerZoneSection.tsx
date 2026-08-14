import { Button } from '@/shared/ui/Button'

interface DangerZoneSectionProps {
  onDelete: () => void
}

export function DangerZoneSection({ onDelete }: DangerZoneSectionProps) {
  return (
    <div className="bg-white rounded-lg border border-red-200 shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h3>
        <p className="text-sm text-gray-600 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Button onClick={onDelete} variant="destructive">
          Delete Account
        </Button>
      </div>
    </div>
  )
}
