'use client'

import { Alert } from '@/shared/ui/Alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/Card'
import { useAddCandidateForm } from '../model/useAddCandidateForm'
import { PersonalInfoFields } from './PersonalInfoFields'
import { ExamSessionSection } from './ExamSessionSection'
import { SubjectSelectionSection } from './SubjectSelectionSection'
import { PassportPhotoSection } from './PassportPhotoSection'
import { FormActions } from './FormActions'

interface AddCandidateFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function AddCandidateForm({ onSuccess, onCancel }: AddCandidateFormProps) {
  const {
    isLoading,
    error,
    formData,
    sessions,
    subjects,
    selectedSubjects,
    setFormData,
    toggleSubject,
    handleSubmit,
  } = useAddCandidateForm(onSuccess)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidate Registration</CardTitle>
        <CardDescription>
          Fill in the candidate details. Fields marked with * are required. A unique candidate ID will be automatically generated.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            {error}
          </Alert>
        )}

        <div className="grid gap-6">
          <PersonalInfoFields
            formData={formData}
            setFormData={setFormData}
            isLoading={isLoading}
          />

          <ExamSessionSection
            formData={formData}
            setFormData={setFormData}
            sessions={sessions}
            isLoading={isLoading}
          />

          <SubjectSelectionSection
            subjects={subjects}
            selectedSubjects={selectedSubjects}
            toggleSubject={toggleSubject}
            isLoading={isLoading}
          />

          <PassportPhotoSection
            formData={formData}
            setFormData={setFormData}
            isLoading={isLoading}
          />
        </div>

        <FormActions isLoading={isLoading} onCancel={onCancel} onSubmit={handleSubmit} />
      </CardContent>
    </Card>
  )
}
