import { ChevronDown } from 'lucide-react'

interface ErrorDetailsProps {
  message?: string
  details?: string
}

export function ErrorDetails({ message, details }: ErrorDetailsProps) {
  if (!message && !details) return null

  const showMessage = Boolean(message && message !== 'An unexpected error occurred')

  return (
    <details className="group w-full border border-gray-200 rounded-xl bg-white hover:border-gray-300 transition-all duration-200">
      <summary className="cursor-pointer list-none select-none px-5 py-4 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-xl flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="text-gray-400">ⓘ</span>
          View technical details
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180" />
      </summary>
      <div className="px-5 pb-5 pt-2 space-y-4 border-t border-gray-100">
        {showMessage && (
          <div className="w-full">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Error Message
            </p>
            <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
              <p className="text-sm text-gray-800 break-words leading-relaxed">{message}</p>
            </div>
          </div>
        )}

        {details && (
          <div className="w-full">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Technical Details
            </p>
            <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
              <pre className="text-xs text-gray-700 font-mono whitespace-pre-wrap break-all leading-relaxed">
                {details}
              </pre>
            </div>
          </div>
        )}
      </div>
    </details>
  )
}
