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
import {
  getAllScoreConfigurations,
  createScoreConfiguration,
  updateScoreConfiguration,
  deleteScoreConfiguration,
  activateScoreConfiguration,
  validateFormula,
  previewScore,
  type ScoreConfiguration,
  type CreateScoreConfigurationRequest,
  type UpdateScoreConfigurationRequest,
  type ValidateFormulaResponse,
  type PreviewScoreResponse,
  type ScoringType,
  FORMULA_TEMPLATES,
  AVAILABLE_PLACEHOLDERS
} from '@/entities/score-configuration'
import { toast } from 'sonner'
import { DashboardHeader } from '@/widgets/dashboard/ui/DashboardHeader'
import { ResetSessionsModal } from '@/features/reset-sessions'

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

  // Score Configuration state
  const [scoreConfigurations, setScoreConfigurations] = useState<ScoreConfiguration[]>([])
  const [editingScoreId, setEditingScoreId] = useState<string | null>(null)
  const [scoreForm, setScoreForm] = useState({
    name: '',
    description: '',
    formula: '',
    scoringType: 'PERCENTAGE' as ScoringType,
    negativeMarking: false,
    negativeMarkValue: undefined as number | undefined,
    maxScore: undefined as number | undefined,
    passingScore: undefined as number | undefined,
    gradeRanges: {} as Record<string, [number, number]>,
  })
  const [validationResult, setValidationResult] = useState<ValidateFormulaResponse | null>(null)
  const [previewResult, setPreviewResult] = useState<PreviewScoreResponse | null>(null)
  const [isLoadingScores, setIsLoadingScores] = useState(false)
  const [scoreError, setScoreError] = useState<string | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [isCreatingScore, setIsCreatingScore] = useState(false)
  const [isUpdatingScore, setIsUpdatingScore] = useState(false)
  const [isActivatingScore, setIsActivatingScore] = useState(false)
  const [isDeletingScore, setIsDeletingScore] = useState(false)

  // Reset Sessions Modal state
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)

  useEffect(() => {
    loadConfigurations()
    loadCenters()
    loadAIModels()
    loadScoreConfigurations()
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
      const data = await getAllAIModels()
      setAiModels(data)
    } catch (error: unknown) {
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

  // Score Configuration handlers
  const loadScoreConfigurations = async () => {
    setIsLoadingScores(true)
    setScoreError(null)
    try {
      const data = await getAllScoreConfigurations()
      setScoreConfigurations(data)
    } catch (error: unknown) {
      const statusCode = typeof error === 'object' && error !== null && 'statusCode' in error ? (error as { statusCode?: number }).statusCode : undefined
      if (statusCode !== 404) {
        setScoreError('Failed to load score configurations')
        toast.error('Failed to load score configurations')
      }
    } finally {
      setIsLoadingScores(false)
    }
  }

  const handleCreateScoreConfiguration = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreatingScore(true)

    try {
      const centerId = centers.length > 0 ? centers[0].id : ''
      if (!centerId) {
        toast.error('No center available')
        return
      }

      const newConfig: CreateScoreConfigurationRequest = {
        name: scoreForm.name.trim(),
        description: scoreForm.description?.trim() || undefined,
        formula: scoreForm.formula.trim(),
        scoringType: scoreForm.scoringType,
        gradeRanges: Object.keys(scoreForm.gradeRanges).length > 0 ? scoreForm.gradeRanges : undefined,
        negativeMarking: scoreForm.negativeMarking,
        negativeMarkValue: scoreForm.negativeMarkValue,
        passingScore: scoreForm.passingScore,
        maxScore: scoreForm.maxScore,
        centerId: centerId
      }

      await createScoreConfiguration(newConfig)
      toast.success('Score configuration created successfully')

      setScoreForm({
        name: '',
        description: '',
        formula: '',
        scoringType: 'PERCENTAGE',
        negativeMarking: false,
        negativeMarkValue: undefined,
        maxScore: undefined,
        passingScore: undefined,
        gradeRanges: {},
      })
      setValidationResult(null)
      setPreviewResult(null)

      await loadScoreConfigurations()
    } catch (error: unknown) {
      const errorMessage = (typeof error === 'object' && error !== null && 'message' in error)
        ? (error as { message?: string }).message
        : 'Failed to create score configuration'
      toast.error(errorMessage)
    } finally {
      setIsCreatingScore(false)
    }
  }

  const handleUpdateScoreConfiguration = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingScoreId) return

    setIsUpdatingScore(true)

    try {
      const updateData: UpdateScoreConfigurationRequest = {
        name: scoreForm.name.trim(),
        description: scoreForm.description?.trim() || undefined,
        formula: scoreForm.formula.trim(),
        scoringType: scoreForm.scoringType,
        gradeRanges: Object.keys(scoreForm.gradeRanges).length > 0 ? scoreForm.gradeRanges : undefined,
        negativeMarking: scoreForm.negativeMarking,
        negativeMarkValue: scoreForm.negativeMarkValue,
        passingScore: scoreForm.passingScore,
        maxScore: scoreForm.maxScore,
      }

      await updateScoreConfiguration(editingScoreId, updateData)
      toast.success('Score configuration updated successfully')

      setEditingScoreId(null)
      setScoreForm({
        name: '',
        description: '',
        formula: '',
        scoringType: 'PERCENTAGE',
        negativeMarking: false,
        negativeMarkValue: undefined,
        maxScore: undefined,
        passingScore: undefined,
        gradeRanges: {},
      })
      setValidationResult(null)
      setPreviewResult(null)

      await loadScoreConfigurations()
    } catch (error: unknown) {
      const errorMessage = (typeof error === 'object' && error !== null && 'message' in error)
        ? (error as { message?: string }).message
        : 'Failed to update score configuration'
      toast.error(errorMessage)
    } finally {
      setIsUpdatingScore(false)
    }
  }

  const handleEditScoreConfiguration = (config: ScoreConfiguration) => {
    setEditingScoreId(config.id)
    setScoreForm({
      name: config.name,
      description: config.description || '',
      formula: config.formula,
      scoringType: config.scoringType,
      negativeMarking: config.negativeMarking,
      negativeMarkValue: config.negativeMarkValue,
      maxScore: config.maxScore,
      passingScore: config.passingScore,
      gradeRanges: config.gradeRanges || {},
    })
    setValidationResult(null)
    setPreviewResult(null)
  }

  const handleDeleteScoreConfiguration = async (id: string) => {
    if (!confirm('Are you sure you want to delete this configuration?')) {
      return
    }

    setIsDeletingScore(true)

    try {
      await deleteScoreConfiguration(id)
      toast.success('Score configuration deleted successfully')
      await loadScoreConfigurations()
    } catch (error: unknown) {
      const errorMessage = (typeof error === 'object' && error !== null && 'message' in error)
        ? (error as { message?: string }).message
        : 'Failed to delete score configuration'
      toast.error(errorMessage)
    } finally {
      setIsDeletingScore(false)
    }
  }

  const handleActivateScoreConfiguration = async (id: string) => {
    setIsActivatingScore(true)

    try {
      await activateScoreConfiguration(id)
      toast.success('Score configuration activated successfully')
      await loadScoreConfigurations()
    } catch (error: unknown) {
      const errorMessage = (typeof error === 'object' && error !== null && 'message' in error)
        ? (error as { message?: string }).message
        : 'Failed to activate score configuration'
      toast.error(errorMessage)
    } finally {
      setIsActivatingScore(false)
    }
  }

  const handleValidateFormula = async () => {
    if (!scoreForm.formula.trim()) {
      toast.error('Please enter a formula to validate')
      return
    }

    setIsValidating(true)

    try {
      const result = await validateFormula({ formula: scoreForm.formula })
      setValidationResult(result)

      if (result.isValid) {
        toast.success('Formula is valid!')
      } else {
        toast.error(result.error || 'Invalid formula')
      }
    } catch (error: unknown) {
      toast.error('Failed to validate formula')
      setValidationResult({ isValid: false, error: 'Failed to validate formula', placeholders: [] })
    } finally {
      setIsValidating(false)
    }
  }

  const handlePreviewScore = async () => {
    if (!scoreForm.formula.trim()) {
      toast.error('Please enter a formula to preview')
      return
    }

    if (!validationResult?.isValid) {
      toast.error('Please validate the formula first')
      return
    }

    setIsPreviewing(true)

    try {
      const sampleValues = validationResult.sampleValues || {
        correctAnswers: 8,
        totalQuestions: 10,
        wrongAnswers: 2,
        skippedQuestions: 0,
      }

      const result = await previewScore({
        formula: scoreForm.formula,
        values: sampleValues
      })

      setPreviewResult(result)
    } catch (error: unknown) {
      toast.error('Failed to preview score calculation')
    } finally {
      setIsPreviewing(false)
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

        {/* Score Configuration */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Score Configuration</h2>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Add Score Configuration
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Configure how exam scores are calculated using formulas and placeholders.
              </p>

              {/* Template Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Use Template
                </label>
                <select
                  onChange={(e) => {
                    const template = e.target.value;
                    if (template && FORMULA_TEMPLATES[template as keyof typeof FORMULA_TEMPLATES]) {
                      const selectedTemplate = FORMULA_TEMPLATES[template as keyof typeof FORMULA_TEMPLATES];
                      setScoreForm({
                        name: selectedTemplate.name,
                        description: selectedTemplate.description,
                        formula: selectedTemplate.formula,
                        scoringType: selectedTemplate.scoringType,
                        negativeMarking: 'negativeMarking' in selectedTemplate ? selectedTemplate.negativeMarking : false,
                        negativeMarkValue: 'negativeMarkValue' in selectedTemplate ? selectedTemplate.negativeMarkValue : undefined,
                        maxScore: 100,
                        passingScore: 40,
                        gradeRanges: {},
                      });
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a template...</option>
                  {Object.entries(FORMULA_TEMPLATES).map(([key, template]) => (
                    <option key={key} value={key}>
                      {template.name} - {template.description}
                    </option>
                  ))}
                </select>
              </div>

              <form onSubmit={editingScoreId ? handleUpdateScoreConfiguration : handleCreateScoreConfiguration}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Configuration Name
                    </label>
                    <input
                      type="text"
                      value={scoreForm.name}
                      onChange={(e) => setScoreForm({ ...scoreForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Standard Marking"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Scoring Type
                    </label>
                    <select
                      value={scoreForm.scoringType}
                      onChange={(e) => setScoreForm({ ...scoreForm, scoringType: e.target.value as ScoringType })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="PERCENTAGE">Percentage</option>
                      <option value="POINTS">Points</option>
                      <option value="GRADE">Grade</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={scoreForm.description || ''}
                      onChange={(e) => setScoreForm({ ...scoreForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Description of this scoring configuration"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Formula
                    </label>
                    <textarea
                      value={scoreForm.formula}
                      onChange={(e) => setScoreForm({ ...scoreForm, formula: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                      placeholder="e.g., ({correctAnswers} / {totalQuestions}) * 100"
                      rows={3}
                      required
                    />
                    {validationResult && !validationResult.isValid && (
                      <p className="text-sm text-red-600 mt-1">{validationResult.error}</p>
                    )}
                    {validationResult && validationResult.isValid && (
                      <p className="text-sm text-green-600 mt-1">Formula is valid!</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <div className="text-sm text-gray-600 mb-2">Available Placeholders:</div>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_PLACEHOLDERS.map((placeholder) => (
                        <button
                          key={placeholder.name}
                          type="button"
                          onClick={() => {
                            const cursorPos = (document.querySelector('textarea') as HTMLTextAreaElement)?.selectionStart || scoreForm.formula.length;
                            const newFormula =
                              scoreForm.formula.slice(0, cursorPos) +
                              `{${placeholder.name}}` +
                              scoreForm.formula.slice(cursorPos);
                            setScoreForm({ ...scoreForm, formula: newFormula });
                          }}
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-mono"
                          title={placeholder.description}
                        >
                          {`{${placeholder.name}}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Score
                    </label>
                    <input
                      type="number"
                      value={scoreForm.maxScore || ''}
                      onChange={(e) => setScoreForm({ ...scoreForm, maxScore: parseInt(e.target.value) || undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Passing Score
                    </label>
                    <input
                      type="number"
                      value={scoreForm.passingScore || ''}
                      onChange={(e) => setScoreForm({ ...scoreForm, passingScore: parseInt(e.target.value) || undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="40"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={scoreForm.negativeMarking}
                        onChange={(e) => setScoreForm({ ...scoreForm, negativeMarking: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Enable Negative Marking</span>
                    </label>
                    {scoreForm.negativeMarking && (
                      <input
                        type="number"
                        step="0.25"
                        value={scoreForm.negativeMarkValue || ''}
                        onChange={(e) => setScoreForm({ ...scoreForm, negativeMarkValue: parseFloat(e.target.value) || undefined })}
                        className="mt-2 w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="1.0"
                      />
                    )}
                  </div>

                  <div className="md:col-span-2 flex gap-2">
                    <button
                      type="button"
                      onClick={handleValidateFormula}
                      disabled={!scoreForm.formula || isValidating}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                    >
                      {isValidating ? 'Validating...' : 'Validate Formula'}
                    </button>

                    <button
                      type="button"
                      onClick={handlePreviewScore}
                      disabled={!scoreForm.formula || !validationResult?.isValid || isPreviewing}
                      className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400"
                    >
                      {isPreviewing ? 'Previewing...' : 'Preview Score'}
                    </button>

                    <button
                      type="submit"
                      disabled={!scoreForm.name || !scoreForm.formula || isCreatingScore || isUpdatingScore}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      {editingScoreId ? (isUpdatingScore ? 'Updating...' : 'Update Configuration') : (isCreatingScore ? 'Creating...' : 'Create Configuration')}
                    </button>

                    {editingScoreId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingScoreId(null);
                          setScoreForm({
                            name: '',
                            description: '',
                            formula: '',
                            scoringType: 'PERCENTAGE',
                            negativeMarking: false,
                            negativeMarkValue: undefined,
                            maxScore: undefined,
                            passingScore: undefined,
                            gradeRanges: {},
                          });
                          setValidationResult(null);
                          setPreviewResult(null);
                        }}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </form>

              {previewResult && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <h4 className="font-medium text-blue-900 mb-2">Preview Result</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Formula:</strong> <code className="bg-white px-2 py-1 rounded">{previewResult.formula}</code></p>
                    <p><strong>Sample Values:</strong></p>
                    <ul className="ml-4 list-disc">
                      {Object.entries(previewResult.values).map(([key, value]) => (
                        <li key={key}>{key}: {value}</li>
                      ))}
                    </ul>
                    <p><strong>Result:</strong> <span className="text-lg font-bold text-blue-900">{previewResult.result}</span></p>
                    {previewResult.calculation && previewResult.calculation.length > 0 && (
                      <>
                        <p><strong>Calculation Steps:</strong></p>
                        <ol className="ml-4 list-decimal">
                          {previewResult.calculation.map((step, idx) => (
                            <li key={idx}>{step}</li>
                          ))}
                        </ol>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Score Configurations List */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Existing Score Configurations
              </h3>
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
                            <strong>Formula:</strong> <code className="bg-gray-100 px-2 py-0.5 rounded">{config.formula}</code>
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
                            onClick={() => handleActivateScoreConfiguration(config.id)}
                            disabled={isActivatingScore}
                            className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded"
                          >
                            Activate
                          </button>
                        )}
                        <button
                          onClick={() => handleEditScoreConfiguration(config)}
                          className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteScoreConfiguration(config.id)}
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
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-8 bg-white rounded-lg shadow border-2 border-red-200">
          <div className="px-6 py-4 bg-red-50 border-b border-red-200">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-600 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-red-900 mb-2">
                Reset All Exam Sessions
              </h3>
              <p className="text-sm text-red-700 mb-4">
                Permanently delete all exam sessions, questions, candidates, and their answers.
                This action cannot be undone and will remove all exam data from the system.
              </p>
              <button
                onClick={() => setIsResetModalOpen(true)}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Reset All Sessions
              </button>
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

              <p className="font-medium mt-3 mb-1">Score Configuration:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Create multiple scoring configurations for different exam patterns</li>
                <li>Use formulas with placeholders like {`{correctAnswers}`}, {`{totalQuestions}`}</li>
                <li>Support for percentage, points, and grade-based scoring systems</li>
                <li>Only one configuration can be active at a time per center</li>
                <li>Templates available for common patterns (UPSC, IIT-JEE, etc.)</li>
                <li>Enable negative marking with customizable penalty values</li>
                <li>Set passing scores and maximum scores for each configuration</li>
                <li>Validate and preview formulas before saving</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Sessions Modal */}
      <ResetSessionsModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={() => {
          loadConfigurations()
          loadCenters()
          loadAIModels()
          loadScoreConfigurations()
          toast.success('All sessions have been reset successfully')
        }}
      />
    </div>
  )
}
