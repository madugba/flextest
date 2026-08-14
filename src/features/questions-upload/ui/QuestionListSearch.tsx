import type { Dispatch, SetStateAction } from 'react'
import { Input } from '@/shared/ui/Input'
import { Search, X } from 'lucide-react'

interface QuestionListSearchProps {
  searchQuery: string
  setSearchQuery: Dispatch<SetStateAction<string>>
  foundCount: number
  totalCount: number
}

export function QuestionListSearch({
  searchQuery,
  setSearchQuery,
  foundCount,
  totalCount,
}: QuestionListSearchProps) {
  return (
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
          Found {foundCount} of {totalCount} questions
        </p>
      )}
    </div>
  )
}
