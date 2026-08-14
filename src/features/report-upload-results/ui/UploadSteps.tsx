import { Label } from '@/shared/ui/label'
import type { UploadResultsWizard } from '../model/useUploadResultsWizard'
import { ModuleMappingStep } from './ModuleMappingStep'
import { CohortApiStep } from './CohortApiStep'
import { PushApiStep } from './PushApiStep'
import { ReviewBanner } from './ReviewBanner'

interface UploadStepsProps {
  wizard: UploadResultsWizard
}

export function UploadSteps({ wizard }: UploadStepsProps) {
  const {
    configurations,
    cohortLookup,
    scorePush,
    pushApiConfig,
    subjects,
    moduleCatalog,
    moduleMapping,
    scores,
    readyToReview,
    candidateCount,
    subjectCount,
    scoreItems,
  } = wizard

  return (
    <div className="space-y-5 py-2">
      <CohortApiStep
        configurations={configurations}
        cohortApiId={cohortLookup.cohortApiId}
        onCohortApiChange={cohortLookup.selectCohortApi}
        cohorts={cohortLookup.cohorts}
        selectedCohortId={cohortLookup.selectedCohortId}
        onSelectedCohortIdChange={cohortLookup.setSelectedCohortId}
        isLoading={cohortLookup.isLoading}
        error={cohortLookup.error}
      />

      {cohortLookup.selectedCohort && (
        <PushApiStep
          configurations={configurations}
          pushApiId={scorePush.pushApiId}
          onPushApiIdChange={scorePush.setPushApiId}
        />
      )}

      {pushApiConfig && subjects.length > 0 && (
        <div className="space-y-1.5">
          <Label>Step 3 — Map subjects to modules</Label>
          <ModuleMappingStep
            subjects={subjects}
            classes={moduleCatalog.classes}
            isLoadingClasses={moduleCatalog.isLoadingClasses}
            classesError={moduleCatalog.classesError}
            modules={moduleCatalog.modules}
            isLoadingModules={moduleCatalog.isLoadingModules}
            modulesError={moduleCatalog.modulesError}
            selectedClassId={moduleCatalog.selectedClassId}
            onSelectedClassIdChange={moduleCatalog.setSelectedClassId}
            mapping={moduleMapping.mapping}
            onSubjectModuleChange={moduleMapping.setSubjectModule}
          />
        </div>
      )}

      {readyToReview && (
        <ReviewBanner
          sessionName={scores?.sessionName}
          cohortName={cohortLookup.selectedCohort?.name}
          candidateCount={candidateCount}
          subjectCount={subjectCount}
          scoreItemCount={scoreItems.length}
        />
      )}
    </div>
  )
}
