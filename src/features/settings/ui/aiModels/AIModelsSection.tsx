import type { Center } from '@/entities/center'
import type { AIModelsController } from '../../model/aiModels/types'
import { AIModelForm } from './AIModelForm'
import { AIModelList } from './AIModelList'

interface AIModelsSectionProps {
  aiModels: AIModelsController
  centers: Center[]
}

export function AIModelsSection({ aiModels, centers }: AIModelsSectionProps) {
  const {
    formData,
    setFormData,
    editingId,
    isCreating,
    handleCreate,
    handleEdit,
    handleSave,
    handleCancel,
    handleDelete,
  } = aiModels

  return (
    <div className="border-b border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">AI Model Configuration</h2>
          <p className="mt-1 text-sm text-gray-600">
            Configure AI models for question generation (OpenAI, Gemini, DeepSeek)
          </p>
        </div>
        {!isCreating && !editingId && (
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            Add AI Model
          </button>
        )}
      </div>

      {(isCreating || editingId) && (
        <AIModelForm
          formData={formData}
          setFormData={setFormData}
          centers={centers}
          isCreating={isCreating}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      <AIModelList
        aiModels={aiModels.aiModels}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
