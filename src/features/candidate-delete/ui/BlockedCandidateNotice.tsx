import { ShieldAlert } from 'lucide-react'

interface BlockedCandidateNoticeProps {
  fullName: string
}

export function BlockedCandidateNotice({ fullName }: BlockedCandidateNoticeProps) {
  return (
    <div className="flex gap-2.5 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
      <ShieldAlert className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
      <p>
        <strong>{fullName}</strong> has an active or submitted exam session in the system
        and cannot be deleted. This includes sessions they may have been previously
        assigned to, even if they have since been re-assigned.
      </p>
    </div>
  )
}
