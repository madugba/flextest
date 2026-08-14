import { Text, View } from '@react-pdf/renderer'
import { styles } from './scoresPdfStyles'
import type { ExamSession } from '@/entities/exam-session'

interface PDFHeaderProps {
  session: ExamSession
}

export function PDFHeader({ session }: PDFHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>FlexTest - Session Scores</Text>
      <Text style={styles.subtitle}>{session.name}</Text>
    </View>
  )
}
