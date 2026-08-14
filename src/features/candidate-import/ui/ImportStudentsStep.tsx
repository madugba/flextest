import { XCircle } from 'lucide-react'
import { ImportSubclassFilter } from './ImportSubclassFilter'
import { StudentApiSelector } from './StudentApiSelector'
import { StudentMappingBlock } from './StudentMappingBlock'
import { StudentReadyNotice } from './StudentReadyNotice'
import { StepCard } from './StepCard'
import type { ImportStudentsStepProps } from '../model/types'
import { getStudentCountBadge } from '../model/selectors/getStudentCountBadge'

export function ImportStudentsStep({
  status,
  studentApiId,
  onStudentApiChange,
  apiConfigurations,
  studentAmbiguous,
  studentMap,
  onStudentMapChange,
  studentApiConfig,
  studentPreviewUrl,
  studentsError,
  subClasses,
  selectedSubclassId,
  onSubclassChange,
  totalStudentCount,
  activeStudents,
  visibleStudents,
}: ImportStudentsStepProps) {
  return (
    <StepCard
      number={2}
      title="Load Students"
      status={status}
      badge={getStudentCountBadge({
        activeStudents,
        selectedSubclassId,
        totalStudentCount,
        visibleStudents,
        subClasses,
      })}
      collapsible
    >
      <StudentApiSelector
        studentApiId={studentApiId}
        onStudentApiChange={onStudentApiChange}
        apiConfigurations={apiConfigurations}
      />

      <StudentMappingBlock
        studentAmbiguous={studentAmbiguous}
        studentMap={studentMap}
        onStudentMapChange={onStudentMapChange}
      />

      {studentApiConfig && studentPreviewUrl && (
        <p className="text-xs text-gray-400 font-mono truncate" title={studentPreviewUrl}>
          ↗ {studentPreviewUrl}
        </p>
      )}

      {studentsError && (
        <p className="text-xs text-red-600 flex items-center gap-1.5">
          <XCircle className="w-3.5 h-3.5 flex-shrink-0" /> {studentsError}
        </p>
      )}

      {subClasses.length > 0 && (
        <ImportSubclassFilter
          subClasses={subClasses}
          selectedSubclassId={selectedSubclassId}
          onSubclassChange={onSubclassChange}
          totalStudentCount={totalStudentCount}
          activeStudents={activeStudents}
        />
      )}

      <StudentReadyNotice
        visibleStudents={visibleStudents}
        totalStudentCount={totalStudentCount}
        activeStudents={activeStudents}
        selectedSubclassId={selectedSubclassId}
      />
    </StepCard>
  )
}
