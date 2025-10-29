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
            <div className="mt-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase">Basic Information</h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Full Name</span>
                    <span className="text-sm font-medium">{getCandidateFullName(candidate)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Email</span>
                    <span className="text-sm font-medium">{candidate.email}</span>
                  </div>

                  {candidate.phone && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Phone</span>
                      <span className="text-sm font-medium">{candidate.phone}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={candidate.status === 'APPROVED' ? 'default' : 'secondary'}>
                      {getCandidateStatusLabel(candidate.status)}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active</span>
                    <Badge variant={candidate.isActive ? 'default' : 'destructive'}>
                      {candidate.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Verified</span>
                    <Badge variant={candidate.isVerified ? 'default' : 'secondary'}>
                      {candidate.isVerified ? 'Verified' : 'Not Verified'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Session Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase">Session Information</h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Session</span>
                    <span className="text-sm font-medium">{getCandidateSessionName(candidate)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Center</span>
                    <span className="text-sm font-medium">{getCandidateCenterName(candidate)}</span>
                  </div>
                </div>
              </div>

              {/* Exam-related fields (if available) */}
              {(candidate.surname || candidate.firstname) && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase">Exam Registration</h3>

                  <div className="space-y-2">
                    {candidate.surname && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Surname</span>
                        <span className="text-sm font-medium">{candidate.surname}</span>
                      </div>
                    )}

                    {candidate.firstname && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">First Name</span>
                        <span className="text-sm font-medium">{candidate.firstname}</span>
                      </div>
                    )}

                    {candidate.othername && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Other Name</span>
                        <span className="text-sm font-medium">{candidate.othername}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Activity */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase">Activity</h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Login</span>
                    <span className="text-sm font-medium">{formatCandidateLastLogin(candidate)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Created</span>
                    <span className="text-sm font-medium">
                      {new Date(candidate.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Updated</span>
                    <span className="text-sm font-medium">
                      {new Date(candidate.updatedAt).toLocaleDateString()}
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
