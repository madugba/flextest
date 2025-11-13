'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { completeOnboarding } from '@/shared/api/onboardingApi'
import { clearCenterCache } from '@/shared/lib'
import { Button } from '@/shared/ui/Button'

interface CenterData {
  centerName: string
  address: string
  phone: string
  email: string
  state: string
  lga: string
}

interface AdminData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

const steps = [
  { number: 1, title: 'Center Details' },
  { number: 2, title: 'Admin Information' },
  { number: 3, title: 'Preview & Submit' },
]

export default function OnboardingSetupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [centerData, setCenterData] = useState<CenterData>({
    centerName: '',
    address: '',
    phone: '',
    email: '',
    state: '',
    lga: '',
  })

  const [adminData, setAdminData] = useState<AdminData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleCenterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCenterData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const isCenterFormValid = Object.values(centerData).every(
    (value) => value.trim() !== ''
  )

  const isAdminFormValid =
    Object.values(adminData).every((value) => value.trim() !== '') &&
    adminData.password === adminData.confirmPassword &&
    adminData.password.length >= 8

  const handleNext = () => {
    if (currentStep === 1 && !isCenterFormValid) return
    if (currentStep === 2 && !isAdminFormValid) return
    setCurrentStep((prev) => Math.min(prev + 1, 3))
  }

  const handleBack = () => {
    if (currentStep === 1) {
      router.push('/onboarding')
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 1))
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError('')

    try {
      await completeOnboarding({
        centerName: centerData.centerName,
        address: centerData.address,
        phone: centerData.phone,
        email: centerData.email,
        state: centerData.state,
        lga: centerData.lga,
        adminFirstName: adminData.firstName,
        adminLastName: adminData.lastName,
        adminEmail: adminData.email,
        adminPassword: adminData.password,
      })

      clearCenterCache()
      router.push('/login')
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to complete setup'
      )
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Step Indicator */}
        <div className="mb-8 px-4">
          <div className="flex items-start justify-between relative">
            {/* Connector line background */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-300 rounded" style={{ zIndex: 0 }} />
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
                    currentStep >= step.number
                      ? 'text-primary'
                      : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Step 1: Center Details */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Configure Center Details
              </h2>
              <p className="text-gray-600 mb-6">
                Please provide your examination center information
              </p>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Center Name *
                  </label>
                  <input
                    type="text"
                    name="centerName"
                    value={centerData.centerName}
                    onChange={handleCenterChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    placeholder="Enter center name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={centerData.email}
                    onChange={handleCenterChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    placeholder="center@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={centerData.phone}
                    onChange={handleCenterChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    placeholder="+234 xxx xxxx xxx"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={centerData.address}
                    onChange={handleCenterChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    placeholder="Enter center address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={centerData.state}
                      onChange={handleCenterChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      placeholder="State"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LGA *
                    </label>
                    <input
                      type="text"
                      name="lga"
                      value={centerData.lga}
                      onChange={handleCenterChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      placeholder="Local Government Area"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Admin Information */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Configure Admin Information
              </h2>
              <p className="text-gray-600 mb-6">
                Create your administrator account
              </p>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={adminData.firstName}
                      onChange={handleAdminChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      placeholder="First name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={adminData.lastName}
                      onChange={handleAdminChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={adminData.email}
                    onChange={handleAdminChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    placeholder="admin@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={adminData.password}
                    onChange={handleAdminChange}
                    required
                    minLength={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    placeholder="Minimum 8 characters"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 8 characters long
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={adminData.confirmPassword}
                    onChange={handleAdminChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    placeholder="Confirm your password"
                  />
                  {adminData.confirmPassword &&
                    adminData.password !== adminData.confirmPassword && (
                      <p className="text-xs text-red-600 mt-1">
                        Passwords do not match
                      </p>
                    )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Preview & Submit */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Review Your Information
              </h2>
              <p className="text-gray-600 mb-6">
                Please verify all details before submission
              </p>

              <div className="space-y-6">
                {/* Center Details Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b">
                    Center Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        Center Name
                      </span>
                      <span className="text-sm text-gray-900">
                        {centerData.centerName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        Email
                      </span>
                      <span className="text-sm text-gray-900">
                        {centerData.email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        Phone
                      </span>
                      <span className="text-sm text-gray-900">
                        {centerData.phone}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        Address
                      </span>
                      <span className="text-sm text-gray-900 text-right max-w-xs">
                        {centerData.address}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        State
                      </span>
                      <span className="text-sm text-gray-900">
                        {centerData.state}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        LGA
                      </span>
                      <span className="text-sm text-gray-900">
                        {centerData.lga}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Admin Information Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b">
                    Administrator Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        Name
                      </span>
                      <span className="text-sm text-gray-900">
                        {adminData.firstName} {adminData.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        Email
                      </span>
                      <span className="text-sm text-gray-900">
                        {adminData.email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        Password
                      </span>
                      <span className="text-sm text-gray-900">••••••••</span>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 pt-6 mt-6 border-t">
            <Button
              type="button"
              onClick={handleBack}
              variant="outline"
              className="flex-1 h-12"
            >
              Back
            </Button>
            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !isCenterFormValid) ||
                  (currentStep === 2 && !isAdminFormValid)
                }
                className="flex-1 h-12"
              >
                Continue
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 h-12"
              >
                {isSubmitting ? 'Submitting...' : 'Submit & Complete'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
