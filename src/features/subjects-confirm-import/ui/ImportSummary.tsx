interface ImportSummaryProps {
  total: number
  valid: number
}

export function ImportSummary({ total, valid }: ImportSummaryProps) {
  return (
    <p className="text-sm text-muted-foreground">
      Review and edit subject names before importing ({total} total, {valid} valid)
    </p>
  )
}
