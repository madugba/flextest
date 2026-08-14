import { ShieldCheck, ShieldX } from 'lucide-react'

interface ImportValidationBannerProps {
  validCount: number
  invalidCount: number
}

export function ImportValidationBanner({ validCount, invalidCount }: ImportValidationBannerProps) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border text-sm ${
        invalidCount > 0 ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-green-50 border-green-200 text-green-800'
      }`}
    >
      {invalidCount > 0 ? (
        <ShieldX className="h-5 w-5 text-amber-500 shrink-0" />
      ) : (
        <ShieldCheck className="h-5 w-5 text-green-600 shrink-0" />
      )}
      <span>
        <strong>{validCount}</strong> valid &nbsp;·&nbsp;
        <strong>{invalidCount}</strong> invalid
        {invalidCount > 0 && ' — only valid questions will be imported'}
      </span>
    </div>
  )
}
