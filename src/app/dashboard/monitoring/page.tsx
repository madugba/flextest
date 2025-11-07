'use client'

import React, { useState, memo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { DashboardHeader } from '@/widgets/dashboard/ui/DashboardHeader'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Badge } from '@/shared/ui/Badge'
import { Card } from '@/shared/ui/Card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog'
import {
  Monitor,
  Users,
  Laptop,
  Eye,
  UserX,
  Clock,
  Activity,
  AlertTriangle,
  CheckCircle,
  Search,
  RefreshCw,
  LogOut,
  UserMinus,
  Calendar,
  FileText,
  Play,
  Pause,
  AlertCircle,
  Wifi,
  WifiOff,
  Loader2,
} from 'lucide-react'
import { useMonitoringData } from '@/features/monitoring/model/useMonitoringData'
import { useLogoutCandidate } from '@/features/monitoring/model/useLogoutCandidate'
import { useBulkLogoutCandidates } from '@/features/monitoring/model/useBulkLogoutCandidates'
import { useMetricsSocket } from '@/shared/hooks/useMetricsSocket'
import { toast } from 'sonner'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  borderColor?: string
  iconBgColor?: string
  iconColor?: string
}

const StatCard = memo<StatCardProps>(({ title, value, icon, borderColor, iconBgColor, iconColor }) => {
  return (
    <Card className={`p-4 hover:shadow-md transition-shadow ${borderColor || ''}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-10 h-10 ${iconBgColor || 'bg-gray-100'} rounded-lg flex items-center justify-center`}>
          <div className={iconColor || 'text-gray-600'}>
            {icon}
          </div>
        </div>
      </div>
    </Card>
  )
})

StatCard.displayName = 'StatCard'

/**
 * Format candidate data for display
 */
function formatCandidateForDisplay(
  candidate: import('@/entities/monitoring').MonitoringCandidate
) {
  // Use actual registration number (candidate ID)
  const registrationNumber = candidate.id

  // Full name
  const name = `${candidate.firstName} ${candidate.lastName}`

  // Initials
  const initials = `${candidate.firstName[0]}${candidate.lastName[0]}`

  // Map candidate status to display status
  const statusMap: Record<string, string> = {
    'PENDING': 'absent',
    'ACTIVE': 'active',
    'ACTIVATE': 'active',
    'SUBMITTED': 'submitted',
  }
  const displayStatus = statusMap[candidate.status] || 'absent'

  return {
    id: candidate.id,
    registrationNumber,
    name,
    initials,
    clientInfo: candidate.clientInfo,
    attempted: candidate.attempted || 0, // Use actual value or 0
    totalQuestions: candidate.totalQuestions || 0, // Use actual value from exam:started event
    status: displayStatus,
    lastActivity: candidate.lastLoginAt ? new Date(candidate.lastLoginAt) : null,
  }
}

function MonitoringContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session')

  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isAutoRefresh, setIsAutoRefresh] = useState(true)
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set())

  // Confirmation modal states
  const [showStartConfirm, setShowStartConfirm] = useState(false)
  const [showPauseConfirm, setShowPauseConfirm] = useState(false)
  const [showResumeConfirm, setShowResumeConfirm] = useState(false)
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [selectedCandidateForLogout, setSelectedCandidateForLogout] = useState<{
    id: string
    name: string
  } | null>(null)
  const [showBulkLogoutConfirm, setShowBulkLogoutConfirm] = useState(false)

  // Fetch monitoring data with session ID from URL
  const {
    selectedSession,
    stats,
    remainingTime,
    candidates,
    isLoading,
    error,
    controlSession,
    isControlling,
    controlError,
  } = useMonitoringData(sessionId || undefined)

  const formatSeconds = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return [hours, minutes, seconds].map((v) => String(v).padStart(2, '0')).join(':')
  }

  // Subscribe to real-time metrics and connected clients via WebSocket
  const { connectedClients, isSubscribed } = useMetricsSocket()

  // Logout candidate mutation
  const logoutMutation = useLogoutCandidate(sessionId || undefined)

  // Bulk logout mutation
  const bulkLogoutMutation = useBulkLogoutCandidates(sessionId || undefined)

  // Filter and search candidates
  const filteredCandidates = candidates.filter((rawCandidate) => {
    const candidate = formatCandidateForDisplay(rawCandidate)

    // Filter by status
    if (filterStatus !== 'all' && candidate.status !== filterStatus) {
      return false
    }

    // Search by name or registration number
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const nameMatch = candidate.name.toLowerCase().includes(query)
      const regMatch = candidate.registrationNumber.toLowerCase().includes(query)
      if (!nameMatch && !regMatch) {
        return false
      }
    }

    return true
  })

  // Handle session control actions - show confirmation modals
  const handleStartExam = () => {
    if (!selectedSession) return
    setShowStartConfirm(true)
  }

  const handlePauseExam = () => {
    if (!selectedSession) return
    setShowPauseConfirm(true)
  }

  const handleResumeExam = () => {
    if (!selectedSession) return
    setShowResumeConfirm(true)
  }

  const handleEndExam = () => {
    if (!selectedSession) return
    setShowEndConfirm(true)
  }

  // Actual control actions after confirmation
  const confirmStartExam = () => {
    controlSession({ action: 'start' })
    setShowStartConfirm(false)
  }

  const confirmPauseExam = () => {
    controlSession({ action: 'pause' })
    setShowPauseConfirm(false)
  }

  const confirmResumeExam = () => {
    controlSession({ action: 'resume' })
    setShowResumeConfirm(false)
  }

  const confirmEndExam = () => {
    controlSession({ action: 'end' })
    setShowEndConfirm(false)
  }

  // Handle candidate logout
  const handleLogoutCandidate = (candidateId: string, candidateName: string) => {
    setSelectedCandidateForLogout({ id: candidateId, name: candidateName })
    setShowLogoutConfirm(true)
  }

  const confirmLogoutCandidate = () => {
    if (!selectedCandidateForLogout) return

    logoutMutation.mutate(
      {
        candidateId: selectedCandidateForLogout.id,
        reason: 'Forced logout by administrator',
      },
      {
        onSuccess: () => {
          setShowLogoutConfirm(false)
          setSelectedCandidateForLogout(null)
        },
      }
    )
  }

  // Handle bulk logout confirmation
  const confirmBulkLogout = () => {
    const candidateIds = Array.from(selectedCandidates)

    bulkLogoutMutation.mutate(
      {
        candidateIds,
        reason: 'Bulk logout by administrator',
      },
      {
        onSuccess: () => {
          setShowBulkLogoutConfirm(false)
          setSelectedCandidates(new Set()) // Clear selection after bulk logout
        },
      }
    )
  }

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectedCandidates.size === filteredCandidates.length && filteredCandidates.length > 0) {
      // If all are selected, deselect all
      setSelectedCandidates(new Set())
    } else {
      // Select all visible candidates
      const allIds = new Set(filteredCandidates.map(c => c.id))
      setSelectedCandidates(allIds)
    }
  }

  // Handle individual checkbox selection
  const handleSelectCandidate = (candidateId: string) => {
    const newSelected = new Set(selectedCandidates)
    if (newSelected.has(candidateId)) {
      newSelected.delete(candidateId)
    } else {
      newSelected.add(candidateId)
    }
    setSelectedCandidates(newSelected)
  }

  // Check if all visible candidates are selected
  const isAllSelected = filteredCandidates.length > 0 &&
    filteredCandidates.every(c => selectedCandidates.has(c.id))

  // Check if some but not all are selected (indeterminate state)
  const isIndeterminate = selectedCandidates.size > 0 && !isAllSelected

  // Determine which control buttons to show based on session status
  const canStart = selectedSession?.status === 'SCHEDULED'
  const canPause = selectedSession?.status === 'ACTIVE'
  const canResume = selectedSession?.status === 'SCHEDULED' && stats.active > 0
  const canEnd = selectedSession?.status === 'ACTIVE'

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'submitted':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'flagged':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'absent':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="flex-1 overflow-auto">
      <DashboardHeader />

      <div className="p-6 space-y-6">
        {/* Exam Session Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Exam Monitoring</h1>

          <div className="flex items-center gap-3">
            <Button
              variant={isAutoRefresh ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsAutoRefresh(!isAutoRefresh)}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isAutoRefresh ? 'animate-spin' : ''}`} />
              {isAutoRefresh ? 'Auto Refresh On' : 'Auto Refresh Off'}
            </Button>

            {/* Start Exam Button - Show when session is SCHEDULED */}
            {canStart && (
              <Button
                size="sm"
                variant="default"
                className="gap-2"
                onClick={handleStartExam}
                disabled={isControlling}
              >
                <Play className="h-4 w-4" />
                {isControlling ? 'Starting...' : 'Start Exam'}
              </Button>
            )}

            {/* Resume Exam Button - Show when session is paused but has active candidates */}
            {canResume && (
              <Button
                size="sm"
                variant="default"
                className="gap-2"
                onClick={handleResumeExam}
                disabled={isControlling}
              >
                <Play className="h-4 w-4" />
                {isControlling ? 'Resuming...' : 'Resume Exam'}
              </Button>
            )}

            {/* Pause Exam Button - Show when session is ACTIVE */}
            {canPause && (
              <Button
                size="sm"
                variant="outline"
                className="gap-2"
                onClick={handlePauseExam}
                disabled={isControlling}
              >
                <Pause className="h-4 w-4" />
                {isControlling ? 'Pausing...' : 'Pause Exam'}
              </Button>
            )}

            {/* End Exam Button - Show when session is ACTIVE */}
            {canEnd && (
              <Button
                size="sm"
                variant="destructive"
                className="gap-2"
                onClick={handleEndExam}
                disabled={isControlling}
              >
                <AlertTriangle className="h-4 w-4" />
                {isControlling ? 'Ending...' : 'End Exam'}
              </Button>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Error loading monitoring data</p>
            <p className="text-sm">{error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
        )}

        {/* Control Error Display */}
        {controlError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Error controlling session</p>
            <p className="text-sm">{controlError instanceof Error ? controlError.message : 'Unknown error'}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !selectedSession && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* No Session ID in URL */}
        {!isLoading && !sessionId && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
            <p className="font-medium">No session ID provided</p>
            <p className="text-sm">Please provide a session ID in the URL query parameter: ?session=SESSION_ID</p>
          </div>
        )}

        {/* Session Not Found */}
        {!isLoading && sessionId && !selectedSession && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Session not found</p>
            <p className="text-sm">The session with ID &quot;{sessionId}&quot; could not be found</p>
          </div>
        )}

        {/* Statistics Cards - Only show when session is selected */}
        {selectedSession && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Remaining Time */}
            <Card className="p-4 hover:shadow-md transition-shadow border-2 border-blue-100">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-600">Remaining Time</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {remainingTime}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-between">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </Card>

            {/* Active Candidates */}
            <StatCard
              title="Active Candidates"
              value={stats.active}
              icon={<Users className="h-5 w-5" />}
              borderColor="border-2 border-green-100"
              iconBgColor="bg-green-100"
              iconColor="text-green-600"
            />

            {/* Scheduled (Total Candidates) */}
            <StatCard
              title="Scheduled"
              value={stats.scheduled}
              icon={<Eye className="h-5 w-5" />}
              iconBgColor="bg-cyan-100"
              iconColor="text-cyan-600"
            />

            {/* Absent */}
            <StatCard
              title="Absent"
              value={stats.absent}
              icon={<UserX className="h-5 w-5" />}
              iconBgColor="bg-gray-100"
              iconColor="text-gray-600"
            />

            {/* Submitted */}
            <StatCard
              title="Submitted"
              value={stats.submitted}
              icon={<CheckCircle className="h-5 w-5" />}
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
            />

            {/* Connected Clients - Real-time via WebSocket */}
            <Card className="p-4 hover:shadow-md transition-shadow border-2 border-purple-100">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium text-gray-600">Connected Clients</p>
                    {isSubscribed ? (
                      <span title="Connected to WebSocket">
                        <Wifi className="h-3 w-3 text-green-500" />
                      </span>
                    ) : (
                      <span title="Disconnected">
                        <WifiOff className="h-3 w-3 text-gray-400" />
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {/* Subtract 1 to exclude the monitoring dashboard connection */}
                    {Math.max(0, connectedClients - 1)}
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Laptop className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </Card>

            {/* Average Progress - Placeholder (not in requirements) */}
            <Card className="p-4 hover:shadow-md transition-shadow border-2 border-orange-100">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-600">Average Progress</p>
                  <p className="text-2xl font-bold text-gray-900">-</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Activity className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </Card>

            {/* Flagged - Placeholder (not in requirements) */}
            <Card className="p-4 hover:shadow-md transition-shadow border-2 border-red-100">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-600">Flagged</p>
                  <p className="text-2xl font-bold text-red-600">-</p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Actions and Filters - Only show when session is selected */}
        {selectedSession && (
          <>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  className="gap-2"
                  disabled={selectedCandidates.size === 0}
                  onClick={() => {
                    if (selectedCandidates.size > 0) {
                      setShowBulkLogoutConfirm(true)
                    }
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout {selectedCandidates.size > 0 ? `(${selectedCandidates.size})` : 'Candidate'}
                </Button>
                <Button size="sm" variant="outline" className="gap-2" disabled={selectedCandidates.size === 0}>
                  <UserMinus className="h-4 w-4" />
                  Suspend {selectedCandidates.size > 0 ? `(${selectedCandidates.size})` : 'Candidate'}
                </Button>
                <Button size="sm" variant="outline" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Reschedule
                </Button>
                <Button size="sm" variant="outline" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Generate Report
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                  </SelectContent>
                </Select>

                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by name or reg..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Candidates Table */}
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                            title="Select all candidates"
                            checked={isAllSelected}
                            onChange={handleSelectAll}
                            ref={(el) => {
                              if (el) {
                                el.indeterminate = isIndeterminate
                              }
                            }}
                          />
                          <span title="Select all candidates">Registration #</span>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCandidates.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                          {candidates.length === 0
                            ? 'No candidates registered for this session'
                            : 'No candidates match your search criteria'}
                        </td>
                      </tr>
                    ) : (
                      filteredCandidates.map((rawCandidate) => {
                      const candidate = formatCandidateForDisplay(rawCandidate)
                      const progressPercentage = candidate.totalQuestions > 0
                        ? (candidate.attempted / candidate.totalQuestions) * 100
                        : 0

                      return (
                        <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300"
                                title={`Select candidate ${candidate.name} - ${candidate.registrationNumber}`}
                                id={candidate.id}
                                checked={selectedCandidates.has(candidate.id)}
                                onChange={() => handleSelectCandidate(candidate.id)}
                              />
                              <span className="text-sm font-medium text-gray-900">
                                {candidate.registrationNumber}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-medium">
                                  {candidate.initials}
                                </span>
                              </div>
                              <span className="text-sm font-medium text-gray-900">{candidate.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Monitor className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{candidate.clientInfo}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge
                              className={`${getStatusColor(candidate.status)} border capitalize`}
                            >
                              {candidate.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <AlertCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleLogoutCandidate(candidate.id, candidate.name)}
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
          </>
        )}
      </div>

      {/* Start Exam Confirmation Dialog */}
      <AlertDialog open={showStartConfirm} onOpenChange={setShowStartConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start Exam</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to start the exam? All candidates will be able to begin once started.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isControlling}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStartExam} disabled={isControlling}>
              {isControlling ? 'Starting...' : 'Start Exam'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pause Exam Confirmation Dialog */}
      <AlertDialog open={showPauseConfirm} onOpenChange={setShowPauseConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Pause Exam</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to pause the exam? All candidates will be temporarily stopped.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isControlling}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPauseExam} disabled={isControlling}>
              {isControlling ? 'Pausing...' : 'Pause Exam'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Resume Exam Confirmation Dialog */}
      <AlertDialog open={showResumeConfirm} onOpenChange={setShowResumeConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resume Exam</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to resume the exam? All candidates will be able to continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isControlling}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmResumeExam} disabled={isControlling}>
              {isControlling ? 'Resuming...' : 'Resume Exam'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* End Exam Confirmation Dialog */}
      <AlertDialog open={showEndConfirm} onOpenChange={setShowEndConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End Exam</AlertDialogTitle>
            <AlertDialogDescription className="text-red-600 font-medium">
              Do you want to end the exam? This action cannot be undone. All candidates will be automatically submitted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isControlling}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmEndExam}
              disabled={isControlling}
              className="bg-red-600 hover:bg-red-700"
            >
              {isControlling ? 'Ending...' : 'End Exam'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Logout Candidate Confirmation Dialog */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout Candidate</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout{' '}
              <span className="font-semibold text-gray-900">
                {selectedCandidateForLogout?.name}
              </span>{' '}
              from the exam? This will end their current session and they will need to log in again to continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={logoutMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmLogoutCandidate}
              disabled={logoutMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {logoutMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging out...
                </>
              ) : (
                'Logout'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Logout Confirmation Dialog */}
      <AlertDialog open={showBulkLogoutConfirm} onOpenChange={setShowBulkLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>⚠️ Bulk Logout Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-3">
                <p className="font-medium text-red-600">
                  You are about to logout {selectedCandidates.size} selected candidate{selectedCandidates.size > 1 ? 's' : ''}.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
                  <p className="text-sm text-yellow-800">
                    <strong>Warning:</strong> This action will:
                  </p>
                  <ul className="mt-2 ml-4 text-sm text-yellow-700 list-disc">
                    <li>End their current exam sessions</li>
                    <li>Require them to log in again to continue</li>
                    <li>May affect their exam progress if not saved</li>
                  </ul>
                </div>
                <p className="text-sm text-gray-600">
                  Selected candidates:
                </p>
                <div className="max-h-32 overflow-y-auto bg-gray-50 p-2 rounded-md">
                  <ul className="text-sm text-gray-700">
                    {filteredCandidates
                      .filter(c => selectedCandidates.has(c.id))
                      .map(c => {
                        const candidate = formatCandidateForDisplay(c)
                        return (
                          <li key={c.id} className="py-1">
                            • {candidate.name} ({candidate.registrationNumber})
                          </li>
                        )
                      })}
                  </ul>
                </div>
                <p className="text-sm font-semibold">
                  Are you sure you want to proceed with this bulk logout operation?
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={bulkLogoutMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkLogout}
              disabled={bulkLogoutMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {bulkLogoutMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Logout ${selectedCandidates.size} Candidate${selectedCandidates.size > 1 ? 's' : ''}`
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default function MonitoringPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 overflow-auto">
          <DashboardHeader />
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      }
    >
      <MonitoringContent />
    </Suspense>
  )
}
