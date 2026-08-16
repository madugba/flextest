'use client'

import { useCallback, useRef, useState } from 'react'
import { proxyFetch } from '../lib/proxyFetch'
import { runWithConcurrency } from '../lib/concurrency'
import type { APIConfiguration, PushProgress, PushResult, ScorePushItem } from './types'

type PushStatus = 'idle' | 'pushing' | 'done'

// Bounded parallelism: fast enough for pushes in the thousands without
// opening thousands of simultaneous connections to our proxy / the external API.
const PUSH_CONCURRENCY = 8

const emptyProgress = (total: number): PushProgress => ({ completed: 0, total, succeeded: 0, failed: 0 })

async function pushOne(item: ScorePushItem, config: APIConfiguration): Promise<PushResult> {
  try {
    await proxyFetch(config.apiEndpoint, {
      method: 'POST',
      apiKey: config.apiKey ?? undefined,
      body: item.payload,
    })
    return { item, success: true }
  } catch (err) {
    return { item, success: false, error: err instanceof Error ? err.message : 'Push failed' }
  }
}

/**
 * Pushes score items to an external API with bounded concurrency, tracking
 * live progress and a final summary. Results accumulate in a ref (not state)
 * while running — at thousands of items, copying a growing array into state
 * on every single completion would cost O(n^2) work; only small progress
 * counters go through state during the run, and the full result list is
 * committed to state once at the end for the summary view.
 */
export function useScorePush() {
  const [pushApiId, setPushApiId] = useState('')
  const [status, setStatus] = useState<PushStatus>('idle')
  const [progress, setProgress] = useState<PushProgress>(emptyProgress(0))
  const [results, setResults] = useState<PushResult[]>([])
  const resultsRef = useRef<PushResult[]>([])

  const runItems = useCallback(async (
    items: ScorePushItem[],
    config: APIConfiguration,
    startingResults: PushResult[]
  ) => {
    resultsRef.current = [...startingResults]
    setStatus('pushing')
    setProgress({
      completed: startingResults.length,
      total: startingResults.length + items.length,
      succeeded: startingResults.filter((r) => r.success).length,
      failed: startingResults.filter((r) => !r.success).length,
    })

    await runWithConcurrency(items, PUSH_CONCURRENCY, async (item) => {
      const result = await pushOne(item, config)
      resultsRef.current.push(result)
      setProgress((prev) => ({
        completed: prev.completed + 1,
        total: prev.total,
        succeeded: prev.succeeded + (result.success ? 1 : 0),
        failed: prev.failed + (result.success ? 0 : 1),
      }))
    })

    setResults(resultsRef.current)
    setStatus('done')
  }, [])

  const runBatch = useCallback(
    (items: ScorePushItem[], config: APIConfiguration) => runItems(items, config, []),
    [runItems]
  )

  const retryFailed = useCallback((config: APIConfiguration) => {
    const succeededSoFar = resultsRef.current.filter((r) => r.success)
    const failedItems = resultsRef.current.filter((r) => !r.success).map((r) => r.item)
    if (!failedItems.length) return Promise.resolve()
    return runItems(failedItems, config, succeededSoFar)
  }, [runItems])

  const reset = useCallback(() => {
    setPushApiId('')
    setStatus('idle')
    setProgress(emptyProgress(0))
    setResults([])
    resultsRef.current = []
  }, [])

  return { pushApiId, setPushApiId, status, progress, results, runBatch, retryFailed, reset }
}
