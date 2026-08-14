import { Text, View } from '@react-pdf/renderer'
import { styles } from './scoresPdfStyles'
import type { SessionScores } from '@/entities/exam-session'

interface ScoresTableProps {
  scores: SessionScores
}

export function ScoresTable({ scores }: ScoresTableProps) {
  const allSubjects = new Map<string, string>()
  scores.candidates.forEach((candidate) => {
    candidate.subjects.forEach((subject) => {
      if (!allSubjects.has(subject.subjectId)) {
        allSubjects.set(subject.subjectId, subject.subjectName)
      }
    })
  })

  const subjectArray = Array.from(allSubjects.entries())

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Candidate Scores</Text>
      <View style={styles.table}>
        <View style={styles.tableHeaderRow}>
          <View style={[styles.tableCell, styles.candidateCell]}>
            <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Candidate</Text>
          </View>
          {subjectArray.map(([subjectId, subjectName]) => (
            <View key={subjectId} style={[styles.tableCell, styles.subjectCell]}>
              <Text style={{ fontSize: 9, fontWeight: 'bold', textAlign: 'left' }}>
                {subjectName}
              </Text>
            </View>
          ))}
          <View style={[styles.tableCell, styles.totalCell]}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', textAlign: 'right' }}>Total</Text>
          </View>
        </View>

        {scores.candidates.map((candidate) => {
          const subjectScoreMap = new Map(candidate.subjects.map((s) => [s.subjectId, s]))

          return (
            <View key={candidate.candidateId} style={styles.tableRow}>
              <View style={[styles.tableCell, styles.candidateCell]}>
                <Text style={{ fontSize: 9, fontWeight: 'bold' }}>
                  {candidate.candidateName}
                </Text>
              </View>
              {subjectArray.map(([subjectId]) => {
                const subjectScore = subjectScoreMap.get(subjectId)
                return (
                  <View key={subjectId} style={[styles.tableCell, styles.subjectCell]}>
                    {subjectScore ? (
                      <View style={styles.subjectCellContent}>
                        <Text style={[styles.subjectCellLabel, { textAlign: 'left' }]}>
                          Attempted: {subjectScore.correctAnswers + subjectScore.wrongAnswers}/
                          {subjectScore.totalQuestions}
                        </Text>
                        <Text style={[styles.subjectCellLabel, { textAlign: 'left' }]}>
                          Correct: {subjectScore.correctAnswers}
                        </Text>
                        <Text style={[styles.subjectCellValue, { textAlign: 'left' }]}>
                          Score: {subjectScore.score.toFixed(2)}
                        </Text>
                      </View>
                    ) : (
                      <Text style={{ fontSize: 9, color: '#9ca3af', textAlign: 'left' }}>
                        -
                      </Text>
                    )}
                  </View>
                )
              })}
              <View style={[styles.tableCell, styles.totalCell]}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', textAlign: 'right' }}>
                  {candidate.totalScore.toFixed(2)}
                </Text>
              </View>
            </View>
          )
        })}
      </View>
    </View>
  )
}
