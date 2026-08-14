import type { Center } from '@/entities/center'
import type { ExamSession } from '@/entities/exam-session'
import { labelCls, selectCls } from './import-form-classes'

export function ImportSessionSelectors({
  className,
  centers,
  examSessions,
  selectedCenterId,
  setSelectedCenterId,
  selectedExamSessionId,
  setSelectedExamSessionId,
}: {
  className: string
  centers: Center[]
  examSessions: ExamSession[]
  selectedCenterId: string
  setSelectedCenterId: (value: string) => void
  selectedExamSessionId: string
  setSelectedExamSessionId: (value: string) => void
}) {
  return (
    <div className={className}>
      <div>
        <label className={labelCls}>Center</label>
        <select
          aria-label="Select a center"
          value={selectedCenterId}
          onChange={(e) => setSelectedCenterId(e.target.value)}
          className={selectCls}
        >
          <option value="">Select…</option>
          {centers.map(c => <option key={c.id} value={c.id}>{c.centerName}</option>)}
        </select>
      </div>
      <div>
        <label className={labelCls}>Exam Session</label>
        <select
          aria-label="Select an exam session"
          value={selectedExamSessionId}
          onChange={(e) => setSelectedExamSessionId(e.target.value)}
          className={selectCls}
        >
          <option value="">Select…</option>
          {examSessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
    </div>
  )
}
