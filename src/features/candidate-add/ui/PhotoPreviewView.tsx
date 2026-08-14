import { Button } from '@/shared/ui/Button'
import { X } from 'lucide-react'

interface PhotoPreviewViewProps {
  imagePreview: string
  onRemove: () => void
}

export function PhotoPreviewView({ imagePreview, onRemove }: PhotoPreviewViewProps) {
  return (
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
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
