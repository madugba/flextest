import type { APIConfiguration } from '@/entities/api-configuration'
import type { Subject } from '@/entities/subject'

export interface ImportCandidatesDialogProps {
  onSuccess?: (count: number) => void
}

export interface ImportStudentsStepProps {
  status: StepStatus
  studentApiId: string
  onStudentApiChange: (id: string) => void
  apiConfigurations: APIConfiguration[]
  studentAmbiguous: string[]
  studentMap: Record<string, ImportValueKey>
  onStudentMapChange: (placeholder: string, valueKey: ImportValueKey | '') => void
  studentApiConfig: APIConfiguration | null
  studentPreviewUrl: string
  studentsError: string | null
  subClasses: SubClass[]
  selectedSubclassId: string
  onSubclassChange: (id: string) => void
  totalStudentCount: number | null
  activeStudents: SchoolPortalStudent[]
  visibleStudents: SchoolPortalStudent[]
}

export interface SchoolPortalStudent {
  studentid: string
  surname: string
  firstname: string
  othername?: string
  picture?: string
  streamId?: string
  streamName?: string
  classId?: string
}

export interface ClassEntry {
  classid: string
  classname: string
}

export interface ExcelCandidate {
  candidateid?: string | null
  lastName: string
  firstName: string
  otherName?: string | null
}

export interface SubClass {
  classarmid: string
  classarmname: string
}

export type SubjectWithQuestionCount = Array<Subject & { questionCount: number }>

export const IMPORT_VALUES = [
  { key: 'classId', label: 'Class ID' },
] as const
export type ImportValueKey = typeof IMPORT_VALUES[number]['key']

export type StepStatus = 'locked' | 'idle' | 'loading' | 'done' | 'error'
