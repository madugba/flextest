import type { PreviewScoreResponse } from '@/entities/score-configuration'

interface ScoreFormPreviewResultProps {
  previewResult: PreviewScoreResponse | null
}

export function ScoreFormPreviewResult({ previewResult }: ScoreFormPreviewResultProps) {
  if (!previewResult) return null

  return (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
      <h4 className="font-medium text-blue-900 mb-2">Preview Result</h4>
      <div className="text-sm space-y-1">
        <p>
          <strong>Formula:</strong>{' '}
          <code className="bg-white px-2 py-1 rounded">{previewResult.formula}</code>
        </p>
        <p>
          <strong>Sample Values:</strong>
        </p>
        <ul className="ml-4 list-disc">
          {Object.entries(previewResult.values).map(([key, value]) => (
            <li key={key}>
              {key}: {value}
            </li>
          ))}
        </ul>
        <p>
          <strong>Result:</strong>{' '}
          <span className="text-lg font-bold text-blue-900">{previewResult.result}</span>
        </p>
        {previewResult.calculation && previewResult.calculation.length > 0 && (
          <>
            <p>
              <strong>Calculation Steps:</strong>
            </p>
            <ol className="ml-4 list-decimal">
              {previewResult.calculation.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </>
        )}
      </div>
    </div>
  )
}
