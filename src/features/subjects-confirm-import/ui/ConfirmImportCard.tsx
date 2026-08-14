import { ArrowLeft, Loader2, Search } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Input } from '@/shared/ui/Input'
import type { PendingSubject } from '../model/types'
import type { SubjectRow } from '../model/selectors/getFilteredSubjectRows'
import { PendingSubjectRow } from './PendingSubjectRow'

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
          <p className="text-sm text-muted-foreground">
            Review and edit subject names before importing ({subjects.length} total,{' '}
            {validSubjectsCount} valid)
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search subjects..."
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2 max-h-[50vh] overflow-y-auto mb-4">
            {filteredSubjects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No subjects found matching &quot;{searchQuery}&quot;
              </div>
            ) : (
              filteredSubjects.map(({ subject, originalIndex }) => (
                <PendingSubjectRow
                  key={originalIndex}
                  index={originalIndex}
                  subject={subject}
                  isImporting={isImporting}
                  onNameChange={onNameChange}
                  onRemove={onRemove}
                />
              ))
            )}
          </div>

          {hasEmptyNames && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                ⚠️ Some subjects have empty names and will be skipped during import
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={onCancel} disabled={isImporting}>
              Cancel
            </Button>
            <Button onClick={onConfirm} disabled={isImporting || validSubjectsCount === 0}>
              {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Import ({validSubjectsCount})
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
