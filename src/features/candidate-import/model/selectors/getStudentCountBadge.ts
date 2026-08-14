import type { SchoolPortalStudent, SubClass } from '../types'

export function getStudentCountBadge({
  activeStudents,
  selectedSubclassId,
  totalStudentCount,
  visibleStudents,
  subClasses,
}: {
  activeStudents: SchoolPortalStudent[]
  selectedSubclassId: string
  totalStudentCount: number | null
  visibleStudents: SchoolPortalStudent[]
  subClasses: SubClass[]
}): string | undefined {
  if (activeStudents.length === 0) return undefined

  if (!selectedSubclassId) {
    const count = totalStudentCount ?? activeStudents.length
    return `${count} student${count !== 1 ? 's' : ''}`
  }

  const className =
    subClasses.find((s) => s.classarmid === selectedSubclassId)?.classarmname ?? 'filtered'
  return `${visibleStudents.length} of ${totalStudentCount ?? activeStudents.length} students (${className})`
}
