import { FileText, Search } from 'lucide-react'

interface QuestionListEmptyStateProps {
  hasQuestions: boolean
}

export function QuestionListEmptyState({ hasQuestions }: QuestionListEmptyStateProps) {
  if (hasQuestions) {
    return (
      <div className="text-center py-12">
        <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No questions match your search</p>
        <p className="text-gray-400 text-sm mt-2">Try a different search term</p>
      </div>
    )
  }

  return (
    <div className="text-center py-12">
      <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500">No questions uploaded yet</p>
      <p className="text-gray-400 text-sm mt-2">Start by adding your first question</p>
    </div>
  )
}
