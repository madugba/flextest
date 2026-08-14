import type { APIConfiguration } from '@/entities/api-configuration'

interface ImportApiConfigSelectProps {
  apiConfigurations: APIConfiguration[]
  selectedConfigId: string
  onConfigIdChange: (value: string) => void
}

export function ImportApiConfigSelect({
  apiConfigurations,
  selectedConfigId,
  onConfigIdChange,
}: ImportApiConfigSelectProps) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
        API Configuration <span className="text-red-500">*</span>
      </label>
      <select
        aria-label="Select an API configuration"
        value={selectedConfigId}
        onChange={(e) => onConfigIdChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">Select a saved configuration...</option>
        {apiConfigurations.map((config) => (
          <option key={config.id} value={config.id}>
            {config.name}
            {config.isSchoolPortal && ' (School Portal)'}
          </option>
        ))}
      </select>
      <p className="mt-1 text-xs text-gray-500">
        Configure API endpoints in{' '}
        <a href="/dashboard/settings" className="underline font-semibold">
          Settings
        </a>
      </p>
    </div>
  )
}
