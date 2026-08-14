import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { getStatusColor } from '../model/selectors/getStatusColor'
import type { DisplayCandidate } from '../model/selectors/formatCandidateForDisplay'
import { AlertCircle, Eye, LogOut, Monitor } from 'lucide-react'

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
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    title="Select all candidates"
                    checked={isAllSelected}
                    onChange={onSelectAll}
                    ref={(el) => {
                      if (el) {
                        el.indeterminate = isIndeterminate
                      }
                    }}
                  />
                  <span title="Select all candidates">Registration #</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client Info
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
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
              filteredCandidates.map((candidate) => {
                const progressPercentage = candidate.totalQuestions > 0
                  ? (candidate.attempted / candidate.totalQuestions) * 100
                  : 0

                return (
                  <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          title={`Select candidate ${candidate.name} - ${candidate.registrationNumber}`}
                          id={candidate.id}
                          checked={selectedCandidates.has(candidate.id)}
                          onChange={() => onSelectCandidate(candidate.id)}
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {candidate.registrationNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-medium">
                            {candidate.initials}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 truncate">{candidate.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-600 truncate">{candidate.clientInfo}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">
                            {candidate.attempted}/{candidate.totalQuestions}
                          </span>
                          <span className="text-gray-900 font-medium">
                            {progressPercentage.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Badge
                        className={`${getStatusColor(candidate.status)} border capitalize`}
                      >
                        {candidate.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onViewCandidate(candidate.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <AlertCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => onLogoutCandidate(candidate.id, candidate.name)}
                          disabled={candidate.status === 'absent' || candidate.status === 'submitted'}
                        >
                          <LogOut className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
