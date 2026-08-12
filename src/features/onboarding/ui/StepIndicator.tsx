import type { OnboardingStep } from '../model/types'

interface StepIndicatorProps {
  currentStep: number
  steps: OnboardingStep[]
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="mb-8 px-4">
      <div className="flex items-start justify-between relative">
        {/* Connector line background */}
        <div
          className="absolute top-5 left-0 right-0 h-1 bg-gray-300 rounded"
          style={{ zIndex: 0 }}
        />
        <div
          className="absolute top-5 left-0 h-1 bg-primary rounded transition-all duration-300"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            zIndex: 0,
          }}
        />

        {/* Steps */}
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex flex-col items-center relative"
            style={{ flex: 1, zIndex: 1 }}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                currentStep >= step.number
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white border-2 border-gray-300 text-gray-600'
              }`}
            >
              {step.number}
            </div>
            <span
              className={`mt-3 text-xs font-medium text-center transition-colors duration-300 ${
                currentStep >= step.number ? 'text-primary' : 'text-gray-500'
              }`}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
