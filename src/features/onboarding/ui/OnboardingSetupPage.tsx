'use client'

import { useOnboardingSetupPage } from '../model/useOnboardingSetupPage'
import { AdminInfoStep } from './AdminInfoStep'
import { CenterDetailsStep } from './CenterDetailsStep'
import { SetupNavigation } from './SetupNavigation'
import { SetupPreviewStep } from './SetupPreviewStep'
import { StepIndicator } from './StepIndicator'

export function OnboardingSetupPage() {
  const {
    currentStep,
    isSubmitting,
    error,
    centerData,
    adminData,
    handleCenterChange,
    handleAdminChange,
    centerFormValid,
    adminFormValid,
    handleNext,
    handleBack,
    handleSubmit,
    steps,
  } = useOnboardingSetupPage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} steps={steps} />

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Step 1: Center Details */}
          {currentStep === 1 && (
            <CenterDetailsStep centerData={centerData} onChange={handleCenterChange} />
          )}

          {/* Step 2: Admin Information */}
          {currentStep === 2 && (
            <AdminInfoStep adminData={adminData} onChange={handleAdminChange} />
          )}

          {/* Step 3: Preview & Submit */}
          {currentStep === 3 && (
            <SetupPreviewStep
              centerData={centerData}
              adminData={adminData}
              error={error}
            />
          )}

          {/* Navigation Buttons */}
          <SetupNavigation
            currentStep={currentStep}
            isSubmitting={isSubmitting}
            centerFormValid={centerFormValid}
            adminFormValid={adminFormValid}
            onBack={handleBack}
            onNext={handleNext}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  )
}
