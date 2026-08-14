import type { Dispatch, RefObject, SetStateAction } from 'react'
import type { CreateCandidateRequest } from '@/entities/candidate'

interface StartWebcamDeps {
  videoRef: RefObject<HTMLVideoElement | null>
  setStream: Dispatch<SetStateAction<MediaStream | null>>
  setUseWebcam: Dispatch<SetStateAction<boolean>>
}

export function createStartWebcam({ videoRef, setStream, setUseWebcam }: StartWebcamDeps) {
  return async () => {
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
}

interface StopWebcamDeps {
  stream: MediaStream | null
  setStream: Dispatch<SetStateAction<MediaStream | null>>
  setUseWebcam: Dispatch<SetStateAction<boolean>>
}

export function createStopWebcam({ stream, setStream, setUseWebcam }: StopWebcamDeps) {
  return () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setUseWebcam(false)
  }
}

interface CapturePhotoDeps {
  videoRef: RefObject<HTMLVideoElement | null>
  setFormData: Dispatch<SetStateAction<CreateCandidateRequest>>
  setImagePreview: Dispatch<SetStateAction<string | null>>
  stopWebcam: () => void
}

export function createCapturePhoto({
  videoRef,
  setFormData,
  setImagePreview,
  stopWebcam,
}: CapturePhotoDeps) {
  return async () => {
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
          const response = await fetch(dataUrl)
          const blob = await response.blob()

          const file = new File([blob], `webcam_${Date.now()}.jpg`, { type: 'image/jpeg' })

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
        }

        stopWebcam()
      }
    }
  }
}
