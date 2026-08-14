import type { SubjectRow } from '../model/selectors/getFilteredSubjectRows'
import { PendingSubjectRow } from './PendingSubjectRow'

interface SubjectListPreviewProps {
  filteredSubjects: SubjectRow[]
  searchQuery: string
  isImporting: boolean
  onNameChange: (index: number, newName: string) => void
  onRemove: (index: number) => void
}

export function SubjectListPreview({
  filteredSubjects,
  searchQuery,
  isImporting,
  onNameChange,
  onRemove,
}: SubjectListPreviewProps) {
  return (
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
  )
}
