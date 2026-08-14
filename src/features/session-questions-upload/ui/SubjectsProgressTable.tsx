'use client'

import { Upload } from 'lucide-react'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { getProgressPercentage } from '../model/selectors/getProgressPercentage'
import type { SubjectQuestionStats } from '../model/types'
import { SubjectStatusBadge } from './SubjectStatusBadge'

interface SubjectsProgressTableProps {
  stats: SubjectQuestionStats[]
  onUpload: (subjectId: string) => void
}

export function SubjectsProgressTable({ stats, onUpload }: SubjectsProgressTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Uploaded
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Required
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Remaining
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stats.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No subjects found for this session
                </td>
              </tr>
            ) : (
              stats.map((stat) => {
                const remaining = Math.max(0, stat.required - stat.uploaded)
                const progress = getProgressPercentage(stat.uploaded, stat.required)

                return (
                  <tr key={stat.subject.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{stat.subject.name}</span>
                        {stat.isCompulsory && (
                          <Badge variant="outline" className="text-xs">
                            Compulsory
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-blue-600">{stat.uploaded}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{stat.required}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm font-semibold ${
                          remaining === 0 ? 'text-green-600' : 'text-orange-600'
                        }`}
                      >
                        {remaining}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <SubjectStatusBadge uploaded={stat.uploaded} required={stat.required} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        onClick={() => onUpload(stat.subject.id)}
                        size="sm"
                        variant={progress === 100 ? 'outline' : 'default'}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {progress === 100 ? 'Manage' : 'Upload'}
                      </Button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
