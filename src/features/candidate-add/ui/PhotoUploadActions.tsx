import { Button } from '@/shared/ui/Button'
import { Upload, Camera } from 'lucide-react'
import type { Dispatch, RefObject, SetStateAction } from 'react'
import type { CreateCandidateRequest } from '@/entities/candidate'
import { createHandleImageUpload } from './createPhotoUploadHandlers'

interface PhotoUploadActionsProps {
  setFormData: Dispatch<SetStateAction<CreateCandidateRequest>>
  setImagePreview: Dispatch<SetStateAction<string | null>>
  isLoading: boolean
  fileInputRef: RefObject<HTMLInputElement | null>
  onStartWebcam: () => void
}

export function PhotoUploadActions({
  setFormData,
  setImagePreview,
  isLoading,
  fileInputRef,
  onStartWebcam,
}: PhotoUploadActionsProps) {
  const handleImageUpload = createHandleImageUpload({ setFormData, setImagePreview })

  return (
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
          onClick={onStartWebcam}
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
  )
}
