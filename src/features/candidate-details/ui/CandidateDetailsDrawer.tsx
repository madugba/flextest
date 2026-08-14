'use client'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet'
import { Alert } from '@/shared/ui/Alert'
import { useCandidateDetails } from '../model/useCandidateDetails'
import { CandidateIdentitySection } from './CandidateIdentitySection'
import { ContactInformationSection } from './ContactInformationSection'
import { PersonalDetailsSection } from './PersonalDetailsSection'
import { SessionInformationSection } from './SessionInformationSection'
import { RegisteredSubjectsSection } from './RegisteredSubjectsSection'
import { AccountStatusSection } from './AccountStatusSection'
import { TimestampsSection } from './TimestampsSection'

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
              <CandidateIdentitySection candidate={candidate} />
              <ContactInformationSection candidate={candidate} />
              <PersonalDetailsSection candidate={candidate} />
              <SessionInformationSection candidate={candidate} />
              <RegisteredSubjectsSection candidate={candidate} />
              <AccountStatusSection candidate={candidate} />
              <TimestampsSection candidate={candidate} />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
