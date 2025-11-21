import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { ExamSession, SessionAnalysis } from '@/entities/exam-session'

interface ReportPDFProps {
  session: ExamSession
  analysis: SessionAnalysis
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
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
    fontSize: 10,
  },
  value: {
    color: '#1f2937',
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  statCard: {
    width: '48%',
    padding: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 3,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  table: {
    width: '100%',
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #e5e7eb',
    paddingVertical: 6,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingVertical: 8,
    fontWeight: 'bold',
  },
  tableCell: {
    fontSize: 9,
    padding: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#9ca3af',
    borderTop: '1 solid #e5e7eb',
    paddingTop: 10,
  },
})

export function SessionReportPDF({ session, analysis }: ReportPDFProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>FlexTest - Exam Report</Text>
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
              <Text style={styles.value}>{session.center.centerName}, {session.center.state}</Text>
            </View>
          )}
        </View>

        {/* Statistics Summary */}
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

        {/* Score Distribution */}
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

        {/* Top Scorers */}
        {analysis.topScorers.length > 0 && (
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
        )}

        {/* Subject Performance */}
        {analysis.subjectWisePerformance.length > 0 && (
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
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
        </Text>
      </Page>
    </Document>
  )
}

