import { Button } from '@/shared/ui/Button'
import type { RefObject } from 'react'

interface WebcamCaptureViewProps {
  videoRef: RefObject<HTMLVideoElement | null>
  onCapture: () => void
  onCancel: () => void
}

export function WebcamCaptureView({ videoRef, onCapture, onCancel }: WebcamCaptureViewProps) {
  return (
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
        <Button type="button" onClick={onCapture}>
          Capture Photo
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
