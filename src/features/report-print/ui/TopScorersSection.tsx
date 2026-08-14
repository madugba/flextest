import { Text, View } from '@react-pdf/renderer'
import { styles } from './reportPdfStyles'
import type { SessionAnalysis } from '@/entities/exam-session'

interface TopScorersSectionProps {
  analysis: SessionAnalysis
}

export function TopScorersSection({ analysis }: TopScorersSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Top Scorers</Text>
      <View style={styles.table}>
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.tableCell, { width: '10%' }]}>Rank</Text>
          <Text style={[styles.tableCell, { width: '50%' }]}>Name</Text>
          <Text style={[styles.tableCell, { width: '40%', textAlign: 'right' }]}>Score</Text>
        </View>
        {analysis.topScorers.map((scorer, index) => (
          <View key={scorer.candidateId} style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: '10%' }]}>{index + 1}</Text>
            <Text style={[styles.tableCell, { width: '50%' }]}>{scorer.candidateName}</Text>
            <Text style={[styles.tableCell, { width: '40%', textAlign: 'right', fontWeight: 'bold' }]}>
              {scorer.score}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}
