import { Card } from '@/shared/ui/Card'
import type { DisplayCandidate } from '../model/selectors/formatCandidateForDisplay'
import { CandidatesTableHeader } from './CandidatesTableHeader'
import { CandidateTableRow } from './CandidateTableRow'

interface CandidatesTableProps {
  candidates: DisplayCandidate[]
  filteredCandidates: DisplayCandidate[]
  selectedCandidates: Set<string>
  isAllSelected: boolean
  isIndeterminate: boolean
  onSelectAll: () => void
  onSelectCandidate: (candidateId: string) => void
  onViewCandidate: (candidateId: string) => void
  onLogoutCandidate: (candidateId: string, candidateName: string) => void
}

export function CandidatesTable({
  candidates,
  filteredCandidates,
  selectedCandidates,
  isAllSelected,
  isIndeterminate,
  onSelectAll,
  onSelectCandidate,
  onViewCandidate,
  onLogoutCandidate,
}: CandidatesTableProps) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          <colgroup>
            <col className="w-[180px]" />
            <col className="w-[220px]" />
            <col className="w-[200px]" />
            <col className="w-[180px]" />
            <col className="w-[120px]" />
            <col className="w-[140px]" />
          </colgroup>
          <CandidatesTableHeader
            isAllSelected={isAllSelected}
            isIndeterminate={isIndeterminate}
            onSelectAll={onSelectAll}
          />
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCandidates.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  {candidates.length === 0
                    ? 'No candidates registered for this session'
                    : 'No candidates match your search criteria'}
                </td>
              </tr>
            ) : (
              filteredCandidates.map((candidate) => (
                <CandidateTableRow
                  key={candidate.id}
                  candidate={candidate}
                  selectedCandidates={selectedCandidates}
                  onSelectCandidate={onSelectCandidate}
                  onViewCandidate={onViewCandidate}
                  onLogoutCandidate={onLogoutCandidate}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
