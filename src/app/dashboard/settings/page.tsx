'use client'

import React, { useState, useEffect } from 'react'
import {
  getAllAPIConfigurations,
  createAPIConfiguration,
  updateAPIConfiguration,
  deleteAPIConfiguration,
  type APIConfiguration,
  type CreateAPIConfigurationRequest,
  type UpdateAPIConfigurationRequest
} from '@/entities/api-configuration'
import { getAllCenters, type Center } from '@/entities/center'
import {
  getAllAIModels,
  createAIModel,
  updateAIModel,
  deleteAIModel,
  type AIModelConfiguration,
  type CreateAIModelRequest,
  type UpdateAIModelRequest,
  type AIModelProvider
} from '@/entities/ai-model'
import { toast } from 'sonner'
import { DashboardHeader } from '@/widgets/dashboard/ui/DashboardHeader'

export default function SettingsPage() {
  const [configurations, setConfigurations] = useState<APIConfiguration[]>([])
  const [centers, setCenters] = useState<Center[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    apiEndpoint: '',
    apiKey: '',
    description: '',
    centerId: '',
    isSchoolPortal: false
  })

  // AI Model state
  const [aiModels, setAiModels] = useState<AIModelConfiguration[]>([])
  const [editingAIModelId, setEditingAIModelId] = useState<string | null>(null)
  const [isCreatingAIModel, setIsCreatingAIModel] = useState(false)
  const [aiModelFormData, setAiModelFormData] = useState({
    provider: '' as AIModelProvider | '',
    apiKey: '',
    modelName: '',
    description: '',
    isActive: true,
    centerId: ''
  })

  useEffect(() => {
    loadConfigurations()
    loadCenters()
    loadAIModels()
  }, [])

  const loadConfigurations = async () => {
    try {
      const data = await getAllAPIConfigurations()
      setConfigurations(data)
    } catch {
      toast.error('Failed to load API configurations')
    } finally {
      setLoading(false)
    }
  }

  const loadCenters = async () => {
    try {
      const data = await getAllCenters()
      setCenters(data)
    } catch {
      toast.error('Failed to load centers')
    }
  }

  const handleEdit = (config: APIConfiguration) => {
    setEditingId(config.id)
    setFormData({
      name: config.name,
      apiEndpoint: config.apiEndpoint,
      apiKey: config.apiKey || '',
      description: config.description || '',
      centerId: config.centerId,
      isSchoolPortal: config.isSchoolPortal
    })
  }

  const handleCreate = () => {
    setIsCreating(true)
    setFormData({
      name: '',
      apiEndpoint: '',
      apiKey: '',
      description: '',
      centerId: centers.length > 0 ? centers[0].id : '',
      isSchoolPortal: false
    })
  }

  const handleSave = async () => {
    try {
      if (!formData.name.trim() || !formData.apiEndpoint.trim() || !formData.centerId) {
        toast.error('Name, API endpoint, and center are required')
        return
      }

      if (isCreating) {
        const newConfig: CreateAPIConfigurationRequest = {
          name: formData.name.trim(),
          apiEndpoint: formData.apiEndpoint.trim(),
          apiKey: formData.apiKey.trim() || undefined,
          description: formData.description.trim() || undefined,
          centerId: formData.centerId,
          isSchoolPortal: formData.isSchoolPortal
        }
        await createAPIConfiguration(newConfig)
        toast.success('API configuration created successfully')
      } else if (editingId) {
        const updateData: UpdateAPIConfigurationRequest = {
          name: formData.name.trim(),
          apiEndpoint: formData.apiEndpoint.trim(),
          apiKey: formData.apiKey.trim() || undefined,
          description: formData.description.trim() || undefined,
          centerId: formData.centerId,
          isSchoolPortal: formData.isSchoolPortal
        }
        await updateAPIConfiguration(editingId, updateData)
        toast.success('API configuration updated successfully')
      }

      setIsCreating(false)
      setEditingId(null)
      setFormData({ name: '', apiEndpoint: '', apiKey: '', description: '', centerId: '', isSchoolPortal: false })
      await loadConfigurations()
    } catch (error: unknown) {
      const errorResponse = (typeof error === "object" && error !== null && "response" in error)
        ? (error as { response?: { data?: { error?: { message?: string } } } }).response?.data?.error?.message
        : undefined;
      const message = typeof errorResponse === "string" ? errorResponse : 'Failed to save API configuration';
      toast.error(message)
    }
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingId(null)
    setFormData({ name: '', apiEndpoint: '', apiKey: '', description: '', centerId: '', isSchoolPortal: false })
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return
    }

    try {
      await deleteAPIConfiguration(id)
      toast.success('API configuration deleted successfully')
      await loadConfigurations()
    } catch (error: unknown) {
      const errorResponse = (typeof error === "object" && error !== null && "response" in error)
        ? (error as { response?: { data?: { error?: { message?: string } } } }).response?.data?.error?.message
        : undefined;
      const message = typeof errorResponse === "string" ? errorResponse : 'Failed to delete API configuration';
      toast.error(message)
    }
  }

  // AI Model handlers
  const loadAIModels = async () => {
    try {
      console.log('[loadAIModels] Loading AI models...')
      const data = await getAllAIModels()
      console.log('[loadAIModels] Loaded AI models:', data)
      setAiModels(data)
    } catch (error: unknown) {
      console.error('[loadAIModels] Error loading AI models:', error)
      // Don't show error toast on initial load if endpoint doesn't exist yet
      const statusCode = typeof error === 'object' && error !== null && 'statusCode' in error ? (error as { statusCode?: number }).statusCode : undefined
      if (statusCode !== 404) {
        toast.error('Failed to load AI models')
      }
    }
  }

  const handleCreateAIModel = () => {
    setIsCreatingAIModel(true)
    setAiModelFormData({
      provider: '' as AIModelProvider | '',
      apiKey: '',
      modelName: '',
      description: '',
      isActive: true,
      centerId: centers.length > 0 ? centers[0].id : ''
    })
  }

  const handleEditAIModel = (model: AIModelConfiguration) => {
    setEditingAIModelId(model.id)
    setAiModelFormData({
      provider: model.provider,
      apiKey: model.apiKey,
      modelName: model.modelName || '',
      description: model.description || '',
      isActive: model.isActive,
      centerId: model.centerId
    })
  }

  const handleSaveAIModel = async () => {
    try {
      if (!aiModelFormData.provider || !aiModelFormData.apiKey.trim() || !aiModelFormData.centerId) {
        toast.error('Provider, API key, and center are required')
        return
      }

      if (isCreatingAIModel) {
        const newModel: CreateAIModelRequest = {
          provider: aiModelFormData.provider as AIModelProvider,
          apiKey: aiModelFormData.apiKey.trim(),
          modelName: aiModelFormData.modelName.trim() || undefined,
          description: aiModelFormData.description.trim() || undefined,
          isActive: aiModelFormData.isActive,
          centerId: aiModelFormData.centerId
        }
        console.log('[handleSaveAIModel] Creating new AI model:', newModel)
        await createAIModel(newModel)
        toast.success('AI model added successfully')
      } else if (editingAIModelId) {
        const updateData: UpdateAIModelRequest = {
          provider: aiModelFormData.provider as AIModelProvider,
          apiKey: aiModelFormData.apiKey.trim(),
          modelName: aiModelFormData.modelName.trim() || undefined,
          description: aiModelFormData.description.trim() || undefined,
          isActive: aiModelFormData.isActive,
          centerId: aiModelFormData.centerId
        }
        console.log('[handleSaveAIModel] Updating AI model:', editingAIModelId, updateData)
        await updateAIModel(editingAIModelId, updateData)
        toast.success('AI model updated successfully')
      }

      setIsCreatingAIModel(false)
      setEditingAIModelId(null)
      setAiModelFormData({
        provider: '' as AIModelProvider | '',
        apiKey: '',
        modelName: '',
        description: '',
        isActive: true,
        centerId: ''
      })
      await loadAIModels()
    } catch (error: unknown) {
      console.error('[handleSaveAIModel] Error saving AI model:', error)

      // Show more detailed error message
      let errorMessage = 'Failed to save AI model'
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: { message?: string } } } }
        const responseMessage = axiosError.response?.data?.error?.message;
        if (responseMessage) {
          errorMessage = responseMessage;
        }
      }

      toast.error(errorMessage)
    }
  }

  const handleCancelAIModel = () => {
    setIsCreatingAIModel(false)
    setEditingAIModelId(null)
    setAiModelFormData({
      provider: '' as AIModelProvider | '',
      apiKey: '',
      modelName: '',
      description: '',
      isActive: true,
      centerId: ''
    })
  }

  const handleDeleteAIModel = async (id: string, provider: AIModelProvider) => {
    if (!confirm(`Are you sure you want to delete the ${getProviderDisplayName(provider)} model?`)) {
      return
    }

    try {
      await deleteAIModel(id)
      toast.success('AI model deleted successfully')
      await loadAIModels()
    } catch (error: unknown) {
      const errorResponse = (typeof error === "object" && error !== null && "response" in error)
        ? (error as { response?: { data?: { error?: { message?: string } } } }).response?.data?.error?.message
        : undefined;
      const message = typeof errorResponse === "string" ? errorResponse : 'Failed to delete AI model';
      toast.error(message)
    }
  }

  const getProviderDisplayName = (provider: AIModelProvider): string => {
    switch (provider) {
      case 'OPENAI':
        return 'OpenAI'
      case 'GEMINI':
        return 'Google Gemini'
      case 'DEEPSEEK':
        return 'DeepSeek'
      default:
        return provider
    }
  }

  if (loading) {
    return (
      <div className="flex-1 overflow-auto">
        <DashboardHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <DashboardHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage system configurations and integrations
          </p>
        </div>

        {/* Settings Card */}
        <div className="bg-white rounded-lg shadow">
          {/* API Configuration Section */}
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

          {/* Create/Edit Form */}
          {(isCreating || editingId) && (
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                {isCreating ? 'Create New Configuration' : 'Edit Configuration'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Center <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.centerId}
                    onChange={(e) => setFormData({ ...formData, centerId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a center...</option>
                    {centers.map((center) => (
                      <option key={center.id} value={center.id}>
                        {center.centerName} - {center.state}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Multiple API configs can be added for each center
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Configuration Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Production API, Test API"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    This name will be shown when selecting a configuration during import
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Endpoint <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={formData.apiEndpoint}
                    onChange={(e) => setFormData({ ...formData, apiEndpoint: e.target.value })}
                    placeholder="https://api.example.com/data"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Key (Optional)
                  </label>
                  <input
                    type="password"
                    value={formData.apiKey}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    placeholder="Optional API key for authentication"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Optional description of this API configuration"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isSchoolPortal"
                    checked={formData.isSchoolPortal}
                    onChange={(e) => setFormData({ ...formData, isSchoolPortal: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isSchoolPortal" className="ml-2 text-sm font-medium text-gray-700">
                    Mark as School Portal
                  </label>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={!formData.name.trim() || !formData.apiEndpoint.trim() || !formData.centerId}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isCreating ? 'Create' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Configuration List */}
          <div className="divide-y divide-gray-200">
            {configurations.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500">No API configurations found</p>
                <button
                  onClick={handleCreate}
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
                        <p className="text-sm text-gray-500 mt-1">
                          {config.description}
                        </p>
                      )}

                      <div className="mt-3 space-y-2">
                        <div>
                          <span className="text-xs font-medium text-gray-500">
                            API Endpoint:
                          </span>
                          <p className="text-sm text-gray-900 break-all">
                            {config.apiEndpoint}
                          </p>
                        </div>
                        {config.apiKey && (
                          <div>
                            <span className="text-xs font-medium text-gray-500">
                              API Key:
                            </span>
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
                        onClick={() => handleEdit(config)}
                        className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(config.id, config.name)}
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
          </div>

          {/* AI Model Configuration Section */}
          <div className="border-b border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">AI Model Configuration</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Configure AI models for question generation (OpenAI, Gemini, DeepSeek)
                </p>
              </div>
              {!isCreatingAIModel && !editingAIModelId && (
                <button
                  onClick={handleCreateAIModel}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Add AI Model
                </button>
              )}
            </div>

          {/* Create/Edit AI Model Form */}
          {(isCreatingAIModel || editingAIModelId) && (
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                {isCreatingAIModel ? 'Add New AI Model' : 'Edit AI Model'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Provider <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={aiModelFormData.provider}
                    onChange={(e) => setAiModelFormData({ ...aiModelFormData, provider: e.target.value as AIModelProvider })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select provider...</option>
                    <option value="OPENAI">OpenAI (GPT-4, GPT-3.5)</option>
                    <option value="GEMINI">Google Gemini</option>
                    <option value="DEEPSEEK">DeepSeek</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Center <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={aiModelFormData.centerId}
                    onChange={(e) => setAiModelFormData({ ...aiModelFormData, centerId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select center...</option>
                    {centers.map(center => (
                      <option key={center.id} value={center.id}>{center.centerName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Key <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={aiModelFormData.apiKey}
                    onChange={(e) => setAiModelFormData({ ...aiModelFormData, apiKey: e.target.value })}
                    placeholder="Enter your API key"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Your API key will be encrypted and stored securely
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={aiModelFormData.modelName}
                    onChange={(e) => setAiModelFormData({ ...aiModelFormData, modelName: e.target.value })}
                    placeholder="e.g., gpt-4, gemini-pro, deepseek-chat"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={aiModelFormData.description}
                    onChange={(e) => setAiModelFormData({ ...aiModelFormData, description: e.target.value })}
                    placeholder="Optional notes about this model configuration"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={aiModelFormData.isActive}
                    onChange={(e) => setAiModelFormData({ ...aiModelFormData, isActive: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                    Active (Enable this model for use)
                  </label>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSaveAIModel}
                    disabled={!aiModelFormData.provider || !aiModelFormData.apiKey.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isCreatingAIModel ? 'Add Model' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancelAIModel}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* AI Model List */}
          <div className="divide-y divide-gray-200">
            {aiModels.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500">No AI models configured</p>
                <button
                  onClick={handleCreateAIModel}
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
                        <p className="text-sm text-gray-600 mt-1">
                          Model: {model.modelName}
                        </p>
                      )}
                      {model.description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {model.description}
                        </p>
                      )}
                      <div className="mt-2">
                        <span className="text-xs font-medium text-gray-500">
                          API Key:
                        </span>
                        <p className="text-sm text-gray-900">••••••••••••</p>
                      </div>
                      <div className="text-xs text-gray-400 mt-2">
                        Added: {new Date(model.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="ml-4 flex gap-2">
                      <button
                        onClick={() => handleEditAIModel(model)}
                        className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAIModel(model.id, model.provider)}
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
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <svg
              className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">Configuration Guide:</p>

              <p className="font-medium mt-3 mb-1">API Configuration:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Each center can have multiple API configurations for different data sources</li>
                <li>Create configurations with descriptive names for easy identification</li>
                <li>When importing subjects or candidates, select a saved configuration by name</li>
                <li>The API should return data in JSON format with the expected structure</li>
              </ul>

              <p className="font-medium mt-3 mb-1">AI Model Configuration:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Configure AI models to enable automatic question generation</li>
                <li>You can add multiple AI models from different providers (OpenAI, Gemini, DeepSeek)</li>
                <li>Mark models as active/inactive to control which models can be used</li>
                <li>API keys are securely encrypted before storage</li>
                <li>Get API keys from: OpenAI Dashboard, Google AI Studio, or DeepSeek Platform</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
