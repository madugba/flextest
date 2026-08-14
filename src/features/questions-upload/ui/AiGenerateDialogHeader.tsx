import { DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { Sparkles } from 'lucide-react'

export function AiGenerateDialogHeader() {
  return (
    <DialogHeader className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
          <Sparkles className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <DialogTitle className="text-xl">Generate Questions with AI</DialogTitle>
          <DialogDescription className="text-sm">
            Configure AI settings to automatically generate questions
          </DialogDescription>
        </div>
      </div>
    </DialogHeader>
  )
}
