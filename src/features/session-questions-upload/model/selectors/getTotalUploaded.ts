import type { SubjectQuestionStats } from '../types'

export function getTotalUploaded(stats: SubjectQuestionStats[]): number {
  return stats.reduce((sum, stat) => sum + stat.uploaded, 0)
}
