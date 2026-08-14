import type { APIConfiguration } from '@/entities/api-configuration'

interface APIConfigurationListProps {
  configurations: APIConfiguration[]
  onCreate: () => void
  onEdit: (config: APIConfiguration) => void
  onDelete: (id: string, name: string) => void
}

export function APIConfigurationList({
  configurations,
  onCreate,
  onEdit,
  onDelete,
}: APIConfigurationListProps) {
  return (
    <div className="divide-y divide-gray-200">
      {configurations.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-gray-500">No API configurations found</p>
          <button
            onClick={onCreate}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create First Configuration
          </button>
        </div>
      ) : (
        configurations.map((config) => (
          <div key={config.id} className="px-6 py-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">
                  {config.name}
                  {config.isSchoolPortal && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      School Portal
                    </span>
                  )}
                </h3>
                {config.center && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {config.center.centerName} - {config.center.state}
                  </p>
                )}
                {config.description && (
                  <p className="text-sm text-gray-500 mt-1">{config.description}</p>
                )}

                <div className="mt-3 space-y-2">
                  <div>
                    <span className="text-xs font-medium text-gray-500">API Endpoint:</span>
                    <p className="text-sm text-gray-900 break-all">{config.apiEndpoint}</p>
                  </div>
                  {config.apiKey && (
                    <div>
                      <span className="text-xs font-medium text-gray-500">API Key:</span>
                      <p className="text-sm text-gray-900">••••••••</p>
                    </div>
                  )}
                  <div className="text-xs text-gray-400">
                    Created: {new Date(config.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="ml-4 flex gap-2">
                <button
                  onClick={() => onEdit(config)}
                  className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(config.id, config.name)}
                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
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
