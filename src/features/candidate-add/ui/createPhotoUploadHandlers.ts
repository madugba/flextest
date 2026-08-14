import type { ChangeEvent, Dispatch, RefObject, SetStateAction } from 'react'
import type { CreateCandidateRequest } from '@/entities/candidate'

interface HandleImageUploadDeps {
  setFormData: Dispatch<SetStateAction<CreateCandidateRequest>>
  setImagePreview: Dispatch<SetStateAction<string | null>>
}

export function createHandleImageUpload({ setFormData, setImagePreview }: HandleImageUploadDeps) {
  return async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreview(reader.result as string)
        }
        reader.readAsDataURL(file)

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
      }
    }
  }
}

interface RemoveImageDeps {
  formData: CreateCandidateRequest
  setFormData: Dispatch<SetStateAction<CreateCandidateRequest>>
  setImagePreview: Dispatch<SetStateAction<string | null>>
  fileInputRef: RefObject<HTMLInputElement | null>
}

export function createRemoveImage({
  formData,
  setFormData,
  setImagePreview,
  fileInputRef,
}: RemoveImageDeps) {
  return async () => {
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

    setImagePreview(null)
    setFormData(prev => ({ ...prev, picture: undefined }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
}
