'use client'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet'
import { Alert } from '@/shared/ui/Alert'
import { Badge } from '@/shared/ui/Badge'
import { useCandidateDetails } from '../model/useCandidateDetails'
import {
  getCandidateFullName,
  getCandidateStatusLabel,
  getCandidateSessionName,
  getCandidateCenterName,
  formatCandidateLastLogin,
} from '@/entities/candidate'

interface CandidateDetailsDrawerProps {
  children: (props: { onViewDetails: (id: string) => void }) => React.ReactNode
}

export function CandidateDetailsDrawer({ children }: CandidateDetailsDrawerProps) {
  const { isOpen, isLoading, error, candidate, handleOpen, handleClose } = useCandidateDetails()

  return (
    <>
      {children({ onViewDetails: handleOpen })}
      <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Candidate Details</SheetTitle>
            <SheetDescription>View detailed information about this candidate</SheetDescription>
          </SheetHeader>

          {error && <Alert variant="destructive" className="mt-4">{error}</Alert>}

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {candidate && !isLoading && (
            <div className="mt-6 space-y-4">
              {/* Passport Photo & ID */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
                <div className="flex items-center gap-4">
                  {candidate.picture ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={candidate.picture}
                      alt={getCandidateFullName(candidate)}
                      className="w-20 h-20 rounded-lg object-cover border-2 border-white shadow-sm"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-primary/10 flex items-center justify-center border-2 border-white shadow-sm">
                      <span className="text-2xl font-bold text-primary">
                        {candidate.firstname?.charAt(0) || candidate.firstName?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-900">{getCandidateFullName(candidate)}</h2>
                    <p className="text-sm text-gray-600 font-mono">{candidate.id}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={candidate.status === 'APPROVED' ? 'default' : 'secondary'}>
                        {getCandidateStatusLabel(candidate.status)}
                      </Badge>
                      <Badge variant={candidate.isActive ? 'default' : 'destructive'}>
                        {candidate.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Email Address</span>
                    <span className="text-sm font-medium text-gray-900">{candidate.email || 'Not provided'}</span>
                  </div>
                  {candidate.phone && (
                    <div>
                      <span className="text-xs text-gray-500 block mb-1">Phone Number</span>
                      <span className="text-sm font-medium text-gray-900">{candidate.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Personal Details */}
              {(candidate.surname || candidate.firstname) && (
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Personal Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {candidate.surname && (
                      <div>
                        <span className="text-xs text-gray-500 block mb-1">Surname</span>
                        <span className="text-sm font-medium text-gray-900">{candidate.surname}</span>
                      </div>
                    )}
                    {candidate.firstname && (
                      <div>
                        <span className="text-xs text-gray-500 block mb-1">First Name</span>
                        <span className="text-sm font-medium text-gray-900">{candidate.firstname}</span>
                      </div>
                    )}
                    {candidate.othername && (
                      <div className="col-span-2">
                        <span className="text-xs text-gray-500 block mb-1">Other Name</span>
                        <span className="text-sm font-medium text-gray-900">{candidate.othername}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Session Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Exam Session
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Session</span>
                    <span className="text-sm font-medium text-gray-900">{getCandidateSessionName(candidate)}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Center</span>
                    <span className="text-sm font-medium text-gray-900">{getCandidateCenterName(candidate)}</span>
                  </div>
                  {candidate.seatNumber && (
                    <div>
                      <span className="text-xs text-gray-500 block mb-1">Seat Number</span>
                      <span className="text-sm font-medium text-gray-900">{candidate.seatNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Registered Subjects */}
              {candidate.subjectCombinations && candidate.subjectCombinations.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Registered Subjects ({candidate.subjectCombinations.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.subjectCombinations.map((combo) => (
                      <Badge key={combo.id} variant="outline" className="px-3 py-1.5">
                        {combo.subject.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Account Status */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Account Status
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Verified</span>
                    <Badge variant={candidate.isVerified ? 'default' : 'secondary'} className="mt-1">
                      {candidate.isVerified ? 'Verified' : 'Not Verified'}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Last Login</span>
                    <span className="text-sm font-medium text-gray-900">{formatCandidateLastLogin(candidate)}</span>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500 block mb-1">Created</span>
                    <span className="font-medium text-gray-700">
                      {new Date(candidate.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Updated</span>
                    <span className="font-medium text-gray-700">
                      {new Date(candidate.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
