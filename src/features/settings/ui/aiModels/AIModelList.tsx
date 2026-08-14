import type { AIModelConfiguration, AIModelProvider } from '@/entities/ai-model'
import { getProviderDisplayName } from '../../model/aiModels/selectors/getProviderDisplayName'

interface AIModelListProps {
  aiModels: AIModelConfiguration[]
  onCreate: () => void
  onEdit: (model: AIModelConfiguration) => void
  onDelete: (id: string, provider: AIModelProvider) => void
}

export function AIModelList({ aiModels, onCreate, onEdit, onDelete }: AIModelListProps) {
  return (
    <div className="divide-y divide-gray-200">
      {aiModels.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-gray-500">No AI models configured</p>
          <button
            onClick={onCreate}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Your First AI Model
          </button>
        </div>
      ) : (
        aiModels.map((model) => (
          <div key={model.id} className="px-6 py-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-gray-900">
                    {getProviderDisplayName(model.provider)}
                  </h3>
                  {model.isActive ? (
                    <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                      Inactive
                    </span>
                  )}
                </div>
                {model.modelName && (
                  <p className="text-sm text-gray-600 mt-1">Model: {model.modelName}</p>
                )}
                {model.description && (
                  <p className="text-sm text-gray-500 mt-1">{model.description}</p>
                )}
                <div className="mt-2">
                  <span className="text-xs font-medium text-gray-500">API Key:</span>
                  <p className="text-sm text-gray-900">••••••••••••</p>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Added: {new Date(model.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="ml-4 flex gap-2">
                <button
                  onClick={() => onEdit(model)}
                  className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(model.id, model.provider)}
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
