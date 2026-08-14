import type { ScoreConfigurationsController } from '../../model/scoreConfigurations/types'
import { ScoreConfigurationList } from './ScoreConfigurationList'
import { ScoreForm } from './ScoreForm'

interface ScoreConfigurationsSectionProps {
  scoreConfigurations: ScoreConfigurationsController
}

export function ScoreConfigurationsSection({
  scoreConfigurations,
}: ScoreConfigurationsSectionProps) {
  const {
    scoreForm,
    setScoreForm,
    editingScoreId,
    validationResult,
    previewResult,
    isLoadingScores,
    scoreError,
    isValidating,
    isPreviewing,
    isCreatingScore,
    isUpdatingScore,
    isActivatingScore,
    isDeletingScore,
    handleCreateScore,
    handleUpdateScore,
    handleEditScore,
    handleCancelEdit,
    handleDeleteScore,
    handleActivateScore,
    handleValidateFormula,
    handlePreviewScore,
  } = scoreConfigurations

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Score Configuration</h2>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Add Score Configuration</h3>
          <p className="text-sm text-gray-600 mb-4">
            Configure how exam scores are calculated using formulas and placeholders.
          </p>

          <ScoreForm
            scoreForm={scoreForm}
            setScoreForm={setScoreForm}
            editingScoreId={editingScoreId}
            validationResult={validationResult}
            previewResult={previewResult}
            isValidating={isValidating}
            isPreviewing={isPreviewing}
            isCreatingScore={isCreatingScore}
            isUpdatingScore={isUpdatingScore}
            handleCreateScore={handleCreateScore}
            handleUpdateScore={handleUpdateScore}
            handleValidateFormula={handleValidateFormula}
            handlePreviewScore={handlePreviewScore}
            handleCancelEdit={handleCancelEdit}
          />
        </div>

        <ScoreConfigurationList
          scoreConfigurations={scoreConfigurations.scoreConfigurations}
          isLoadingScores={isLoadingScores}
          scoreError={scoreError}
          isActivatingScore={isActivatingScore}
          isDeletingScore={isDeletingScore}
          handleEditScore={handleEditScore}
          handleDeleteScore={handleDeleteScore}
          handleActivateScore={handleActivateScore}
        />
      </div>
    </div>
  )
}
