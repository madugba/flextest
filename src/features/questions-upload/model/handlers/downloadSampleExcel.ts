import { toast } from 'sonner'
import { downloadSampleQuestionWorkbook } from '../../lib/question-excel'

export function downloadSampleExcel(): void {
  downloadSampleQuestionWorkbook()
  toast.success('Sample file downloaded!')
}
