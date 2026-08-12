import { Button } from '@/shared/ui/Button'

interface SetupNavigationProps {
  currentStep: number
  isSubmitting: boolean
  centerFormValid: boolean
  adminFormValid: boolean
  onBack: () => void
  onNext: () => void
  onSubmit: () => void
}

export function SetupNavigation({
  currentStep,
  isSubmitting,
  centerFormValid,
  adminFormValid,
  onBack,
  onNext,
  onSubmit,
}: SetupNavigationProps) {
  return (
    <div className="flex gap-4 pt-6 mt-6 border-t">
      <Button
        type="button"
        onClick={onBack}
        variant="outline"
        className="flex-1 h-12"
      >
        Back
      </Button>
      {currentStep < 3 ? (
        <Button
          type="button"
          onClick={onNext}
          disabled={
            (currentStep === 1 && !centerFormValid) ||
            (currentStep === 2 && !adminFormValid)
          }
          className="flex-1 h-12"
        >
          Continue
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-1 h-12"
        >
          {isSubmitting ? 'Submitting...' : 'Submit & Complete'}
        </Button>
      )}
    </div>
  )
}
