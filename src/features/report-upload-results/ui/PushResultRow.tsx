'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { ChevronDown, ChevronRight, Copy, XCircle } from 'lucide-react'
import type { PushResult } from '../model/types'

export function PushResultRow({ result }: { result: PushResult }) {
  const [expanded, setExpanded] = useState(false)
  const payloadJson = JSON.stringify(result.item.payload, null, 2)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(payloadJson)
    toast.success('Payload copied to clipboard')
  }

  return (
    <div className="text-xs">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full flex items-start gap-2 px-3 py-2 text-left hover:bg-red-50/60 transition-colors"
      >
        <XCircle className="h-3.5 w-3.5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-gray-800 truncate">
            {result.item.candidateName} — {result.item.subjectName}
          </p>
          <p className="text-red-600 truncate">{result.error}</p>
        </div>
        {expanded ? (
          <ChevronDown className="h-3.5 w-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
        )}
      </button>

      {expanded && (
        <div className="px-3 pb-2">
          <div className="relative rounded-md border border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={handleCopy}
              className="absolute top-1.5 right-1.5 p-1 rounded hover:bg-gray-200 text-gray-500"
              aria-label="Copy payload JSON"
            >
              <Copy className="h-3 w-3" />
            </button>
            <pre className="p-2.5 pr-8 overflow-x-auto font-mono text-[11px] leading-relaxed text-gray-700">
              {payloadJson}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
