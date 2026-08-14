import { labelCls, selectCls } from './import-form-classes'
import type { SchoolPortalStudent, SubClass } from '../model/types'

export function ImportSubclassFilter({
  subClasses,
  selectedSubclassId,
  onSubclassChange,
  totalStudentCount,
  activeStudents,
}: {
  subClasses: SubClass[]
  selectedSubclassId: string
  onSubclassChange: (id: string) => void
  totalStudentCount: number | null
  activeStudents: SchoolPortalStudent[]
}) {
  return (
    <div className="pt-1 border-t border-gray-100">
      <label className={labelCls}>
        Filter by Subclass
        <span className="text-gray-400 normal-case font-normal ml-1">(optional)</span>
      </label>
      <select
        aria-label="Filter by subclass"
        value={selectedSubclassId}
        onChange={(e) => onSubclassChange(e.target.value)}
        className={selectCls}
      >
        <option value="">
          All subclasses ({totalStudentCount ?? activeStudents.length} students)
        </option>
        {subClasses.map(({ classarmid, classarmname }) => {
          const count = activeStudents.filter(s => s.streamId === classarmid).length
          return (
            <option key={classarmid} value={classarmid}>
              {classarmname} ({count} student{count !== 1 ? 's' : ''})
            </option>
          )
        })}
      </select>
      {totalStudentCount !== null && totalStudentCount > activeStudents.length && (
        <p className="mt-1 text-xs text-amber-600">
          Showing {activeStudents.length} of {totalStudentCount} students (API is paginated — only the first page is loaded)
        </p>
      )}
    </div>
  )
}
