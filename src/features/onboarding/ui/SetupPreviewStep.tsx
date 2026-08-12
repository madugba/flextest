import type { AdminData, CenterData } from '../model/types'

interface SetupPreviewStepProps {
  centerData: CenterData
  adminData: AdminData
  error: string
}

export function SetupPreviewStep({ centerData, adminData, error }: SetupPreviewStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Review Your Information
      </h2>
      <p className="text-gray-600 mb-6">
        Please verify all details before submission
      </p>

      <div className="space-y-6">
        {/* Center Details Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b">
            Center Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">
                Center Name
              </span>
              <span className="text-sm text-gray-900">
                {centerData.centerName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">
                Email
              </span>
              <span className="text-sm text-gray-900">
                {centerData.email}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">
                Phone
              </span>
              <span className="text-sm text-gray-900">
                {centerData.phone}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">
                Address
              </span>
              <span className="text-sm text-gray-900 text-right max-w-xs">
                {centerData.address}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">
                State
              </span>
              <span className="text-sm text-gray-900">
                {centerData.state}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">
                LGA
              </span>
              <span className="text-sm text-gray-900">
                {centerData.lga}
              </span>
            </div>
          </div>
        </div>

        {/* Admin Information Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b">
            Administrator Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">
                Name
              </span>
              <span className="text-sm text-gray-900">
                {adminData.firstName} {adminData.lastName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">
                Email
              </span>
              <span className="text-sm text-gray-900">
                {adminData.email}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">
                Password
              </span>
              <span className="text-sm text-gray-900">••••••••</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}
