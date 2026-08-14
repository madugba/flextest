import { Upload } from 'lucide-react'
import { Button } from '@/shared/ui/Button'

interface SubjectsHeaderProps {
  onImport: () => void
  onCreate: () => void
}

export function SubjectsHeader({ onImport, onCreate }: SubjectsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Subject Management</h1>
        <p className="text-muted-foreground mt-1">Manage exam subjects</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onImport}>
          <Upload className="mr-2 h-4 w-4" />
          Import Subject
        </Button>
        <Button onClick={onCreate}>Add Subject</Button>
      </div>
    </div>
  )
}
