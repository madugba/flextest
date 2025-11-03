'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/label'
import { Alert } from '@/shared/ui/Alert'
import { Badge } from '@/shared/ui/Badge'
import { useEditCandidate } from '../model/useEditCandidate'
import { getCandidateFullName } from '@/entities/candidate'

interface EditCandidateDialogProps {
  children: (props: { onEdit: (id: string) => void }) => React.ReactNode
  onSuccess?: () => void
}

export function EditCandidateDialog({ children, onSuccess }: EditCandidateDialogProps) {
  const {
    isOpen,
    isLoading,
    isFetching,
    error,
    candidate,
    formData,
    setFormData,
    subjects,
    selectedSubjects,
    toggleSubject,
    handleOpen,
    handleClose,
    handleSubmit,
  } = useEditCandidate(onSuccess)

  return (
    <>
      {children({ onEdit: handleOpen })}
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Candidate</DialogTitle>
            <DialogDescription>
              Update candidate contact information and account status
            </DialogDescription>
          </DialogHeader>

          {error && <Alert variant="destructive" className="mt-4">{error}</Alert>}

          {isFetching && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {candidate && !isFetching && (
            <div className="space-y-6 mt-4">
              {/* Candidate Info Header */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
                <div className="flex items-center gap-4">
                  {candidate.picture ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={candidate.picture}
                      alt={getCandidateFullName(candidate)}
                      className="w-16 h-16 rounded-lg object-cover border-2 border-white shadow-sm"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center border-2 border-white shadow-sm">
                      <span className="text-xl font-bold text-primary">
                        {candidate.firstname?.charAt(0) || candidate.firstName?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{getCandidateFullName(candidate)}</h3>
                    <p className="text-sm text-gray-600 font-mono">{candidate.id}</p>
                  </div>
                </div>
              </div>

              {/* Read-only Registration Details */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Registration Details (Read-only)</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {candidate.surname && (
                    <div>
                      <span className="text-gray-500">Surname:</span>{' '}
                      <span className="font-medium">{candidate.surname}</span>
                    </div>
                  )}
                  {candidate.firstname && (
                    <div>
                      <span className="text-gray-500">First Name:</span>{' '}
                      <span className="font-medium">{candidate.firstname}</span>
                    </div>
                  )}
                  {candidate.othername && (
                    <div className="col-span-2">
                      <span className="text-gray-500">Other Name:</span>{' '}
                      <span className="font-medium">{candidate.othername}</span>
                    </div>
                  )}
                  {candidate.session && (
                    <div className="col-span-2">
                      <span className="text-gray-500">Exam Session:</span>{' '}
                      <span className="font-medium">{candidate.session.name}</span>
                    </div>
                  )}
                  {candidate.seatNumber && (
                    <div>
                      <span className="text-gray-500">Seat Number:</span>{' '}
                      <span className="font-medium">{candidate.seatNumber}</span>
                    </div>
                  )}
                  {candidate.subjectCombinations && candidate.subjectCombinations.length > 0 && (
                    <div className="col-span-2">
                      <span className="text-gray-500">Subjects:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {candidate.subjectCombinations.map((combo) => (
                          <Badge key={combo.id} variant="outline" className="text-xs">
                            {combo.subject.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Editable Fields */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">Contact Information</h3>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="candidate@example.com"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="Enter phone number"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      disabled={isLoading}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="isActive" className="text-sm font-normal cursor-pointer">
                      Account is active
                    </Label>
                  </div>
                </div>
              </div>

              {/* Subject Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-700">Registered Subjects</h3>
                  <span className="text-sm text-gray-500">
                    Selected: {selectedSubjects.length} of 6
                  </span>
                </div>

                {subjects.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    Loading subjects...
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {subjects.map((subject) => {
                      const isSelected = selectedSubjects.includes(subject.id)
                      const isDisabled = !isSelected && selectedSubjects.length >= 6

                      return (
                        <div
                          key={subject.id}
                          className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                            isSelected
                              ? 'bg-primary/5 border-primary/30'
                              : isDisabled
                              ? 'bg-gray-50 border-gray-200 opacity-50'
                              : 'bg-white border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            id={`subject-${subject.id}`}
                            checked={isSelected}
                            onChange={() => toggleSubject(subject.id)}
                            disabled={isLoading || isDisabled}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:cursor-not-allowed"
                          />
                          <Label
                            htmlFor={`subject-${subject.id}`}
                            className={`text-sm font-normal cursor-pointer flex-1 ${
                              isDisabled ? 'cursor-not-allowed' : ''
                            }`}
                          >
                            {subject.name}
                          </Label>
                        </div>
                      )
                    })}
                  </div>
                )}

                {selectedSubjects.length === 0 && (
                  <Alert variant="destructive" className="mt-2">
                    Please select at least one subject
                  </Alert>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading || isFetching}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
