import { Text, View } from '@react-pdf/renderer'
import { styles } from './scoresPdfStyles'

interface ScoreConfigSectionProps {
  scoreConfig: {
    name: string
    formula: string
    scoringType: string
  }
}

export function ScoreConfigSection({ scoreConfig }: ScoreConfigSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.infoBox}>
        <Text style={[styles.sectionTitle, { marginBottom: 5 }]}>Score Configuration</Text>
        <Text style={styles.infoText}>
          <Text style={{ fontWeight: 'bold' }}>Name:</Text> {scoreConfig.name}
        </Text>
        <Text style={styles.infoText}>
          <Text style={{ fontWeight: 'bold' }}>Type:</Text> {scoreConfig.scoringType}
        </Text>
        <Text style={styles.infoText}>
          <Text style={{ fontWeight: 'bold' }}>Formula:</Text> {scoreConfig.formula}
        </Text>
        <Text style={[styles.infoText, { fontSize: 7, marginTop: 5 }]}>
          Each subject cell shows: Attempted (X/Y), Correct count, and calculated Score
        </Text>
      </View>
    </View>
  )
}
