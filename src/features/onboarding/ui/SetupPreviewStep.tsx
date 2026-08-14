import type { AdminData, CenterData } from '../model/types'
import { AdminInfoPreview } from './AdminInfoPreview'
import { CenterDetailsPreview } from './CenterDetailsPreview'

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
        <CenterDetailsPreview centerData={centerData} />
        <AdminInfoPreview adminData={adminData} />
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}
