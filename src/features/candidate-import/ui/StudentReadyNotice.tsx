import { CheckCircle2 } from 'lucide-react'
import type { SchoolPortalStudent } from '../model/types'

interface StudentReadyNoticeProps {
  visibleStudents: SchoolPortalStudent[]
  totalStudentCount: number | null
  activeStudents: SchoolPortalStudent[]
  selectedSubclassId: string
}

export function StudentReadyNotice({
  visibleStudents,
  totalStudentCount,
  activeStudents,
  selectedSubclassId,
}: StudentReadyNoticeProps) {
  if (activeStudents.length === 0) return null

  return (
    <p className="text-xs text-green-700 font-medium flex items-center gap-1.5">
      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
      {visibleStudents.length} student{visibleStudents.length !== 1 ? 's' : ''} ready to import
      {totalStudentCount !== null && totalStudentCount > activeStudents.length && !selectedSubclassId && (
        <span className="text-amber-600 font-normal">
          ({totalStudentCount - activeStudents.length} more on later pages)
        </span>
      )}
    </p>
  )
}
