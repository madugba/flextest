import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { ExamSession, SessionScores } from '@/entities/exam-session'

interface ScoresPDFProps {
  session: ExamSession
  scores: SessionScores
}

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: '2 solid #3b82f6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    marginTop: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottom: '1 solid #e5e7eb',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    color: '#6b7280',
    fontSize: 9,
  },
  value: {
    color: '#1f2937',
    fontWeight: 'bold',
    fontSize: 9,
  },
  table: {
    width: '100%',
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #e5e7eb',
    paddingVertical: 8,
    minHeight: 40,
    alignItems: 'flex-start',
    width: '100%',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingVertical: 10,
    fontWeight: 'bold',
    alignItems: 'center',
    width: '100%',
  },
  tableCell: {
    padding: 6,
    fontSize: 9,
  },
  candidateCell: {
    padding: 6,
    fontSize: 9,
    fontWeight: 'bold',
    width: 120,
    minWidth: 120,
  },
  subjectCell: {
    padding: 6,
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    minWidth: 80,
  },
  subjectCellContent: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
  },
  subjectCellLabel: {
    fontSize: 8,
    color: '#6b7280',
    marginBottom: 3,
  },
  subjectCellValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  totalCell: {
    padding: 6,
    fontSize: 10,
    fontWeight: 'bold',
    width: 80,
    minWidth: 80,
    textAlign: 'right',
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    border: '1 solid #bfdbfe',
    borderRadius: 4,
    padding: 10,
    marginTop: 10,
  },
  infoText: {
    fontSize: 8,
    color: '#1e40af',
    marginBottom: 3,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    textAlign: 'center',
    fontSize: 8,
    color: '#9ca3af',
    borderTop: '1 solid #e5e7eb',
    paddingTop: 10,
  },
})

export function ScoresPDF({ session, scores }: ScoresPDFProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Get all unique subjects from all candidates
  const allSubjects = new Map<string, string>()
  scores.candidates.forEach((candidate) => {
    candidate.subjects.forEach((subject) => {
      if (!allSubjects.has(subject.subjectId)) {
        allSubjects.set(subject.subjectId, subject.subjectName)
      }
    })
  })

  const subjectArray = Array.from(allSubjects.entries())

  // Get score configuration info
  const scoreConfig =
    scores.candidates.length > 0 && scores.candidates[0].subjects.length > 0
      ? scores.candidates[0].subjects[0].scoreConfig
      : null

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>FlexTest - Session Scores</Text>
          <Text style={styles.subtitle}>{session.name}</Text>
        </View>

        {/* Session Information */}
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
            <Text style={styles.value}>{scores.candidates.length}</Text>
          </View>
        </View>

        {/* Scores Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Candidate Scores</Text>
          <View style={styles.table}>
            {/* Table Header */}
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

            {/* Table Rows */}
            {scores.candidates.map((candidate) => {
              const subjectScoreMap = new Map(
                candidate.subjects.map((s) => [s.subjectId, s])
              )

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

        {/* Score Configuration Info */}
        {scoreConfig && (
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
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
        </Text>
      </Page>
    </Document>
  )
}

