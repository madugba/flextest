'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/label'
import { Alert } from '@/shared/ui/Alert'
import { useAddCandidateForm } from '../model/useAddCandidateForm'

interface AddCandidateDialogProps {
  onSuccess?: () => void
}

export function AddCandidateDialog({ onSuccess }: AddCandidateDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
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
  } = useAddCandidateForm(() => {
    setIsOpen(false)
    onSuccess?.()
  })

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleOpen = () => {
    setIsOpen(true)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? handleOpen() : handleClose())}>
      <DialogTrigger asChild>
        <Button>Add Candidate</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Candidate</DialogTitle>
          <DialogDescription>
            Create a new candidate and assign subjects
          </DialogDescription>
        </DialogHeader>

        {error && <Alert variant="destructive">{error}</Alert>}

        <div className="grid gap-4">
          {/* Surname and First Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="surname">
                Surname <span className="text-red-500">*</span>
              </Label>
              <Input
                id="surname"
                placeholder="Enter surname"
                value={formData.surname}
                onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="firstname">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstname"
                placeholder="Enter first name"
                value={formData.firstname}
                onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Other Name */}
          <div className="grid gap-2">
            <Label htmlFor="othername">Other Name (Optional)</Label>
            <Input
              id="othername"
              placeholder="Enter other name"
              value={formData.othername || ''}
              onChange={(e) => setFormData({ ...formData, othername: e.target.value })}
            />
          </div>

          {/* Email */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="candidate@example.com"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Phone */}
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              placeholder="Enter phone number"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          {/* Exam Session */}
          <div className="grid gap-2">
            <Label htmlFor="sessionId">
              Exam Session <span className="text-red-500">*</span>
            </Label>
            <select
              id="sessionId"
              value={formData.sessionId}
              onChange={(e) => setFormData({ ...formData, sessionId: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select an exam session...</option>
              {sessions.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.name} - {new Date(session.date).toLocaleDateString()} @ {session.time}
                </option>
              ))}
            </select>
          </div>

          {/* Picture URL */}
          <div className="grid gap-2">
            <Label htmlFor="picture">Picture URL (Optional)</Label>
            <Input
              id="picture"
              placeholder="https://example.com/photo.jpg"
              value={formData.picture || ''}
              onChange={(e) => setFormData({ ...formData, picture: e.target.value })}
            />
          </div>

          {/* Subjects */}
          <div className="grid gap-2">
            <Label>
              Subjects <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-2">
                (Select 1-6 subjects)
              </span>
            </Label>
            <div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto">
              {subjects.length === 0 ? (
                <p className="text-sm text-gray-500">No subjects available. Please add subjects first.</p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {subjects.map((subject) => (
                    <label
                      key={subject.id}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSubjects.includes(subject.id)}
                        onChange={() => toggleSubject(subject.id)}
                        disabled={!selectedSubjects.includes(subject.id) && selectedSubjects.length >= 6}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm">{subject.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            {selectedSubjects.length > 0 && (
              <p className="text-xs text-gray-600">
                {selectedSubjects.length} subject{selectedSubjects.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Candidate'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
