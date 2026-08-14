import type { Dispatch, FormEvent, SetStateAction } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { Plus, FileText } from 'lucide-react'
import type { Question } from '@/entities/question'
import type { QuestionFormData } from '../model/types'
import { QuestionForm } from './QuestionForm'
import { QuestionList } from './QuestionList'

interface QuestionTabsProps {
  activeTab: string
  setActiveTab: Dispatch<SetStateAction<string>>
  uploadedCount: number
  formData: QuestionFormData
  setFormData: Dispatch<SetStateAction<QuestionFormData>>
  isSaving: boolean
  onSubmit: (e: FormEvent) => Promise<void>
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

export function QuestionTabs({
  activeTab,
  setActiveTab,
  uploadedCount,
  formData,
  setFormData,
  isSaving,
  onSubmit,
  questions,
  filteredQuestions,
  searchQuery,
  setSearchQuery,
  selectedIds,
  setSelectedIds,
  onEdit,
  onRequestDelete,
  onRequestBulkDelete,
}: QuestionTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="single">
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </TabsTrigger>
        <TabsTrigger value="list">
          <FileText className="h-4 w-4 mr-2" />
          All Questions ({uploadedCount})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="single">
        <QuestionForm formData={formData} setFormData={setFormData} isSaving={isSaving} onSubmit={onSubmit} />
      </TabsContent>

      <TabsContent value="list">
        <QuestionList
          questions={questions}
          filteredQuestions={filteredQuestions}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          onEdit={onEdit}
          onRequestDelete={onRequestDelete}
          onRequestBulkDelete={onRequestBulkDelete}
        />
      </TabsContent>
    </Tabs>
  )
}
