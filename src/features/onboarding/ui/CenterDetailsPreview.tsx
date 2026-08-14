import type { CenterData } from '../model/types'
import { PreviewRow } from './PreviewRow'

interface CenterDetailsPreviewProps {
  centerData: CenterData
}

export function CenterDetailsPreview({ centerData }: CenterDetailsPreviewProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b">
        Center Details
      </h3>
      <div className="space-y-3">
        <PreviewRow label="Center Name" value={centerData.centerName} />
        <PreviewRow label="Email" value={centerData.email} />
        <PreviewRow label="Phone" value={centerData.phone} />
        <PreviewRow
          label="Address"
          value={centerData.address}
          valueClassName="text-sm text-gray-900 text-right max-w-xs"
        />
        <PreviewRow label="State" value={centerData.state} />
        <PreviewRow label="LGA" value={centerData.lga} />
      </div>
    </div>
  )
}
