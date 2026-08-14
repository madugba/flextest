'use client'

import { useResetSessionsState } from '../model/state/useResetSessionsState'
import { ResetSessionsHeader } from './ResetSessionsHeader'
import { ResetSessionsWarningBox } from './ResetSessionsWarningBox'
import { ResetSessionsOptions } from './ResetSessionsOptions'
import { ResetSessionsConfirmationInput } from './ResetSessionsConfirmationInput'
import { ResetSessionsFooter } from './ResetSessionsFooter'

interface ResetSessionsModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ResetSessionsModal({ isOpen, onClose, onConfirm }: ResetSessionsModalProps) {
  const {
    confirmationPhrase,
    setConfirmationPhrase,
    isAcknowledged,
    setIsAcknowledged,
    includeStudents,
    setIncludeStudents,
    isLoading,
    isDeleting,
    dataCounts,
    timeLeft,
    requiredPhrase,
    isPhraseValid,
    canConfirm,
    handleConfirm,
  } = useResetSessionsState({ isOpen, onClose, onConfirm })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg mx-4">
        <div className="bg-white rounded-lg shadow-xl">
          <ResetSessionsHeader timeLeft={timeLeft} />

          <div className="px-6 py-4">
            {isLoading ? (
              <div className="text-center py-4">Loading data counts...</div>
            ) : dataCounts ? (
              <div className="space-y-4">
                <ResetSessionsWarningBox
                  dataCounts={dataCounts}
                  includeStudents={includeStudents}
                />
                <ResetSessionsOptions
                  includeStudents={includeStudents}
                  onIncludeStudentsChange={setIncludeStudents}
                  isAcknowledged={isAcknowledged}
                  onAcknowledgedChange={setIsAcknowledged}
                />
                <ResetSessionsConfirmationInput
                  confirmationPhrase={confirmationPhrase}
                  onPhraseChange={setConfirmationPhrase}
                  isPhraseValid={isPhraseValid}
                  requiredPhrase={requiredPhrase}
                  disabled={isDeleting}
                />
              </div>
            ) : (
              <div className="text-center py-4 text-red-600">Failed to load data information</div>
            )}
          </div>

          <ResetSessionsFooter
            isDeleting={isDeleting}
            canConfirm={canConfirm}
            onCancel={onClose}
            onConfirm={handleConfirm}
          />
        </div>
      </div>
    </div>
  )
}
