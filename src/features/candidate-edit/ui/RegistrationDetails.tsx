import { Badge } from '@/shared/ui/Badge'
import type { Candidate } from '@/entities/candidate'

interface RegistrationDetailsProps {
  candidate: Candidate
}

export function RegistrationDetails({ candidate }: RegistrationDetailsProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Registration Details (Read-only)</h3>
      <div className="grid grid-cols-2 gap-3 text-sm">
        {candidate.surname && (
          <div>
            <span className="text-gray-500">Surname:</span>{' '}
            <span className="font-medium">{candidate.surname}</span>
          </div>
        )}
        {candidate.firstname && (
          <div>
            <span className="text-gray-500">First Name:</span>{' '}
            <span className="font-medium">{candidate.firstname}</span>
          </div>
        )}
        {candidate.othername && (
          <div className="col-span-2">
            <span className="text-gray-500">Other Name:</span>{' '}
            <span className="font-medium">{candidate.othername}</span>
          </div>
        )}
        {candidate.session && (
          <div className="col-span-2">
            <span className="text-gray-500">Exam Session:</span>{' '}
            <span className="font-medium">{candidate.session.name}</span>
          </div>
        )}
        {candidate.seatNumber && (
          <div>
            <span className="text-gray-500">Seat Number:</span>{' '}
            <span className="font-medium">{candidate.seatNumber}</span>
          </div>
        )}
        {candidate.subjectCombinations && candidate.subjectCombinations.length > 0 && (
          <div className="col-span-2">
            <span className="text-gray-500">Subjects:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {candidate.subjectCombinations.map(combo => (
                <Badge key={combo.id} variant="outline" className="text-xs">
                  {combo.subject.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
