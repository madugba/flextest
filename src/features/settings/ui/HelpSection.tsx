export function HelpSection() {
  return (
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
  )
}
