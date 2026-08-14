import { toast } from 'sonner'
import { downloadSampleQuestionWorkbook } from '../../lib/sample-workbook'

export function downloadSampleExcel(): void {
  downloadSampleQuestionWorkbook()
  toast.success('Sample file downloaded!')
}
