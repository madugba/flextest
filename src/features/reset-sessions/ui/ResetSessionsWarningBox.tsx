import type { DataCounts } from '../model/types'

interface ResetSessionsWarningBoxProps {
  dataCounts: DataCounts
  includeStudents: boolean
}

export function ResetSessionsWarningBox({
  dataCounts,
  includeStudents,
}: ResetSessionsWarningBoxProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4">
      <p className="text-sm font-medium text-red-900 mb-2">This action will permanently delete:</p>
      {dataCounts.sessions === 0 && dataCounts.candidates === 0 && dataCounts.questions === 0 ? (
        <div className="text-sm text-red-700">
          <p className="mb-2">No data found in the system or backend is unavailable.</p>
          <p className="text-xs text-red-600">
            Note: If you&apos;re expecting data, please ensure the backend service is running.
          </p>
        </div>
      ) : (
        <>
          <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
            <li>{dataCounts.sessions.toLocaleString()} exam sessions</li>
            {includeStudents && <li>{dataCounts.candidates.toLocaleString()} candidates</li>}
            <li>{dataCounts.questions.toLocaleString()} questions</li>
            <li>{dataCounts.answers.toLocaleString()} candidate answers</li>
            <li>{dataCounts.results.toLocaleString()} exam results</li>
          </ul>
          {dataCounts.lastSession && (
            <p className="mt-3 text-xs text-red-600">
              Last session: {dataCounts.lastSession.name} (
              {new Date(dataCounts.lastSession.date).toLocaleDateString()})
            </p>
          )}
        </>
      )}
    </div>
  )
}
