import type { ChangeEvent } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { TabsContent } from '@/shared/ui/tabs'
import { ImportSessionSelectors } from './ImportSessionSelectors'
import { SubjectPicker } from './SubjectPicker'
import { labelCls } from './import-form-classes'
import type { CandidateImportState } from '../model/useCandidateImportState'

export function ImportExcelTab({
  state,
  onFileSelect,
  onDownloadSample,
}: {
  state: CandidateImportState
  onFileSelect: (event: ChangeEvent<HTMLInputElement>) => void
  onDownloadSample: () => void
}) {
  const {
    centers, examSessions, selectedCenterId, setSelectedCenterId,
    selectedExamSessionId, setSelectedExamSessionId,
    excelFile, parsedExcelCandidates,
    availableSubjects, selectedSubjects, setSelectedSubjects,
    isLoadingSubjects, subjectSearch, setSubjectSearch,
  } = state

  return (
    <TabsContent value="excel" className="space-y-4 pt-3">
      <ImportSessionSelectors
        className="grid grid-cols-2 gap-3"
        centers={centers}
        examSessions={examSessions}
        selectedCenterId={selectedCenterId}
        setSelectedCenterId={setSelectedCenterId}
        selectedExamSessionId={selectedExamSessionId}
        setSelectedExamSessionId={setSelectedExamSessionId}
      />

      <div>
        <label className={labelCls}>Excel File</label>
        <div className="flex gap-2">
          <input
            aria-label="Select an Excel file"
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={onFileSelect}
            className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-lg file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
          />
          <Button type="button" variant="outline" onClick={onDownloadSample} size="sm">
            <Download className="h-4 w-4 mr-1.5" /> Sample
          </Button>
        </div>
        {excelFile && (
          <p className="mt-1.5 text-xs text-gray-500">
            {excelFile.name}
            {parsedExcelCandidates.length > 0 && (
              <span className="ml-2 text-green-600 font-medium">✓ {parsedExcelCandidates.length} rows parsed</span>
            )}
          </p>
        )}
        <p className="mt-1.5 text-xs text-gray-400">
          Columns: <code className="font-mono">candidateid</code> (opt), <code className="font-mono">lastName</code>, <code className="font-mono">firstName</code>, <code className="font-mono">otherName</code> (opt)
        </p>
      </div>

      <SubjectPicker
        availableSubjects={availableSubjects}
        selectedSubjects={selectedSubjects}
        setSelectedSubjects={setSelectedSubjects}
        isLoadingSubjects={isLoadingSubjects}
        subjectSearch={subjectSearch}
        setSubjectSearch={setSubjectSearch}
      />
    </TabsContent>
  )
}
