import { SessionScoresPage } from '@/views/session-scores'

interface ViewScoresPageProps {
  params: Promise<{
    sessionId: string
  }>
}

export default async function ViewScoresPage({ params }: ViewScoresPageProps) {
  const { sessionId } = await params
  return <SessionScoresPage sessionId={sessionId} />
}

export const metadata = {
  title: 'Session Scores | FlexTest Admin',
  description: 'View detailed scores per candidate per subject',
}

