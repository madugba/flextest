import type { Dispatch, SetStateAction } from 'react'
import { Label } from '@/shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import type { CreateCandidateRequest } from '@/entities/candidate'
import type { ExamSession } from '@/entities/exam-session'

interface ExamSessionSectionProps {
  formData: CreateCandidateRequest
  setFormData: Dispatch<SetStateAction<CreateCandidateRequest>>
  sessions: ExamSession[]
  isLoading: boolean
}

export function ExamSessionSection({
  formData,
  setFormData,
  sessions,
  isLoading,
}: ExamSessionSectionProps) {
  return (
    <div className="grid gap-3">
      <div>
        <Label htmlFor="session" className="text-base font-semibold">
          Exam Session <span className="text-red-500">*</span>
        </Label>
        <p className="text-sm text-muted-foreground mt-1">
          Select the exam session for this candidate
        </p>
      </div>
      <Select
        value={formData.sessionId}
        onValueChange={(value) => setFormData({ ...formData, sessionId: value })}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full h-12 text-base">
          <SelectValue placeholder="Select exam session" />
        </SelectTrigger>
        <SelectContent className="w-full">
          {sessions.map((session) => (
            <SelectItem key={session.id} value={session.id} className="py-3">
              <div className="flex flex-col">
                <span className="font-medium">{session.name}</span>
                {session.date && (
                  <span className="text-xs text-muted-foreground">
                    {new Date(session.date).toLocaleDateString()}
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
