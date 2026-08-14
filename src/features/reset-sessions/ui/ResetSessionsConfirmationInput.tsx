interface ResetSessionsConfirmationInputProps {
  confirmationPhrase: string
  onPhraseChange: (value: string) => void
  isPhraseValid: boolean
  requiredPhrase: string
  disabled: boolean
}

export function ResetSessionsConfirmationInput({
  confirmationPhrase,
  onPhraseChange,
  isPhraseValid,
  requiredPhrase,
  disabled,
}: ResetSessionsConfirmationInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Type <span className="font-mono bg-gray-100 px-2 py-1 rounded">{requiredPhrase}</span> to
        confirm:
      </label>
      <input
        type="text"
        value={confirmationPhrase}
        onChange={(e) => onPhraseChange(e.target.value)}
        placeholder="Type the confirmation phrase"
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
          confirmationPhrase && !isPhraseValid
            ? 'border-red-300 focus:ring-red-500'
            : 'border-gray-300 focus:ring-red-500'
        }`}
        disabled={disabled}
      />
      {confirmationPhrase && !isPhraseValid && (
        <p className="mt-1 text-xs text-red-600">
          Phrase does not match. Please type exactly: {requiredPhrase}
        </p>
      )}
    </div>
  )
}
