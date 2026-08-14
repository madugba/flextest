import type { ScoreConfiguration } from '@/entities/score-configuration'

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
          <div key={config.id} className="border rounded-lg p-4 mb-4 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-900">{config.name}</h4>
                  {config.isActive ? (
                    <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                      Inactive
                    </span>
                  )}
                  <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                    {config.scoringType}
                  </span>
                  {config.negativeMarking && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded">
                      Negative Marking: {config.negativeMarkValue}
                    </span>
                  )}
                </div>
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

              <div className="ml-4 flex gap-2">
                {!config.isActive && (
                  <button
                    onClick={() => handleActivateScore(config.id)}
                    disabled={isActivatingScore}
                    className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded"
                  >
                    Activate
                  </button>
                )}
                <button
                  onClick={() => handleEditScore(config)}
                  className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteScore(config.id)}
                  disabled={config.isActive || isDeletingScore}
                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded disabled:text-gray-400 disabled:hover:bg-transparent"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
