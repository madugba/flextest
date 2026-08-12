import type { CenterData } from '../model/types'

interface CenterReviewCardProps {
  centerData: CenterData
}

export function CenterReviewCard({ centerData }: CenterReviewCardProps) {
  return (
    <div className="space-y-4 mb-8">
      <div className="border-b pb-4">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Center Name</h3>
        <p className="text-lg text-gray-900">{centerData.centerName}</p>
      </div>

      <div className="border-b pb-4">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Email Address</h3>
        <p className="text-lg text-gray-900">{centerData.email}</p>
      </div>

      <div className="border-b pb-4">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Phone Number</h3>
        <p className="text-lg text-gray-900">{centerData.phone}</p>
      </div>

      <div className="border-b pb-4">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Address</h3>
        <p className="text-lg text-gray-900">{centerData.address}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="border-b pb-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">State</h3>
          <p className="text-lg text-gray-900">{centerData.state}</p>
        </div>

        <div className="border-b pb-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">LGA</h3>
          <p className="text-lg text-gray-900">{centerData.lga}</p>
        </div>
      </div>
    </div>
  )
}
