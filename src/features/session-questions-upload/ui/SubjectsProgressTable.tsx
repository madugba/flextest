'use client'

import type { SubjectQuestionStats } from '../model/types'
import { SubjectsEmptyRow } from './SubjectsEmptyRow'
import { SubjectsProgressRow } from './SubjectsProgressRow'
import { SubjectsTableHeader } from './SubjectsTableHeader'

interface SubjectsProgressTableProps {
  stats: SubjectQuestionStats[]
  onUpload: (subjectId: string) => void
}

export function SubjectsProgressTable({ stats, onUpload }: SubjectsProgressTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <SubjectsTableHeader />
          <tbody className="bg-white divide-y divide-gray-200">
            {stats.length === 0 ? (
              <SubjectsEmptyRow />
            ) : (
              stats.map((stat) => (
                <SubjectsProgressRow key={stat.subject.id} stat={stat} onUpload={onUpload} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
