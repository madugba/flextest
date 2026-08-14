import type { ScoreConfiguration } from '@/entities/score-configuration'
import { ScoreConfigurationRow } from './ScoreConfigurationRow'

interface ScoreConfigurationListProps {
  scoreConfigurations: ScoreConfiguration[]
  isLoadingScores: boolean
  scoreError: string | null
  isActivatingScore: boolean
  isDeletingScore: boolean
  handleEditScore: (config: ScoreConfiguration) => void
  handleDeleteScore: (id: string) => void
  handleActivateScore: (id: string) => void
}

export function ScoreConfigurationList({
  scoreConfigurations,
  isLoadingScores,
  scoreError,
  isActivatingScore,
  isDeletingScore,
  handleEditScore,
  handleDeleteScore,
  handleActivateScore,
}: ScoreConfigurationListProps) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Existing Score Configurations</h3>
      {isLoadingScores ? (
        <div className="text-center py-4">Loading configurations...</div>
      ) : scoreError ? (
        <div className="text-center py-4 text-red-600">Error loading configurations</div>
      ) : scoreConfigurations.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No configurations created yet</p>
      ) : (
        scoreConfigurations.map((config) => (
          <ScoreConfigurationRow
            key={config.id}
            config={config}
            isActivatingScore={isActivatingScore}
            isDeletingScore={isDeletingScore}
            handleEditScore={handleEditScore}
            handleDeleteScore={handleDeleteScore}
            handleActivateScore={handleActivateScore}
          />
        ))
      )}
    </div>
  )
}
