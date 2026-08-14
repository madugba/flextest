import { Document, Page } from '@react-pdf/renderer'
import { styles } from './scoresPdfStyles'
import { PDFHeader } from './PDFHeader'
import { SessionInfoSection } from './SessionInfoSection'
import { ScoresTable } from './ScoresTable'
import { ScoreConfigSection } from './ScoreConfigSection'
import { PDFFooter } from './PDFFooter'
import type { ExamSession, SessionScores } from '@/entities/exam-session'

interface ScoresPDFProps {
  session: ExamSession
  scores: SessionScores
}

export function ScoresPDF({ session, scores }: ScoresPDFProps) {
  const scoreConfig =
    scores.candidates.length > 0 && scores.candidates[0].subjects.length > 0
      ? scores.candidates[0].subjects[0].scoreConfig
      : null

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <PDFHeader session={session} />
        <SessionInfoSection session={session} candidateCount={scores.candidates.length} />
        <ScoresTable scores={scores} />
        {scoreConfig && <ScoreConfigSection scoreConfig={scoreConfig} />}
        <PDFFooter />
      </Page>
    </Document>
  )
}
