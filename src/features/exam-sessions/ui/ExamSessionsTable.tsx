import type { ExamSession } from '@/entities/exam-session'
import { ExamSessionsTableHeader } from './ExamSessionsTableHeader'
import { ExamSessionRow } from './ExamSessionRow'

interface ExamSessionsTableProps {
  sessions: ExamSession[]
  loading: boolean
  search: string
  onStart: (sessionId: string) => void
  onUploadQuestions: (sessionId: string) => void
  onReschedule: (session: ExamSession) => void
  onDuplicate: (session: ExamSession) => void
  onEdit: (session: ExamSession) => void
  onDelete: (session: ExamSession) => void
}

export function ExamSessionsTable({
  sessions,
  loading,
  search,
  onStart,
  onUploadQuestions,
  onReschedule,
  onDuplicate,
  onEdit,
  onDelete,
}: ExamSessionsTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <ExamSessionsTableHeader />
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  Loading exam sessions...
                </td>
              </tr>
            ) : sessions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  {search
                    ? 'No exam sessions found matching your search'
                    : 'No exam sessions yet. Create your first session!'}
                </td>
              </tr>
            ) : (
              sessions.map((session) => (
                <ExamSessionRow
                  key={session.id}
                  session={session}
                  onStart={onStart}
                  onUploadQuestions={onUploadQuestions}
                  onReschedule={onReschedule}
                  onDuplicate={onDuplicate}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
