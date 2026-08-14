export interface ImportSubjectsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export interface ClassItem {
  id: string
  name: string
  level?: number | string
  code?: string
  [key: string]: unknown
}

export interface ClassResponse {
  data?: ClassItem[]
  success?: boolean
}

export interface SubjectItem {
  id?: string
  name?: string
  subjectid?: string
  subjectname?: string
  code?: string
  [key: string]: unknown
}

export interface SubjectResponse {
  data?: SubjectItem[] | string[]
  subjects?: SubjectItem[] | string[]
  success?: boolean
}

export const AVAILABLE_VALUES = [
  { key: 'classId', label: 'Class ID (selected class)' },
] as const

export type ValueKey = typeof AVAILABLE_VALUES[number]['key']
