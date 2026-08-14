import type { User } from '@/shared/api/authApi'
import { Button } from '@/shared/ui/Button'

interface ProfileHeaderProps {
  user: User
  isEditing: boolean
  onEdit: () => void
}

export function ProfileHeader({ user, isEditing, onEdit }: ProfileHeaderProps) {
  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-medium">
              {user.firstName?.[0]}
              {user.lastName?.[0]}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-gray-500">{user.role}</p>
          </div>
        </div>
        {!isEditing && (
          <Button onClick={onEdit} variant="outline">
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  )
}
