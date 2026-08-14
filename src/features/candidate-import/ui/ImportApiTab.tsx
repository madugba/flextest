import { TabsContent } from '@/shared/ui/tabs'
import { ImportClassesStep } from './ImportClassesStep'
import { ImportSessionSelectors } from './ImportSessionSelectors'
import { ImportStudentsStep } from './ImportStudentsStep'
import { ImportSubjectsStep } from './ImportSubjectsStep'
import { SubjectPicker } from './SubjectPicker'
import type { CandidateImportState } from '../model/useCandidateImportState'

export function ImportApiTab({ state }: { state: CandidateImportState }) {
  const {
    centers, examSessions, selectedCenterId, setSelectedCenterId,
    selectedExamSessionId, setSelectedExamSessionId,
    classApiId, handleClassApiChange, apiConfigurations, classApiConfig,
    classesError, classes, selectedClassId, handleClassChange, classStepStatus,
    studentStepStatus, activeStudents, selectedSubclassId, visibleStudents,
    totalStudentCount, subClasses, studentApiId, handleStudentApiChange,
    studentAmbiguous, studentMap, handleStudentMapChange, studentApiConfig,
    studentPreviewUrl, studentsError, setSelectedSubclassId,
    subjectStepStatus, selectedSubjects, availableSubjects, setSelectedSubjects,
    isLoadingSubjects, subjectSearch, setSubjectSearch,
  } = state

  return (
    <TabsContent value="api" className="pt-3 space-y-3">
      {/* Session setup — always visible, above step cards */}
      <ImportSessionSelectors
        className="grid grid-cols-2 gap-3 pb-1"
        centers={centers}
        examSessions={examSessions}
        selectedCenterId={selectedCenterId}
        setSelectedCenterId={setSelectedCenterId}
        selectedExamSessionId={selectedExamSessionId}
        setSelectedExamSessionId={setSelectedExamSessionId}
      />

      {/* ── Step 1: Load Classes ── */}
      <ImportClassesStep
        status={classStepStatus}
        classApiId={classApiId}
        onClassApiChange={handleClassApiChange}
        apiConfigurations={apiConfigurations}
        classApiConfig={classApiConfig}
        classesError={classesError}
        classes={classes}
        selectedClassId={selectedClassId}
        onClassChange={handleClassChange}
      />

      {/* ── Step 2: Load Students ── */}
      <ImportStudentsStep
        status={studentStepStatus}
        studentApiId={studentApiId}
        onStudentApiChange={handleStudentApiChange}
        apiConfigurations={apiConfigurations}
        studentAmbiguous={studentAmbiguous}
        studentMap={studentMap}
        onStudentMapChange={handleStudentMapChange}
        studentApiConfig={studentApiConfig}
        studentPreviewUrl={studentPreviewUrl}
        studentsError={studentsError}
        subClasses={subClasses}
        selectedSubclassId={selectedSubclassId}
        onSubclassChange={setSelectedSubclassId}
        totalStudentCount={totalStudentCount}
        activeStudents={activeStudents}
        visibleStudents={visibleStudents}
      />

      {/* ── Step 3: Select Subjects ── */}
      <ImportSubjectsStep status={subjectStepStatus} selectedCount={selectedSubjects.length}>
        <SubjectPicker
          availableSubjects={availableSubjects}
          selectedSubjects={selectedSubjects}
          setSelectedSubjects={setSelectedSubjects}
          isLoadingSubjects={isLoadingSubjects}
          subjectSearch={subjectSearch}
          setSubjectSearch={setSubjectSearch}
        />
      </ImportSubjectsStep>
    </TabsContent>
  )
}
