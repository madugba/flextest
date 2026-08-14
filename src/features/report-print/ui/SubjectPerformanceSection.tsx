import { Text, View } from '@react-pdf/renderer'
import { styles } from './reportPdfStyles'
import type { SessionAnalysis } from '@/entities/exam-session'

interface SubjectPerformanceSectionProps {
  analysis: SessionAnalysis
}

export function SubjectPerformanceSection({ analysis }: SubjectPerformanceSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Subject-wise Performance</Text>
      <View style={styles.table}>
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.tableCell, { width: '40%' }]}>Subject</Text>
          <Text style={[styles.tableCell, { width: '30%', textAlign: 'right' }]}>Avg Score</Text>
          <Text style={[styles.tableCell, { width: '30%', textAlign: 'right' }]}>Attempted</Text>
        </View>
        {analysis.subjectWisePerformance.map((subject) => (
          <View key={subject.subjectId} style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: '40%' }]}>{subject.subjectName}</Text>
            <Text style={[styles.tableCell, { width: '30%', textAlign: 'right' }]}>
              {subject.avgScore.toFixed(1)}%
            </Text>
            <Text style={[styles.tableCell, { width: '30%', textAlign: 'right' }]}>
              {subject.totalAttempted}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}
