'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/widgets/dashboard/ui/DashboardHeader'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { MoreVertical } from 'lucide-react'
import {
  getAllExamSessions,
  createExamSession,
  updateExamSession,
  deleteExamSession,
  importExamSessionsFromApi,
  type ExamSession,
  type SessionStatus
} from '@/entities/exam-session'
import { getAllCenters, type Center } from '@/entities/center'
import { getAllSubjects, type Subject } from '@/entities/subject'
import { getAllAPIConfigurations, type APIConfiguration } from '@/entities/api-configuration'
import { toast } from 'sonner'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'

export default function ExamSessionsPage() {
  const router = useRouter()
  const [examSessions, setExamSessions] = useState<ExamSession[]>([])
  const [centers, setCenters] = useState<Center[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [apiConfigurations, setApiConfigurations] = useState<APIConfiguration[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<SessionStatus | ''>('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [selectedSession, setSelectedSession] = useState<ExamSession | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [selectedConfigId, setSelectedConfigId] = useState('')
  const [selectedConfig, setSelectedConfig] = useState<APIConfiguration | null>(null)
  const [selectedClass, setSelectedClass] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    duration: '60',
    hallCapacity: '',
    totalQuestion: '',
    compulsorySubjectId: '',
    totalCompulsoryQuestion: '',
    totalOtherQuestions: '',
    centerId: '',
  })

  const fetchExamSessions = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getAllExamSessions(statusFilter || undefined)
      setExamSessions(data)
    } catch (error) {
      toast.error('Failed to load exam sessions', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  const fetchCenters = async () => {
    try {
      const data = await getAllCenters()
      setCenters(data)
    } catch {
      toast.error('Failed to load centers')
    }
  }

  const fetchSubjects = async () => {
    try {
      const data = await getAllSubjects()
      setSubjects(data)
    } catch {
      toast.error('Failed to load subjects')
    }
  }

  const fetchAPIConfigurations = useCallback(async () => {
    try {
      const data = await getAllAPIConfigurations()
      setApiConfigurations(data)
    } catch (error) {
      toast.error('Failed to load API configurations', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    }
  }, [])

  const loadAPIConfig = (configId: string) => {
    const config = apiConfigurations.find((c) => c.id === configId)
    if (config) {
      setSelectedConfig(config)
      setSelectedClass('')
    } else {
      setSelectedConfig(null)
      setSelectedClass('')
    }
  }

  const resetImportForm = () => {
    setSelectedConfigId('')
    setSelectedConfig(null)
    setSelectedClass('')
  }

  useEffect(() => {
    fetchExamSessions()
  }, [fetchExamSessions])

  useEffect(() => {
    fetchCenters()
    fetchSubjects()
    fetchAPIConfigurations()
  }, [fetchAPIConfigurations])

  const resetForm = () => {
    setFormData({
      name: '',
      date: '',
      time: '',
      duration: '60',
      hallCapacity: '',
      totalQuestion: '',
      compulsorySubjectId: '',
      totalCompulsoryQuestion: '',
      totalOtherQuestions: '',
      centerId: '',
    })
  }

  const selectSubject = (subjectId: string) => {
    setFormData((prev) => ({
      ...prev,
      compulsorySubjectId: subjectId,
    }))
  }

  const handleCreate = async () => {
    if (!formData.name.trim() || !formData.date || !formData.time || !formData.centerId) {
      toast.error('Please fill in all required fields (Name, Date, Time, and Center)')
      return
    }

    if (!formData.compulsorySubjectId) {
      toast.error('Please select a compulsory subject')
      return
    }

    if (!formData.duration || parseInt(formData.duration) <= 0) {
      toast.error('Please enter a valid duration')
      return
    }

    try {
      setIsSubmitting(true)
      await createExamSession({
        name: formData.name.trim(),
        date: new Date(formData.date).toISOString(),
        time: formData.time,
        duration: parseInt(formData.duration),
        hallCapacity: parseInt(formData.hallCapacity) || 0,
        totalQuestion: parseInt(formData.totalQuestion) || 0,
        totalCompulsorySubject: formData.compulsorySubjectId ? 1 : 0,
        totalCompulsoryQuestion: parseInt(formData.totalCompulsoryQuestion) || 0,
        totalOtherQuestions: parseInt(formData.totalOtherQuestions) || 0,
        compulsorySubjectId: formData.compulsorySubjectId,
        centerId: formData.centerId,
      })
      toast.success('Exam session created successfully')
      setShowCreateDialog(false)
      resetForm()
      await fetchExamSessions()
    } catch (error) {
      toast.error('Failed to create exam session', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async () => {
    if (!selectedSession || !formData.name.trim()) return

    if (!formData.compulsorySubjectId) {
      toast.error('Please select a compulsory subject')
      return
    }

    if (!formData.duration || parseInt(formData.duration) <= 0) {
      toast.error('Please enter a valid duration')
      return
    }

    try {
      setIsSubmitting(true)
      await updateExamSession(selectedSession.id, {
        name: formData.name.trim(),
        date: formData.date ? new Date(formData.date).toISOString() : undefined,
        time: formData.time || undefined,
        duration: formData.duration ? parseInt(formData.duration) : undefined,
        hallCapacity: formData.hallCapacity ? parseInt(formData.hallCapacity) : undefined,
        totalQuestion: formData.totalQuestion ? parseInt(formData.totalQuestion) : undefined,
        totalCompulsorySubject: formData.compulsorySubjectId ? 1 : 0,
        totalCompulsoryQuestion: formData.totalCompulsoryQuestion ? parseInt(formData.totalCompulsoryQuestion) : undefined,
        totalOtherQuestions: formData.totalOtherQuestions ? parseInt(formData.totalOtherQuestions) : undefined,
        compulsorySubjectId: formData.compulsorySubjectId || undefined,
        centerId: formData.centerId || undefined,
      })
      toast.success('Exam session updated successfully')
      setShowEditDialog(false)
      setSelectedSession(null)
      resetForm()
      await fetchExamSessions()
    } catch (error) {
      toast.error('Failed to update exam session', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedSession) return

    try {
      setIsSubmitting(true)
      await deleteExamSession(selectedSession.id)
      toast.success('Exam session deleted successfully')
      setShowDeleteDialog(false)
      setSelectedSession(null)
      await fetchExamSessions()
    } catch (error) {
      toast.error('Failed to delete exam session', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImportFromApi = async () => {
    if (!selectedConfig) {
      toast.error('Please select an API configuration')
      return
    }

    if (selectedConfig.isSchoolPortal && !selectedClass) {
      toast.error('Please select a class for school portal import')
      return
    }

    try {
      setIsSubmitting(true)
      const result = await importExamSessionsFromApi(selectedConfig.apiEndpoint)
      toast.success('Import completed', {
        description: `Created: ${result.created}, Skipped: ${result.skipped}${result.errors.length > 0 ? `, Errors: ${result.errors.length}` : ''}`,
      })
      setShowImportDialog(false)
      resetImportForm()
      await fetchExamSessions()
    } catch (error) {
      toast.error('Failed to import exam sessions from API', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditDialog = (session: ExamSession) => {
    setSelectedSession(session)
    setFormData({
      name: session.name,
      date: session.date.split('T')[0],
      time: session.time,
      duration: (session.duration || 60).toString(),
      hallCapacity: session.hallCapacity.toString(),
      totalQuestion: session.totalQuestion.toString(),
      compulsorySubjectId: session.compulsorySubjectId || '',
      totalCompulsoryQuestion: session.totalCompulsoryQuestion.toString(),
      totalOtherQuestions: session.totalOtherQuestions.toString(),
      centerId: session.centerId || '',
    })
    setShowEditDialog(true)
  }

  const openDeleteDialog = (session: ExamSession) => {
    setSelectedSession(session)
    setShowDeleteDialog(true)
  }

  const filteredSessions = examSessions.filter((session) =>
    session.name.toLowerCase().includes(search.toLowerCase())
  )

  const getStatusBadgeColor = (status: SessionStatus) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800'
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="h-screen overflow-y-auto bg-gray-50">
      <DashboardHeader serverStatus="healthy" lastUpdate={new Date()} connected={true} />

      <div className="p-6 max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Exam Sessions</h1>
            <p className="text-muted-foreground mt-1">
              Manage examination sessions and schedules
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setShowImportDialog(true)} variant="outline">
              Import Exam Sessions
            </Button>
            <Button onClick={() => setShowCreateDialog(true)}>
              Create Exam Session
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search exam sessions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
            />
          </div>
          <select
            title="Status Filter"
            name="statusFilter"
            aria-label="Status Filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as SessionStatus | '')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Statuses</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Exam Sessions Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Center
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      Loading exam sessions...
                    </td>
                  </tr>
                ) : filteredSessions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      {search ? 'No exam sessions found matching your search' : 'No exam sessions yet. Create your first session!'}
                    </td>
                  </tr>
                ) : (
                  filteredSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{session.name}</div>
                        <div className="text-xs text-gray-500">
                          {session.totalQuestion} questions total
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{new Date(session.date).toLocaleDateString()}</div>
                        <div className="text-xs">{session.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {session.center ? (
                          <div>
                            <div className="font-medium text-gray-900">{session.center.centerName}</div>
                            <div className="text-xs">{session.center.state}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">No center assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {session.hallCapacity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{session.duration} min</div>
                        <div className="text-xs text-gray-400">
                          {Math.floor(session.duration / 60)}h {session.duration % 60}m
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(session.status)}`}>
                          {session.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/monitoring?session=${session.id}`)}>
                              Start Exam
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/questions/upload/${session.id}`)}>
                              Upload Questions
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openEditDialog(session)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem variant="destructive" onClick={() => openDeleteDialog(session)}>
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Exam Session</DialogTitle>
              <DialogDescription>
                Enter the details for the new exam session
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              {/* Session Name */}
              <Input
                label="Session Name"
                placeholder="e.g., UTME 2024 First Sitting"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                required
              />

              {/* Date, Time, Center */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    title="Date"
                    name="date"
                    aria-label="Date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Center <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.centerId}
                    onChange={(e) => setFormData({ ...formData, centerId: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Select a center</option>
                    {centers.map((center) => (
                      <option key={center.id} value={center.id}>
                        {center.centerName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Duration */}
              <Input
                label="Duration (minutes)"
                type="number"
                placeholder="e.g., 60 (default 1 hour)"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                fullWidth
                required
              />

              {/* Compulsory Subject Selection (Single) */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Compulsory Subject (Select One)
                </label>
                <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto bg-gray-50">
                  {subjects.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No subjects available. Please create subjects first.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {subjects.map((subject) => (
                        <label
                          key={subject.id}
                          className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="compulsorySubject"
                            checked={formData.compulsorySubjectId === subject.id}
                            onChange={() => selectSubject(subject.id)}
                            className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                          />
                          <span className="text-sm text-gray-700">{subject.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                {formData.compulsorySubjectId && (
                  <p className="text-xs text-gray-600 mt-1">
                    {subjects.find(s => s.id === formData.compulsorySubjectId)?.name} selected
                  </p>
                )}
              </div>

              {/* Questions Configuration */}
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Hall Capacity"
                  type="number"
                  placeholder="e.g., 100"
                  value={formData.hallCapacity}
                  onChange={(e) => setFormData({ ...formData, hallCapacity: e.target.value })}
                  fullWidth
                />

                <Input
                  label="Total Questions"
                  type="number"
                  placeholder="e.g., 180"
                  value={formData.totalQuestion}
                  onChange={(e) => setFormData({ ...formData, totalQuestion: e.target.value })}
                  fullWidth
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Compulsory Questions"
                  type="number"
                  placeholder="e.g., 60"
                  value={formData.totalCompulsoryQuestion}
                  onChange={(e) => setFormData({ ...formData, totalCompulsoryQuestion: e.target.value })}
                  fullWidth
                />

                <Input
                  label="Other Questions"
                  type="number"
                  placeholder="e.g., 120"
                  value={formData.totalOtherQuestions}
                  onChange={(e) => setFormData({ ...formData, totalOtherQuestions: e.target.value })}
                  fullWidth
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => { setShowCreateDialog(false); resetForm(); }} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Session'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Exam Session</DialogTitle>
              <DialogDescription>
                Update the exam session details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              {/* Session Name */}
              <Input
                label="Session Name"
                placeholder="e.g., UTME 2024 First Sitting"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                required
              />

              {/* Date, Time, Center */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Center <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.centerId}
                    onChange={(e) => setFormData({ ...formData, centerId: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Select a center</option>
                    {centers.map((center) => (
                      <option key={center.id} value={center.id}>
                        {center.centerName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Duration */}
              <Input
                label="Duration (minutes)"
                type="number"
                placeholder="e.g., 60 (default 1 hour)"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                fullWidth
                required
              />

              {/* Compulsory Subject Selection (Single) */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Compulsory Subject (Select One)
                </label>
                <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto bg-gray-50">
                  {subjects.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No subjects available. Please create subjects first.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {subjects.map((subject) => (
                        <label
                          key={subject.id}
                          className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="compulsorySubject"
                            checked={formData.compulsorySubjectId === subject.id}
                            onChange={() => selectSubject(subject.id)}
                            className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                          />
                          <span className="text-sm text-gray-700">{subject.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                {formData.compulsorySubjectId && (
                  <p className="text-xs text-gray-600 mt-1">
                    {subjects.find(s => s.id === formData.compulsorySubjectId)?.name} selected
                  </p>
                )}
              </div>

              {/* Questions Configuration */}
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Hall Capacity"
                  type="number"
                  placeholder="e.g., 100"
                  value={formData.hallCapacity}
                  onChange={(e) => setFormData({ ...formData, hallCapacity: e.target.value })}
                  fullWidth
                />

                <Input
                  label="Total Questions"
                  type="number"
                  placeholder="e.g., 180"
                  value={formData.totalQuestion}
                  onChange={(e) => setFormData({ ...formData, totalQuestion: e.target.value })}
                  fullWidth
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Compulsory Questions"
                  type="number"
                  placeholder="e.g., 60"
                  value={formData.totalCompulsoryQuestion}
                  onChange={(e) => setFormData({ ...formData, totalCompulsoryQuestion: e.target.value })}
                  fullWidth
                />

                <Input
                  label="Other Questions"
                  type="number"
                  placeholder="e.g., 120"
                  value={formData.totalOtherQuestions}
                  onChange={(e) => setFormData({ ...formData, totalOtherQuestions: e.target.value })}
                  fullWidth
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => { setShowEditDialog(false); resetForm(); setSelectedSession(null); }} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleEdit} disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Session'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Import Dialog */}
        <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Import Exam Sessions</DialogTitle>
              <DialogDescription>
                Import exam sessions from an external API
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 mt-2">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  API Configuration <span className="text-red-500">*</span>
                </label>
                <select
                  aria-label="Select an API configuration"
                  value={selectedConfigId}
                  onChange={(e) => {
                    setSelectedConfigId(e.target.value)
                    loadAPIConfig(e.target.value)
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a saved configuration...</option>
                  {apiConfigurations.map((config) => (
                    <option key={config.id} value={config.id}>
                      {config.name}
                      {config.isSchoolPortal && ' (School Portal)'}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Configure API endpoints in{' '}
                  <a href="/dashboard/settings" className="underline font-semibold">
                    Settings
                  </a>
                </p>
              </div>

              {selectedConfig?.isSchoolPortal && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Class <span className="text-red-500">*</span>
                  </label>
                  <select
                    aria-label="Select a class"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select a class...</option>
                    {/* Classes will be populated from API later */}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Select the class for school portal import
                  </p>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-xs text-blue-800">
                  <strong>Note:</strong> API endpoint and authentication are configured in the selected API configuration.
                </p>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowImportDialog(false)
                  resetImportForm()
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button onClick={handleImportFromApi} disabled={isSubmitting}>
                {isSubmitting ? 'Importing...' : 'Import from API'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Exam Session</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &quot;{selectedSession?.name}&quot;? This action cannot be undone and will affect all associated candidates.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? 'Deleting...' : 'Delete Session'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
