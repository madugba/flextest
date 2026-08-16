import type { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { useImportExamSessionsMutation } from '@/entities/exam-session'
import type { APIConfiguration } from '@/entities/api-configuration'

interface ImportHandlersDeps {
  apiConfigurations: APIConfiguration[]
  selectedConfig: APIConfiguration | null
  selectedClass: string
  importMutation: ReturnType<typeof useImportExamSessionsMutation>
  setSelectedConfigId: Dispatch<SetStateAction<string>>
  setSelectedConfig: Dispatch<SetStateAction<APIConfiguration | null>>
  setSelectedClass: Dispatch<SetStateAction<string>>
  setShowImportDialog: Dispatch<SetStateAction<boolean>>
}

export function createImportHandlers(deps: ImportHandlersDeps) {
  const {
    apiConfigurations,
    selectedConfig,
    selectedClass,
    importMutation,
    setSelectedConfigId,
    setSelectedConfig,
    setSelectedClass,
    setShowImportDialog,
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
      const result = await importMutation.mutateAsync(selectedConfig.apiEndpoint)
      toast.success('Import completed', {
        description: `Created: ${result.created}, Skipped: ${result.skipped}${
          result.errors.length > 0 ? `, Errors: ${result.errors.length}` : ''
        }`,
      })
      setShowImportDialog(false)
      resetImportForm()
    } catch (error) {
      toast.error('Failed to import exam sessions from API', {
        description: error instanceof Error ? error.message : 'An error occurred',
      })
    }
  }

  return { loadAPIConfig, resetImportForm, handleImportFromApi }
}
