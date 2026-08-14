import { Text, View } from '@react-pdf/renderer'
import { styles } from './scoresPdfStyles'
import type { ExamSession } from '@/entities/exam-session'

interface SessionInfoSectionProps {
  session: ExamSession
  candidateCount: number
}

export function SessionInfoSection({ session, candidateCount }: SessionInfoSectionProps) {
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
          <Text style={styles.value}>
            {session.center.centerName}, {session.center.state}
          </Text>
        </View>
      )}
      <View style={styles.row}>
        <Text style={styles.label}>Total Candidates:</Text>
        <Text style={styles.value}>{candidateCount}</Text>
      </View>
    </View>
  )
}
