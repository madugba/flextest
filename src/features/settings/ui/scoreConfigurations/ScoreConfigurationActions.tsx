import type { ScoreConfiguration } from '@/entities/score-configuration'

interface ScoreConfigurationActionsProps {
  config: ScoreConfiguration
  isActivatingScore: boolean
  isDeletingScore: boolean
  handleEditScore: (config: ScoreConfiguration) => void
  handleDeleteScore: (id: string) => void
  handleActivateScore: (id: string) => void
}

export function ScoreConfigurationActions({
  config,
  isActivatingScore,
  isDeletingScore,
  handleEditScore,
  handleDeleteScore,
  handleActivateScore,
}: ScoreConfigurationActionsProps) {
  return (
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
  )
}
