import { ArrowLeft } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import type { PendingSubject } from '../model/types'
import type { SubjectRow } from '../model/selectors/getFilteredSubjectRows'
import { EmptyNamesWarning } from './EmptyNamesWarning'
import { ImportActions } from './ImportActions'
import { ImportSummary } from './ImportSummary'
import { SubjectListPreview } from './SubjectListPreview'
import { SubjectSearchInput } from './SubjectSearchInput'

interface ConfirmImportCardProps {
  subjects: PendingSubject[]
  validSubjectsCount: number
  hasEmptyNames: boolean
  searchQuery: string
  onSearchQueryChange: (value: string) => void
  filteredSubjects: SubjectRow[]
  isImporting: boolean
  onNameChange: (index: number, newName: string) => void
  onRemove: (index: number) => void
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmImportCard({
  subjects,
  validSubjectsCount,
  hasEmptyNames,
  searchQuery,
  onSearchQueryChange,
  filteredSubjects,
  isImporting,
  onNameChange,
  onRemove,
  onConfirm,
  onCancel,
}: ConfirmImportCardProps) {
  return (
    <div className="container mx-auto py-8 max-w-4xl pb-20">
      <Button variant="ghost" onClick={onCancel} className="mb-4" disabled={isImporting}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Confirm Subject Import</CardTitle>
          <ImportSummary total={subjects.length} valid={validSubjectsCount} />
        </CardHeader>
        <CardContent>
          <SubjectSearchInput value={searchQuery} onChange={onSearchQueryChange} />

          <SubjectListPreview
            filteredSubjects={filteredSubjects}
            searchQuery={searchQuery}
            isImporting={isImporting}
            onNameChange={onNameChange}
            onRemove={onRemove}
          />

          {hasEmptyNames && <EmptyNamesWarning />}

          <ImportActions
            isImporting={isImporting}
            validSubjectsCount={validSubjectsCount}
            onCancel={onCancel}
            onConfirm={onConfirm}
          />
        </CardContent>
      </Card>
    </div>
  )
}
