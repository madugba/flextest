import { Document, Page } from '@react-pdf/renderer'
import { styles } from './reportPdfStyles'
import { PDFHeader } from './PDFHeader'
import { SessionInfoSection } from './SessionInfoSection'
import { StatisticsSection } from './StatisticsSection'
import { ScoreDistributionTable } from './ScoreDistributionTable'
import { TopScorersSection } from './TopScorersSection'
import { SubjectPerformanceSection } from './SubjectPerformanceSection'
import { PDFFooter } from './PDFFooter'
import type { ExamSession, SessionAnalysis } from '@/entities/exam-session'

interface ReportPDFProps {
  session: ExamSession
  analysis: SessionAnalysis
}

export function SessionReportPDF({ session, analysis }: ReportPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <PDFHeader session={session} />
        <SessionInfoSection session={session} />
        <StatisticsSection analysis={analysis} />
        <ScoreDistributionTable analysis={analysis} />
        {analysis.topScorers.length > 0 && <TopScorersSection analysis={analysis} />}
        {analysis.subjectWisePerformance.length > 0 && (
          <SubjectPerformanceSection analysis={analysis} />
        )}
        <PDFFooter />
      </Page>
    </Document>
  )
}
