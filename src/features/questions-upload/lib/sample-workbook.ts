import * as XLSX from 'xlsx'

export const SAMPLE_QUESTION_ROWS = [
  {
    question: 'What is 2 + 2?',
    optionA: '3',
    optionB: '4',
    optionC: '5',
    optionD: '6',
    answer: 'B',
  },
  {
    question: 'What is the capital of France?',
    optionA: 'London',
    optionB: 'Berlin',
    optionC: 'Paris',
    optionD: 'Madrid',
    answer: 'C',
  },
  {
    question: 'Which planet is known as the Red Planet?',
    optionA: 'Venus',
    optionB: 'Mars',
    optionC: 'Jupiter',
    optionD: 'Saturn',
    answer: 'B',
  },
] as const

export function downloadSampleQuestionWorkbook(): void {
  const worksheet = XLSX.utils.json_to_sheet([...SAMPLE_QUESTION_ROWS])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Questions')
  XLSX.writeFile(workbook, 'questions_sample.xlsx')
}
