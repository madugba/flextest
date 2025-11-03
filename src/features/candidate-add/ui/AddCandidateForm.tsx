'use client'

import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/label'
import { Alert } from '@/shared/ui/Alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/Card'
import { useAddCandidateForm } from '../model/useAddCandidateForm'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Checkbox } from '@/shared/ui/checkbox'
import { Upload, Camera, X } from 'lucide-react'
import { useRef, useState } from 'react'

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

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [useWebcam, setUseWebcam] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        // Show preview immediately
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreview(reader.result as string)
        }
        reader.readAsDataURL(file)

        // Upload to server
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload/passport', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Failed to upload image')
        }

        const data = await response.json()
        setFormData(prev => ({ ...prev, picture: data.url }))
      } catch (err) {
        console.error('Error uploading image:', err)
        // You might want to show an error to the user here
      }
    }
  }

  const startWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setUseWebcam(true)
    } catch (err) {
      console.error('Error accessing webcam:', err)
    }
  }

  const capturePhoto = async () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0)
        const dataUrl = canvas.toDataURL('image/jpeg')
        setImagePreview(dataUrl)

        try {
          // Convert data URL to blob
          const response = await fetch(dataUrl)
          const blob = await response.blob()

          // Create file from blob
          const file = new File([blob], `webcam_${Date.now()}.jpg`, { type: 'image/jpeg' })

          // Upload to server
          const uploadFormData = new FormData()
          uploadFormData.append('file', file)

          const uploadResponse = await fetch('/api/upload/passport', {
            method: 'POST',
            body: uploadFormData,
          })

          if (!uploadResponse.ok) {
            throw new Error('Failed to upload image')
          }

          const data = await uploadResponse.json()
          setFormData(prev => ({ ...prev, picture: data.url }))
        } catch (err) {
          console.error('Error uploading captured photo:', err)
          // You might want to show an error to the user here
        }

        stopWebcam()
      }
    }
  }

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setUseWebcam(false)
  }

  const removeImage = async () => {
    // Delete the file from server if it was uploaded
    if (formData.picture && formData.picture.startsWith('/passport/')) {
      try {
        const response = await fetch('/api/upload/passport', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: formData.picture }),
        })

        if (!response.ok) {
          console.error('Failed to delete file from server')
        }
      } catch (err) {
        console.error('Error deleting file:', err)
      }
    }

    // Clear the preview and form data
    setImagePreview(null)
    setFormData(prev => ({ ...prev, picture: undefined }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

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
          {/* Personal Information */}
          <div className="grid gap-4">
            <h3 className="text-sm font-semibold">Personal Information</h3>

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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="othername">Other Name (Optional)</Label>
              <Input
                id="othername"
                placeholder="Enter other name"
                value={formData.othername || ''}
                onChange={(e) => setFormData({ ...formData, othername: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email (Optional)</Label>
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
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Exam Session */}
          <div className="grid gap-3">
            <div>
              <Label htmlFor="session" className="text-base font-semibold">
                Exam Session <span className="text-red-500">*</span>
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Select the exam session for this candidate
              </p>
            </div>
            <Select
              value={formData.sessionId}
              onValueChange={(value) => setFormData({ ...formData, sessionId: value })}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full h-12 text-base">
                <SelectValue placeholder="Select exam session" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {sessions.map((session) => (
                  <SelectItem key={session.id} value={session.id} className="py-3">
                    <div className="flex flex-col">
                      <span className="font-medium">{session.name}</span>
                      {session.date && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(session.date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject Selection */}
          <div className="grid gap-2">
            <Label>
              Subjects (Select 1-6) <span className="text-red-500">*</span>
            </Label>
            <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
              {subjects.length === 0 ? (
                <p className="text-sm text-muted-foreground">Loading subjects...</p>
              ) : (
                <div className="grid gap-3">
                  {subjects.map((subject) => (
                    <div key={subject.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={subject.id}
                        checked={selectedSubjects.includes(subject.id)}
                        onCheckedChange={() => toggleSubject(subject.id)}
                        disabled={isLoading || (!selectedSubjects.includes(subject.id) && selectedSubjects.length >= 6)}
                      />
                      <Label
                        htmlFor={subject.id}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {subject.name}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Selected: {selectedSubjects.length} of 6 (minimum 1 required)
              </p>
              {selectedSubjects.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border">
                  {selectedSubjects.map((subjectId) => {
                    const subject = subjects.find(s => s.id === subjectId)
                    return (
                      <div
                        key={subjectId}
                        className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm"
                      >
                        <span>{subject?.name}</span>
                        <button
                          type="button"
                          onClick={() => toggleSubject(subjectId)}
                          className="hover:bg-primary-foreground/20 rounded-full p-0.5"
                          disabled={isLoading}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Passport Photo */}
          <div className="grid gap-2">
            <Label>Passport Photo (Optional)</Label>
            <div className="border-2 border-dashed rounded-lg p-6">
              {!imagePreview && !useWebcam && (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={startWebcam}
                      disabled={isLoading}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Take Photo
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    Upload a passport-size photo or capture one using your webcam
                  </p>
                </div>
              )}

              {useWebcam && (
                <div className="flex flex-col items-center gap-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="rounded-lg max-w-md w-full border-2 border-gray-300"
                    style={{ maxHeight: '400px' }}
                  />
                  <div className="flex gap-2">
                    <Button type="button" onClick={capturePhoto}>
                      Capture Photo
                    </Button>
                    <Button type="button" variant="outline" onClick={stopWebcam}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {imagePreview && (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Passport preview"
                      className="rounded-lg max-w-xs max-h-60 object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register Candidate'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
