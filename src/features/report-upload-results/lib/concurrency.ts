/**
 * Runs `worker` over `items` with at most `concurrency` in flight at once.
 * Each worker pulls the next item off a shared cursor as it finishes, so
 * slow items don't hold up a whole fixed-size batch the way chunking would.
 */
export async function runWithConcurrency<T>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<void>
): Promise<void> {
  let cursor = 0

  async function runNext(): Promise<void> {
    const index = cursor++
    if (index >= items.length) return
    await worker(items[index], index)
    return runNext()
  }

  const workerCount = Math.min(concurrency, items.length)
  await Promise.all(Array.from({ length: workerCount }, () => runNext()))
}
