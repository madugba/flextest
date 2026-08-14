import { Text, View } from '@react-pdf/renderer'
import { styles } from './reportPdfStyles'
import type { ExamSession } from '@/entities/exam-session'

interface SessionInfoSectionProps {
  session: ExamSession
}

export function SessionInfoSection({ session }: SessionInfoSectionProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Session Information</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{formatDate(session.date)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Time:</Text>
        <Text style={styles.value}>{session.time}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Duration:</Text>
        <Text style={styles.value}>{session.duration} minutes</Text>
      </View>
      {session.center && (
        <View style={styles.row}>
          <Text style={styles.label}>Center:</Text>
          <Text style={styles.value}>{session.center.centerName}, {session.center.state}</Text>
        </View>
      )}
    </View>
  )
}
