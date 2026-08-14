'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import type { ImportSubjectsDialogProps } from '../model/types'
import { useSubjectImport } from '../model/useSubjectImport'
import { ImportActions } from './ImportActions'
import { ImportClassApiStep } from './ImportClassApiStep'
import { ImportClassSelectStep } from './ImportClassSelectStep'
import { ImportStatusRows } from './ImportStatusRows'
import { ImportSubjectApiStep } from './ImportSubjectApiStep'
import { PlaceholderMappingStep } from './PlaceholderMappingStep'

export function ImportSubjectsDialog({ open, onOpenChange }: ImportSubjectsDialogProps) {
  const {
    apiConfigurations,
    classConfigId,
    classes,
    isLoadingClasses,
    classesError,
    selectedClassId,
    subjectConfigId,
    subjectConfig,
    placeholders,
    placeholderMap,
    subjects,
    isLoadingSubjects,
    subjectsError,
    classConfig,
    selectedClassName,
    loadClasses,
    handleClassApiChange,
    handleClassChange,
    handleSubjectApiChange,
    handlePlaceholderMap,
    handleReset,
    handleImport,
  } = useSubjectImport(open, onOpenChange)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Subjects from API</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 py-4">
          <ImportClassApiStep
            apiConfigurations={apiConfigurations}
            classConfigId={classConfigId}
            onClassApiChange={handleClassApiChange}
            isLoadingClasses={isLoadingClasses}
            classesError={classesError}
          />

          <ImportClassSelectStep
            classConfigId={classConfigId}
            classes={classes}
            selectedClassId={selectedClassId}
            onClassChange={handleClassChange}
            classConfig={classConfig}
            onRefresh={loadClasses}
            isLoadingClasses={isLoadingClasses}
          />

          <ImportSubjectApiStep
            apiConfigurations={apiConfigurations}
            subjectConfigId={subjectConfigId}
            onSubjectApiChange={handleSubjectApiChange}
            selectedClassId={selectedClassId}
            selectedClassName={selectedClassName}
            subjectConfig={subjectConfig}
          />

          {subjectConfig && placeholders.length > 0 && (
            <PlaceholderMappingStep
              placeholders={placeholders}
              placeholderMap={placeholderMap}
              onPlaceholderMap={handlePlaceholderMap}
              selectedClassId={selectedClassId}
              subjectConfigId={subjectConfigId}
            />
          )}

          <ImportStatusRows
            isLoadingSubjects={isLoadingSubjects}
            subjects={subjects}
            subjectsError={subjectsError}
          />
        </div>

        <ImportActions
          isLoadingSubjects={isLoadingSubjects}
          subjectsCount={subjects.length}
          onReset={handleReset}
          onCancel={() => onOpenChange(false)}
          onImport={handleImport}
        />
      </DialogContent>
    </Dialog>
  )
}
