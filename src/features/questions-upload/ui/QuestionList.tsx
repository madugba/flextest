'use client'

import type { Dispatch, SetStateAction } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/Card'
import type { Question } from '@/entities/question'
import { QuestionListSearch } from './QuestionListSearch'
import { QuestionListToolbar } from './QuestionListToolbar'
import { QuestionCard } from './QuestionCard'
import { QuestionListEmptyState } from './QuestionListEmptyState'

interface QuestionListProps {
  questions: Question[]
  filteredQuestions: Question[]
  searchQuery: string
  setSearchQuery: Dispatch<SetStateAction<string>>
  selectedIds: Set<string>
  setSelectedIds: Dispatch<SetStateAction<Set<string>>>
  onEdit: (question: Question) => void
  onRequestDelete: (question: Question) => void
  onRequestBulkDelete: () => void
}

export function QuestionList({
  questions,
  filteredQuestions,
  searchQuery,
  setSearchQuery,
  selectedIds,
  setSelectedIds,
  onEdit,
  onRequestDelete,
  onRequestBulkDelete,
}: QuestionListProps) {
  const hasQuestions = questions.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uploaded Questions</CardTitle>
        <CardDescription>Manage questions uploaded for this subject</CardDescription>
      </CardHeader>
      <CardContent>
        <QuestionListSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          foundCount={filteredQuestions.length}
          totalCount={questions.length}
        />

        {!hasQuestions ? (
          <QuestionListEmptyState hasQuestions={false} />
        ) : filteredQuestions.length === 0 ? (
          <QuestionListEmptyState hasQuestions={true} />
        ) : (
          <div className="space-y-4">
            <QuestionListToolbar
              filteredQuestions={filteredQuestions}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              onRequestBulkDelete={onRequestBulkDelete}
            />

            {filteredQuestions.map((question) => {
              const originalIndex = questions.findIndex((q) => q.id === question.id)
              return (
                <QuestionCard
                  key={question.id}
                  question={question}
                  originalIndex={originalIndex}
                  selected={selectedIds.has(question.id)}
                  setSelectedIds={setSelectedIds}
                  onEdit={onEdit}
                  onRequestDelete={onRequestDelete}
                />
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
