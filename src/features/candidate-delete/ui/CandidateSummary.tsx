interface CandidateSummaryProps {
  fullName: string
  email: string
}

export function CandidateSummary({ fullName, email }: CandidateSummaryProps) {
  return (
    <div className="rounded-md bg-muted p-4">
      <p className="text-sm font-medium">{fullName}</p>
      <p className="text-sm text-muted-foreground">{email}</p>
    </div>
  )
}
