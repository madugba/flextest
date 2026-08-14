import { useMemo } from 'react'
import { toast } from 'sonner'
import { useApiConfigurations } from './useApiConfigurations'
import { useCohortLookup } from './useCohortLookup'
import { useModuleCatalog } from './useModuleCatalog'
import { useModuleMapping } from './useModuleMapping'
import { useScorePush } from './useScorePush'
import { useSessionScores } from './useSessionScores'
import { buildScorePayloads, extractDistinctSubjects } from '../lib/scorePush'

export function useUploadResultsWizard(open: boolean, sessionId: string | null, onClose: () => void) {
  const { scores, isLoading: isLoadingScores, error: scoresError } = useSessionScores(sessionId, open)
  const { configurations } = useApiConfigurations(open)
  const cohortLookup = useCohortLookup(configurations)
  const scorePush = useScorePush()

  const pushApiConfig = configurations.find((c) => c.id === scorePush.pushApiId) ?? null

  const subjects = useMemo(() => (scores ? extractDistinctSubjects(scores) : []), [scores])
  const moduleCatalog = useModuleCatalog(pushApiConfig, !!pushApiConfig)
  const moduleMapping = useModuleMapping(subjects)

  const scoreItems = useMemo(
    () => (scores && cohortLookup.selectedCohort
      ? buildScorePayloads(scores, cohortLookup.selectedCohort, moduleMapping.mapping)
      : []),
    [scores, cohortLookup.selectedCohort, moduleMapping.mapping]
  )

  const candidateCount = useMemo(
    () => new Set(scoreItems.map((i) => i.payload.userCode)).size,
    [scoreItems]
  )
  const subjectCount = useMemo(
    () => new Set(scoreItems.map((i) => i.payload.moduleId)).size,
    [scoreItems]
  )

  const readyToReview = !!(
    cohortLookup.selectedCohort && pushApiConfig && moduleMapping.isComplete && scoreItems.length > 0
  )

  const handleClose = () => {
    onClose()
    cohortLookup.reset()
    scorePush.reset()
  }

  const handleConfirmPush = () => {
    if (!pushApiConfig) return
    scorePush.runBatch(scoreItems, pushApiConfig)
  }

  const handleRetryFailed = () => {
    if (!pushApiConfig) return
    scorePush.retryFailed(pushApiConfig)
  }

  const handleDone = () => {
    const { succeeded, failed } = scorePush.progress
    if (failed > 0) {
      toast.warning('Upload completed with errors', { description: `Success: ${succeeded}, Failed: ${failed}` })
    } else {
      toast.success('Upload complete', { description: `Successfully pushed ${succeeded} score(s)` })
    }
    handleClose()
  }

  return {
    scores,
    isLoadingScores,
    scoresError,
    configurations,
    cohortLookup,
    scorePush,
    pushApiConfig,
    subjects,
    moduleCatalog,
    moduleMapping,
    scoreItems,
    candidateCount,
    subjectCount,
    readyToReview,
    handleClose,
    handleConfirmPush,
    handleRetryFailed,
    handleDone,
  }
}

export type UploadResultsWizard = ReturnType<typeof useUploadResultsWizard>
