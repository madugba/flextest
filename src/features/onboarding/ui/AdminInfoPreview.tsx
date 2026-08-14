import type { AdminData } from '../model/types'
import { PreviewRow } from './PreviewRow'

interface AdminInfoPreviewProps {
  adminData: AdminData
}

export function AdminInfoPreview({ adminData }: AdminInfoPreviewProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b">
        Administrator Information
      </h3>
      <div className="space-y-3">
        <PreviewRow label="Name" value={`${adminData.firstName} ${adminData.lastName}`} />
        <PreviewRow label="Email" value={adminData.email} />
        <PreviewRow label="Password" value="••••••••" />
      </div>
    </div>
  )
}
