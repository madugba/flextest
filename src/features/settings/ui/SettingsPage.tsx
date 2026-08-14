'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { ResetSessionsModal } from '@/features/reset-sessions'
import { DashboardHeader } from '@/widgets/dashboard/ui/DashboardHeader'
import { useSettingsPage } from '../model/useSettingsPage'
import { APIConfigurationsSection } from './apiConfigurations/APIConfigurationsSection'
import { AIModelsSection } from './aiModels/AIModelsSection'
import { ScoreConfigurationsSection } from './scoreConfigurations/ScoreConfigurationsSection'
import { DangerZoneSection } from './DangerZoneSection'
import { HelpSection } from './HelpSection'

export function SettingsPage() {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const {
    loading,
    centers,
    reloadCenters,
    apiConfigurations,
    aiModels,
    scoreConfigurations,
  } = useSettingsPage()

  if (loading) {
    return (
      <div className="flex-1 overflow-auto">
        <DashboardHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <DashboardHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage system configurations and integrations
          </p>
        </div>

        {/* Settings Card */}
        <div className="bg-white rounded-lg shadow">
          <APIConfigurationsSection apiConfigurations={apiConfigurations} centers={centers} />
          <AIModelsSection aiModels={aiModels} centers={centers} />
        </div>

        <ScoreConfigurationsSection scoreConfigurations={scoreConfigurations} />

        <DangerZoneSection onReset={() => setIsResetModalOpen(true)} />
        <HelpSection />
      </div>

      {/* Reset Sessions Modal */}
      <ResetSessionsModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={() => {
          apiConfigurations.reload()
          reloadCenters()
          aiModels.reload()
          scoreConfigurations.reload()
          toast.success('All sessions have been reset successfully')
        }}
      />
    </div>
  )
}
