'use client'

import { useRef, useState } from 'react'
import { Label } from '@/shared/ui/label'
import type { Dispatch, SetStateAction } from 'react'
import type { CreateCandidateRequest } from '@/entities/candidate'
import { createCapturePhoto, createStartWebcam, createStopWebcam } from './createWebcamHandlers'
import { createRemoveImage } from './createPhotoUploadHandlers'
import { PhotoUploadActions } from './PhotoUploadActions'
import { WebcamCaptureView } from './WebcamCaptureView'
import { PhotoPreviewView } from './PhotoPreviewView'

interface PassportPhotoSectionProps {
  formData: CreateCandidateRequest
  setFormData: Dispatch<SetStateAction<CreateCandidateRequest>>
  isLoading: boolean
}

export function PassportPhotoSection({
  formData,
  setFormData,
  isLoading,
}: PassportPhotoSectionProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [useWebcam, setUseWebcam] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const startWebcam = createStartWebcam({ videoRef, setStream, setUseWebcam })
  const stopWebcam = createStopWebcam({ stream, setStream, setUseWebcam })
  const capturePhoto = createCapturePhoto({
    videoRef,
    setFormData,
    setImagePreview,
    stopWebcam,
  })
  const removeImage = createRemoveImage({
    formData,
    setFormData,
    setImagePreview,
    fileInputRef,
  })

  return (
    <div className="grid gap-2">
      <Label>Passport Photo (Optional)</Label>
      <div className="border-2 border-dashed rounded-lg p-6">
        {!imagePreview && !useWebcam && (
          <PhotoUploadActions
            setFormData={setFormData}
            setImagePreview={setImagePreview}
            isLoading={isLoading}
            fileInputRef={fileInputRef}
            onStartWebcam={startWebcam}
          />
        )}

        {useWebcam && (
          <WebcamCaptureView videoRef={videoRef} onCapture={capturePhoto} onCancel={stopWebcam} />
        )}

        {imagePreview && (
          <PhotoPreviewView imagePreview={imagePreview} onRemove={removeImage} />
        )}
      </div>
    </div>
  )
}
