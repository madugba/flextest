import type { ScoreConfiguration } from '@/entities/score-configuration'
import { ScoreConfigurationActions } from './ScoreConfigurationActions'
import { ScoreConfigurationBadges } from './ScoreConfigurationBadges'

interface ScoreConfigurationRowProps {
  config: ScoreConfiguration
  isActivatingScore: boolean
  isDeletingScore: boolean
  handleEditScore: (config: ScoreConfiguration) => void
  handleDeleteScore: (id: string) => void
  handleActivateScore: (id: string) => void
}

export function ScoreConfigurationRow({
  config,
  isActivatingScore,
  isDeletingScore,
  handleEditScore,
  handleDeleteScore,
  handleActivateScore,
}: ScoreConfigurationRowProps) {
  return (
    <div className="border rounded-lg p-4 mb-4 hover:bg-gray-50">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <ScoreConfigurationBadges config={config} />
          {config.description && (
            <p className="text-sm text-gray-600 mt-1">{config.description}</p>
          )}
          <div className="mt-2">
            <p className="text-sm">
              <strong>Formula:</strong>{' '}
              <code className="bg-gray-100 px-2 py-0.5 rounded">{config.formula}</code>
            </p>
            {config.passingScore && (
              <p className="text-sm mt-1">
                <strong>Passing Score:</strong> {config.passingScore}
                {config.maxScore && ` / ${config.maxScore}`}
              </p>
            )}
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Created: {new Date(config.createdAt).toLocaleDateString()}
          </div>
        </div>

        <ScoreConfigurationActions
          config={config}
          isActivatingScore={isActivatingScore}
          isDeletingScore={isDeletingScore}
          handleEditScore={handleEditScore}
          handleDeleteScore={handleDeleteScore}
          handleActivateScore={handleActivateScore}
        />
      </div>
    </div>
  )
}
