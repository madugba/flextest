'use client'

import { useState, useEffect } from 'react'
import { DashboardHeader } from '@/widgets/dashboard/ui/DashboardHeader'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { getAllSubjects, createSubject, updateSubject, deleteSubject, type Subject } from '@/entities/subject'
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
import { ImportSubjectsDialog } from '@/features/subject-import'
import { Upload } from 'lucide-react'

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [subjectName, setSubjectName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchSubjects = async (searchQuery?: string) => {
    try {
      setLoading(true)
      const data = await getAllSubjects(searchQuery)
      setSubjects(data)
    } catch (error) {
      toast.error('Failed to load subjects', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubjects(search)
  }, [search])

  const handleCreate = async () => {
    if (!subjectName.trim()) {
      toast.error('Subject name is required')
      return
    }


    try {
      setIsSubmitting(true)
      await createSubject({ name: subjectName.trim() })
      toast.success('Subject created successfully', {
        description: 'The subject has been created successfully',
      })
      setShowCreateDialog(false)
      setSubjectName('')
      // Clear search and refresh to show new subject
      setSearch('')
      await fetchSubjects('')
    } catch (error) {
      toast.error('Failed to create subject', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async () => {
    if (!selectedSubject || !subjectName.trim()) return

    try {
      setIsSubmitting(true)
      await updateSubject(selectedSubject.id, { name: subjectName.trim() })
      toast.success('Subject updated successfully')
      setShowEditDialog(false)
      setSelectedSubject(null)
      setSubjectName('')
      await fetchSubjects(search)
    } catch (error) {
      toast.error('Failed to update subject', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedSubject) return

    try {
      setIsSubmitting(true)
      await deleteSubject(selectedSubject.id)
      toast.success('Subject deleted successfully')
      setShowDeleteDialog(false)
      setSelectedSubject(null)
      await fetchSubjects(search)
    } catch (error) {
      toast.error('Failed to delete subject', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditDialog = (subject: Subject) => {
    setSelectedSubject(subject)
    setSubjectName(subject.name)
    setShowEditDialog(true)
  }

  const openDeleteDialog = (subject: Subject) => {
    setSelectedSubject(subject)
    setShowDeleteDialog(true)
  }

  return (
    <div className="h-screen overflow-y-auto bg-gray-50">
      <DashboardHeader serverStatus="healthy" lastUpdate={new Date()} connected={true} />

      <div className="p-6 max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Subject Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage exam subjects
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Import Subject
            </Button>
            <Button onClick={() => setShowCreateDialog(true)}>
              Add Subject
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-md">
          <Input
            placeholder="Search subjects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />
        </div>

        {/* Subjects Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                      Loading subjects...
                    </td>
                  </tr>
                ) : subjects.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                      {search ? 'No subjects found matching your search' : 'No subjects yet. Add your first subject!'}
                    </td>
                  </tr>
                ) : (
                  subjects.map((subject) => (
                    <tr key={subject.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {subject.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(subject.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openEditDialog(subject)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteDialog(subject)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
              <DialogDescription>
                Enter the name of the new subject
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                label="Subject Name"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                fullWidth
                required
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Subject'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Subject</DialogTitle>
              <DialogDescription>
                Update the subject name
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                label="Subject Name"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                fullWidth
                required
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleEdit} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Subject</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &quot;{selectedSubject?.name}&quot;? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? 'Deleting...' : 'Delete Subject'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Import Subjects Dialog */}
        <ImportSubjectsDialog
          open={isImportDialogOpen}
          onOpenChange={setIsImportDialogOpen}
        />
      </div>
    </div>
  )
}
