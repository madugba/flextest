'use client'

import * as XLSX from 'xlsx'
import { useSessionScoresTable } from '../model/useSessionScoresTable'
import { Skeleton } from '@/shared/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { Input } from '@/shared/ui/Input'
import { FileText, RefreshCw, Search, Download, FileSpreadsheet, ChevronDown } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import type { SessionScores } from '@/entities/exam-session'

interface SessionScoresTableProps {
  sessionId: string
  onPrint?: () => void
}

// ---------------------------------------------------------------------------
// Excel export
// ---------------------------------------------------------------------------
function exportToExcel(scores: SessionScores, sessionName: string) {
  // Collect all unique subjects in encounter order
  const allSubjects = new Map<string, string>()
  scores.candidates.forEach((c) =>
    c.subjects.forEach((s) => {
      if (!allSubjects.has(s.subjectId)) allSubjects.set(s.subjectId, s.subjectName)
    })
  )
  const subjectEntries = Array.from(allSubjects.entries()) // [id, name]

  // Header row
  const headers = [
    'Candidate',
    ...subjectEntries.map(([, name]) => name),
    'Total Score',
  ]

  // Data rows
  const rows = scores.candidates.map((candidate) => {
    const scoreMap = new Map(candidate.subjects.map((s) => [s.subjectId, s]))

    const subjectScores = subjectEntries.map(([id]) => {
      const s = scoreMap.get(id)
      return s ? parseFloat(s.score.toFixed(2)) : 0
    })

    return [
      candidate.candidateName,
      ...subjectScores,
      parseFloat(candidate.totalScore.toFixed(2)),
    ]
  })

  const wsData = [headers, ...rows]
  const ws = XLSX.utils.aoa_to_sheet(wsData)

  // Column widths
  ws['!cols'] = headers.map((h, i) => ({
    wch: Math.min(
      Math.max(h.length, ...rows.map((r) => String(r[i]).length)) + 2,
      32
    ),
  }))

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Scores')
  XLSX.writeFile(wb, `${sessionName.replace(/\s+/g, '_')}_Scores.xlsx`)
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function SessionScoresTable({ sessionId, onPrint }: SessionScoresTableProps) {
  const { scores, loading, error, refetch, search, setSearch, filteredCandidates } =
    useSessionScoresTable(sessionId)

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-12 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Button variant="outline" onClick={refetch}>
          Retry
        </Button>
      </div>
    )
  }

  if (!scores || scores.candidates.length === 0) {
    return (
      <div className="p-12 text-center">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg font-medium mb-2">No scores found</p>
        <p className="text-gray-400 text-sm">
          No candidate scores available for this session
        </p>
      </div>
    )
  }

  // Unique subjects across all candidates
  const allSubjects = new Map<string, string>()
  scores.candidates.forEach((candidate) => {
    candidate.subjects.forEach((subject) => {
      if (!allSubjects.has(subject.subjectId)) {
        allSubjects.set(subject.subjectId, subject.subjectName)
      }
    })
  })
  const subjectArray = Array.from(allSubjects.entries())

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search candidates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <p className="text-sm text-gray-600 whitespace-nowrap">
            {filteredCandidates.length} of {scores.candidates.length} candidate
            {scores.candidates.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Export dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onPrint?.()}>
                <FileText className="mr-2 h-4 w-4" />
                PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportToExcel(scores, scores.sessionName)}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" onClick={refetch} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 bg-white z-10">Candidate</TableHead>
              {subjectArray.map(([subjectId, subjectName]) => (
                <TableHead key={subjectId} className="text-center min-w-[120px]">
                  {subjectName}
                </TableHead>
              ))}
              <TableHead className="text-right font-semibold">Total Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCandidates.map((candidate) => {
              const subjectScoreMap = new Map(
                candidate.subjects.map((s) => [s.subjectId, s])
              )

              return (
                <TableRow key={candidate.candidateId}>
                  <TableCell className="font-medium sticky left-0 bg-white z-10 align-middle">
                    {candidate.candidateName}
                  </TableCell>
                  {subjectArray.map(([subjectId]) => {
                    const subjectScore = subjectScoreMap.get(subjectId)
                    return (
                      <TableCell key={subjectId} className="text-center align-middle py-3">
                        {subjectScore ? (
                          <div className="space-y-1">
                            <div className="text-xs text-gray-600">
                              Attempted:{' '}
                              <span className="font-medium">
                                {subjectScore.correctAnswers + subjectScore.wrongAnswers}/
                                {subjectScore.totalQuestions}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600">
                              Correct:{' '}
                              <span className="font-medium text-green-600">
                                {subjectScore.correctAnswers}
                              </span>
                            </div>
                            <div className="text-sm font-semibold text-blue-600">
                              Score: {subjectScore.score.toFixed(2)}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                    )
                  })}
                  <TableCell className="text-right font-bold align-middle">
                    {candidate.totalScore.toFixed(2)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Score configuration info */}
      {scores.candidates.length > 0 && scores.candidates[0].subjects.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-900 mb-2">Score Configuration</p>
          <div className="text-sm text-blue-800 space-y-1">
            <p>
              <strong>Name:</strong> {scores.candidates[0].subjects[0].scoreConfig.name}
            </p>
            <p>
              <strong>Type:</strong> {scores.candidates[0].subjects[0].scoreConfig.scoringType}
            </p>
            <p>
              <strong>Formula:</strong>{' '}
              <code className="bg-white px-2 py-1 rounded text-xs">
                {scores.candidates[0].subjects[0].scoreConfig.formula}
              </code>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
