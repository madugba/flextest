'use client'

import { useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/Button'
import { Label } from '@/shared/ui/label'
import { Alert } from '@/shared/ui/Alert'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useApiConfigurations } from '../model/useApiConfigurations'
import { useCohortLookup } from '../model/useCohortLookup'
import { useModuleCatalog } from '../model/useModuleCatalog'
import { useModuleMapping } from '../model/useModuleMapping'
import { useScorePush } from '../model/useScorePush'
import { useSessionScores } from '../model/useSessionScores'
import { buildScorePayloads, extractDistinctSubjects } from '../lib/scorePush'
import { PushProgressView } from './PushProgressView'
import { PushSummaryView } from './PushSummaryView'
import { ModuleMappingStep } from './ModuleMappingStep'

interface UploadResultsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sessionId: string | null
}

const selectCls = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white disabled:opacity-60 disabled:cursor-not-allowed'
const labelCls = 'text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block'

export function UploadResultsDialog({ open, onOpenChange, sessionId }: UploadResultsDialogProps) {
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
    onOpenChange(false)
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

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : handleClose())}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload Results</DialogTitle>
          <DialogDescription>Push this session&apos;s scores to an external system</DialogDescription>
        </DialogHeader>

        {scoresError && <Alert variant="destructive">{scoresError}</Alert>}

        {isLoadingScores ? (
          <div className="flex items-center gap-2 py-6 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading session scores…
          </div>
        ) : scorePush.status === 'pushing' ? (
          <PushProgressView progress={scorePush.progress} />
        ) : scorePush.status === 'done' ? (
          <PushSummaryView results={scorePush.results} />
        ) : (
          <div className="space-y-5 py-2">
            {/* Step 1: cohort */}
            <div className="space-y-1.5">
              <Label>Step 1 — Select API to fetch cohorts/terms</Label>
              <select
                aria-label="Select API for cohorts"
                value={cohortLookup.cohortApiId}
                onChange={(e) => cohortLookup.selectCohortApi(e.target.value)}
                className={selectCls}
              >
                <option value="">Select an API configuration…</option>
                {configurations.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {cohortLookup.isLoading && (
                <div className="flex items-center gap-2 text-xs text-gray-500 pt-1">
                  <Loader2 className="h-3 w-3 animate-spin" /> Loading cohorts/terms…
                </div>
              )}
              {cohortLookup.error && <p className="text-xs text-red-600">{cohortLookup.error}</p>}
            </div>

            {/* Step 2: select cohort */}
            {cohortLookup.cohorts.length > 0 && (
              <div className="space-y-1.5">
                <label className={labelCls}>Cohort / Term</label>
                <select
                  aria-label="Select a cohort or term"
                  value={cohortLookup.selectedCohortId}
                  onChange={(e) => cohortLookup.setSelectedCohortId(e.target.value)}
                  className={selectCls}
                >
                  {cohortLookup.cohorts.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Step 3: push API */}
            {cohortLookup.selectedCohort && (
              <div className="space-y-1.5">
                <Label>Step 2 — Select API to push scores</Label>
                <select
                  aria-label="Select API to push scores"
                  value={scorePush.pushApiId}
                  onChange={(e) => scorePush.setPushApiId(e.target.value)}
                  className={selectCls}
                >
                  <option value="">Select an API configuration…</option>
                  {configurations.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Step 3: map subjects to modules */}
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

            {/* Review */}
            {readyToReview && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
                <span className="font-medium">{scores?.sessionName}</span> · {cohortLookup.selectedCohort?.name} ·{' '}
                {candidateCount} candidate{candidateCount !== 1 ? 's' : ''} × {subjectCount} subject{subjectCount !== 1 ? 's' : ''} ={' '}
                <span className="font-semibold text-primary">{scoreItems.length}</span> score{scoreItems.length !== 1 ? 's' : ''} to push
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {scorePush.status === 'done' ? (
            <>
              {scorePush.progress.failed > 0 && (
                <Button variant="outline" onClick={handleRetryFailed}>
                  Retry Failed ({scorePush.progress.failed})
                </Button>
              )}
              <Button onClick={handleDone}>Done</Button>
            </>
          ) : scorePush.status === 'pushing' ? (
            <Button variant="outline" disabled>Pushing…</Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button onClick={handleConfirmPush} disabled={!readyToReview}>
                Confirm &amp; Push
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
