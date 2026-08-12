'use client'

import type { Dispatch, SetStateAction } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Badge } from '@/shared/ui/Badge'
import { Checkbox } from '@/shared/ui/checkbox'
import { FileText, Search, X, Edit2, Trash2, CheckCircle2 } from 'lucide-react'
import type { Question } from '@/entities/question'

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Uploaded Questions</CardTitle>
        <CardDescription>Manage questions uploaded for this subject</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search questions, options..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-500 mt-2">
              Found {filteredQuestions.length} of {questions.length} questions
            </p>
          )}
        </div>

        {questions.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No questions uploaded yet</p>
            <p className="text-gray-400 text-sm mt-2">Start by adding your first question</p>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No questions match your search</p>
            <p className="text-gray-400 text-sm mt-2">Try a different search term</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 px-1 border-b">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <Checkbox
                  checked={
                    filteredQuestions.length > 0 &&
                    filteredQuestions.every((q) => selectedIds.has(q.id))
                  }
                  onCheckedChange={(checked) => {
                    setSelectedIds((prev) => {
                      const next = new Set(prev)
                      filteredQuestions.forEach((q) => {
                        if (checked) next.add(q.id)
                        else next.delete(q.id)
                      })
                      return next
                    })
                  }}
                />
                <span className="text-sm text-muted-foreground">
                  {selectedIds.size > 0
                    ? `${selectedIds.size} of ${filteredQuestions.length} selected`
                    : 'Select all'}
                </span>
              </label>

              {selectedIds.size > 0 && (
                <Button size="sm" variant="destructive" onClick={onRequestBulkDelete}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete {selectedIds.size} question{selectedIds.size !== 1 ? 's' : ''}
                </Button>
              )}
            </div>

            {filteredQuestions.map((question) => {
              const originalIndex = questions.findIndex((q) => q.id === question.id)
              return (
                <Card
                  key={question.id}
                  className={`border-2 transition-colors ${
                    selectedIds.has(question.id) ? 'border-primary/50 bg-primary/5' : ''
                  }`}
                >
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={selectedIds.has(question.id)}
                            onCheckedChange={(checked) => {
                              setSelectedIds((prev) => {
                                const next = new Set(prev)
                                if (checked) next.add(question.id)
                                else next.delete(question.id)
                                return next
                              })
                            }}
                          />
                          <Badge variant="outline" className="text-base px-3 py-1">
                            Question {originalIndex + 1}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => onEdit(question)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => onRequestDelete(question)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <p className="font-semibold text-gray-700 mb-2">Question:</p>
                        <div
                          className="text-gray-900 bg-gray-50 p-3 rounded"
                          dangerouslySetInnerHTML={{ __html: question.question }}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {['A', 'B', 'C', 'D'].map((option) => {
                          const optionKey = `option${option}` as keyof Question
                          const isCorrect = question.answer === option

                          return (
                            <div
                              key={option}
                              className={`p-3 rounded border-2 ${
                                isCorrect
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-gray-200 bg-gray-50'
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <Badge variant={isCorrect ? 'default' : 'outline'} className="shrink-0">
                                  {option}
                                </Badge>
                                <div
                                  className="flex-1 text-sm"
                                  dangerouslySetInnerHTML={{
                                    __html: question[optionKey] as string,
                                  }}
                                />
                                {isCorrect && (
                                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
