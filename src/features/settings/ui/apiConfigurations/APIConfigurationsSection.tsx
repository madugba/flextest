import type { Center } from '@/entities/center'
import type { APIConfigurationsController } from '../../model/apiConfigurations/types'
import { APIConfigurationForm } from './APIConfigurationForm'
import { APIConfigurationList } from './APIConfigurationList'

interface APIConfigurationsSectionProps {
  apiConfigurations: APIConfigurationsController
  centers: Center[]
}

export function APIConfigurationsSection({
  apiConfigurations,
  centers,
}: APIConfigurationsSectionProps) {
  const {
    configurations,
    formData,
    setFormData,
    editingId,
    isCreating,
    handleCreate,
    handleEdit,
    handleSave,
    handleCancel,
    handleDelete,
  } = apiConfigurations

  return (
    <div className="border-b border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">API Configuration</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage API configurations for importing subjects and candidates
          </p>
        </div>
        {!isCreating && !editingId && (
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            Add Configuration
          </button>
        )}
      </div>

      {(isCreating || editingId) && (
        <APIConfigurationForm
          formData={formData}
          setFormData={setFormData}
          centers={centers}
          isCreating={isCreating}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      <APIConfigurationList
        configurations={configurations}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
