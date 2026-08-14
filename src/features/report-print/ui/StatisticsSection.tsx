import { Text, View } from '@react-pdf/renderer'
import { styles } from './reportPdfStyles'
import type { SessionAnalysis } from '@/entities/exam-session'

interface StatisticsSectionProps {
  analysis: SessionAnalysis
}

export function StatisticsSection({ analysis }: StatisticsSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Statistics Summary</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Candidates</Text>
          <Text style={styles.statValue}>{analysis.totalCandidates}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Submitted</Text>
          <Text style={styles.statValue}>{analysis.submittedCount}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Passed</Text>
          <Text style={[styles.statValue, { color: '#10b981' }]}>{analysis.passingTrend.pass}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Failed</Text>
          <Text style={[styles.statValue, { color: '#ef4444' }]}>{analysis.passingTrend.fail}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Pass Rate:</Text>
        <Text style={[styles.value, { color: '#10b981' }]}>
          {analysis.passingTrend.passPercentage.toFixed(1)}%
        </Text>
      </View>
    </View>
  )
}
