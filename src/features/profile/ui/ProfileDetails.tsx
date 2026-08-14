import type { User } from '@/shared/api/authApi'

interface ProfileDetailsProps {
  user: User
}

export function ProfileDetails({ user }: ProfileDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-gray-500">First Name</label>
          <p className="mt-1 text-sm text-gray-900">{user.firstName}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Last Name</label>
          <p className="mt-1 text-sm text-gray-900">{user.lastName}</p>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-500">Email</label>
        <p className="mt-1 text-sm text-gray-900">{user.email}</p>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-500">Phone</label>
        <p className="mt-1 text-sm text-gray-900">{user.phone || 'Not provided'}</p>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-500">Role</label>
        <p className="mt-1 text-sm text-gray-900">{user.role}</p>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-500">Account Status</label>
        <p className="mt-1">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {user.isActive ? 'Active' : 'Inactive'}
          </span>
        </p>
      </div>
    </div>
  )
}
