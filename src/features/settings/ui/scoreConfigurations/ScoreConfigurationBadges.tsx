import type { ScoreConfiguration } from '@/entities/score-configuration'

interface ScoreConfigurationBadgesProps {
  config: ScoreConfiguration
}

export function ScoreConfigurationBadges({ config }: ScoreConfigurationBadgesProps) {
  return (
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
  )
}
