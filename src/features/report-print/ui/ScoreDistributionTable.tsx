import { Text, View } from '@react-pdf/renderer'
import { styles } from './reportPdfStyles'
import type { SessionAnalysis } from '@/entities/exam-session'

interface ScoreDistributionTableProps {
  analysis: SessionAnalysis
}

export function ScoreDistributionTable({ analysis }: ScoreDistributionTableProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Score Distribution</Text>
      <View style={styles.table}>
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.tableCell, { width: '40%' }]}>Score Range</Text>
          <Text style={[styles.tableCell, { width: '30%', textAlign: 'right' }]}>Candidates</Text>
          <Text style={[styles.tableCell, { width: '30%', textAlign: 'right' }]}>Percentage</Text>
        </View>
        {analysis.scoreDistribution.map((bucket) => (
          <View key={bucket.range} style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: '40%' }]}>{bucket.range}</Text>
            <Text style={[styles.tableCell, { width: '30%', textAlign: 'right' }]}>{bucket.count}</Text>
            <Text style={[styles.tableCell, { width: '30%', textAlign: 'right' }]}>
              {bucket.percentage.toFixed(1)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}
