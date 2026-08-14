import { Text, View } from '@react-pdf/renderer'
import { styles } from './reportPdfStyles'
import type { ExamSession } from '@/entities/exam-session'

interface PDFHeaderProps {
  session: ExamSession
}

export function PDFHeader({ session }: PDFHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>FlexTest - Exam Report</Text>
      <Text style={styles.subtitle}>{session.name}</Text>
    </View>
  )
}
