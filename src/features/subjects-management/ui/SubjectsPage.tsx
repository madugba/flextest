'use client'

import { DashboardHeader } from '@/widgets/dashboard'
import { ImportSubjectsDialog } from '@/features/subject-import'
import { useSubjectsPage } from '../model/useSubjectsPage'
import { DeleteSubjectDialog } from './DeleteSubjectDialog'
import { SubjectFormDialog } from './SubjectFormDialog'
import { SubjectsHeader } from './SubjectsHeader'
import { SubjectsSearchInput } from './SubjectsSearchInput'
import { SubjectsTable } from './SubjectsTable'

export function SubjectsPage() {
  const {
    subjects,
    loading,
    search,
    setSearch,
    showCreateDialog,
    setShowCreateDialog,
    showEditDialog,
    setShowEditDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    isImportDialogOpen,
    setIsImportDialogOpen,
    selectedSubject,
    subjectName,
    setSubjectName,
    isSubmitting,
    handleCreate,
    handleEdit,
    handleDelete,
    openEditDialog,
    openDeleteDialog,
  } = useSubjectsPage()

  return (
    <div className="h-screen overflow-y-auto bg-gray-50">
      <DashboardHeader serverStatus="healthy" lastUpdate={new Date()} connected={true} />

      <div className="p-6 max-w-7xl mx-auto space-y-6 pb-12">
        <SubjectsHeader
          onImport={() => setIsImportDialogOpen(true)}
          onCreate={() => setShowCreateDialog(true)}
        />

        <SubjectsSearchInput value={search} onChange={setSearch} />

        <SubjectsTable
          subjects={subjects}
          loading={loading}
          search={search}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
        />

        <SubjectFormDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          title="Add New Subject"
          description="Enter the name of the new subject"
          subjectName={subjectName}
          onSubjectNameChange={setSubjectName}
          isSubmitting={isSubmitting}
          submitLabel={isSubmitting ? 'Creating...' : 'Create Subject'}
          onSubmit={handleCreate}
        />

        <SubjectFormDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          title="Edit Subject"
          description="Update the subject name"
          subjectName={subjectName}
          onSubjectNameChange={setSubjectName}
          isSubmitting={isSubmitting}
          submitLabel={isSubmitting ? 'Saving...' : 'Save Changes'}
          onSubmit={handleEdit}
        />

        <DeleteSubjectDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          subject={selectedSubject}
          isSubmitting={isSubmitting}
          onDelete={handleDelete}
        />

        <ImportSubjectsDialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen} />
      </div>
    </div>
  )
}
