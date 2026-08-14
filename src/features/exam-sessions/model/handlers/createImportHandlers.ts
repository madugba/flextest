import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { importExamSessionsFromApi } from '@/entities/exam-session'
import type { APIConfiguration } from '@/entities/api-configuration'

interface ImportHandlersDeps {
  apiConfigurations: APIConfiguration[]
  selectedConfig: APIConfiguration | null
  selectedClass: string
  setSelectedConfigId: Dispatch<SetStateAction<string>>
  setSelectedConfig: Dispatch<SetStateAction<APIConfiguration | null>>
  setSelectedClass: Dispatch<SetStateAction<string>>
  setIsSubmitting: Dispatch<SetStateAction<boolean>>
  setShowImportDialog: Dispatch<SetStateAction<boolean>>
  fetchExamSessions: () => Promise<void>
}

export function createImportHandlers(deps: ImportHandlersDeps) {
  const {
    apiConfigurations,
    selectedConfig,
    selectedClass,
    setSelectedConfigId,
    setSelectedConfig,
    setSelectedClass,
    setIsSubmitting,
    setShowImportDialog,
    fetchExamSessions,
  } = deps

  const loadAPIConfig = (configId: string) => {
    const config = apiConfigurations.find((c) => c.id === configId)
    if (config) {
      setSelectedConfig(config)
      setSelectedClass('')
    } else {
      setSelectedConfig(null)
      setSelectedClass('')
    }
  }

  const resetImportForm = () => {
    setSelectedConfigId('')
    setSelectedConfig(null)
    setSelectedClass('')
  }

  const handleImportFromApi = async () => {
    if (!selectedConfig) {
      toast.error('Please select an API configuration')
      return
    }

    if (selectedConfig.isSchoolPortal && !selectedClass) {
      toast.error('Please select a class for school portal import')
      return
    }

    try {
      setIsSubmitting(true)
      const result = await importExamSessionsFromApi(selectedConfig.apiEndpoint)
      toast.success('Import completed', {
        description: `Created: ${result.created}, Skipped: ${result.skipped}${
          result.errors.length > 0 ? `, Errors: ${result.errors.length}` : ''
        }`,
      })
      setShowImportDialog(false)
      resetImportForm()
      await fetchExamSessions()
    } catch (error) {
      toast.error('Failed to import exam sessions from API', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return { loadAPIConfig, resetImportForm, handleImportFromApi }
}
