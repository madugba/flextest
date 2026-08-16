'use client'

import { useState, type ReactNode } from 'react'
import { CheckCircle2, ChevronDown, ChevronRight, Loader2, XCircle } from 'lucide-react'
import type { StepStatus } from '../model/types'

export function StepCard({
  number,
  title,
  badge,
  status,
  children,
  optional = false,
  collapsible = false,
}: {
  number: number
  title: string
  badge?: string
  status: StepStatus
  children: ReactNode
  optional?: boolean
  collapsible?: boolean
}) {
  const [collapsed, setCollapsed] = useState(false)
  const locked  = status === 'locked'
  const loading = status === 'loading'
  const done    = status === 'done'
  const hasErr  = status === 'error'
  const canCollapse = collapsible && done

  return (
    <div
      className={`rounded-xl border transition-all duration-150 ${
        locked
          ? 'border-gray-200 bg-gray-50 pointer-events-none'
          : done
          ? 'border-green-200 bg-green-50/20'
          : hasErr
          ? 'border-red-200 bg-red-50/20'
          : 'border-gray-200 bg-white shadow-sm'
      }`}
    >
      {/* Header row */}
      <div
        role={canCollapse ? 'button' : undefined}
        tabIndex={canCollapse ? 0 : undefined}
        className={`flex items-center gap-3 px-4 py-3 ${canCollapse ? 'cursor-pointer select-none' : ''}`}
        onClick={() => canCollapse && setCollapsed(p => !p)}
        onKeyDown={(e) => { if (canCollapse && (e.key === 'Enter' || e.key === ' ')) setCollapsed(p => !p) }}
      >
        {/* Step number / status icon */}
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
            loading ? 'bg-blue-100 text-blue-600'
            : done   ? 'bg-green-500 text-white'
            : hasErr ? 'bg-red-500 text-white'
            : locked ? 'bg-gray-100 text-gray-400'
                     : 'bg-primary/10 text-primary'
          }`}
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
          : done    ? <CheckCircle2 className="w-4 h-4" />
          : hasErr  ? <XCircle className="w-4 h-4" />
          : locked  ? <span className="text-gray-400">{number}</span>
                    : number}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className={`text-sm font-semibold leading-tight ${locked ? 'text-gray-400' : 'text-gray-800'}`}>
              {title}
            </span>
            {optional && (
              <span className="text-xs text-gray-400 font-normal">(optional)</span>
            )}
          </div>
          {badge && done && (
            <p className="text-xs text-green-700 font-medium mt-0.5 truncate">{badge}</p>
          )}
        </div>

        {canCollapse && (
          collapsed
            ? <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            : <ChevronDown  className="w-4 h-4 text-gray-400 flex-shrink-0" />
        )}
      </div>

      {/* Body */}
      {!locked && (!canCollapse || !collapsed) && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
          {children}
        </div>
      )}
    </div>
  )
}
