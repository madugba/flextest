import { useState } from 'react'
import type { Question } from '@/entities/question'
import type { QuestionFormData } from '../types'

export function useQuestionFormState() {
  const [formData, setFormData] = useState<QuestionFormData>({
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    answer: '',
  })

  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('single')
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  return {
    formData,
    setFormData,
    editingQuestion,
    setEditingQuestion,
    deleteDialogOpen,
    setDeleteDialogOpen,
    questionToDelete,
    setQuestionToDelete,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    editDialogOpen,
    setEditDialogOpen,
  }
}
