import { Label } from '@/shared/ui/label'
import type { Dispatch, SetStateAction } from 'react'
import type { CreateCandidateRequest } from '@/entities/candidate'
import type { ExamSession } from '@/entities/exam-session'

interface DialogSessionFieldProps {
  formData: CreateCandidateRequest
  setFormData: Dispatch<SetStateAction<CreateCandidateRequest>>
  sessions: ExamSession[]
}

export function DialogSessionField({ formData, setFormData, sessions }: DialogSessionFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="sessionId">
        Exam Session <span className="text-red-500">*</span>
      </Label>
      <select
        id="sessionId"
        value={formData.sessionId}
        onChange={(e) => setFormData({ ...formData, sessionId: e.target.value })}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        required
      >
        <option value="">Select an exam session...</option>
        {sessions.map((session) => (
          <option key={session.id} value={session.id}>
            {session.name} - {new Date(session.date).toLocaleDateString()} @ {session.time}
          </option>
        ))}
      </select>
    </div>
  )
}
