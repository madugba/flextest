import { CheckCircle2 } from 'lucide-react'

interface UploadProgressCardProps {
  uploadedCount: number
  requiredQuestions: number
  remainingCount: number
  progressPercentage: number
}

export function UploadProgressCard({
  uploadedCount,
  requiredQuestions,
  remainingCount,
  progressPercentage,
}: UploadProgressCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Uploaded</p>
          <p className="text-3xl font-bold text-blue-600">{uploadedCount}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Required</p>
          <p className="text-3xl font-bold text-gray-900">{requiredQuestions}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Remaining</p>
          <p className={`text-3xl font-bold ${remainingCount === 0 ? 'text-green-600' : 'text-orange-600'}`}>
            {remainingCount}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Progress</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-gray-900">{progressPercentage.toFixed(0)}%</p>
            {progressPercentage === 100 && <CheckCircle2 className="h-7 w-7 text-green-600" />}
          </div>
        </div>
      </div>

      <div className="relative w-full bg-gray-100 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 transition-all duration-500 ${progressPercentage === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  )
}
