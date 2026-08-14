export function validateSelectedSubjects(selectedSubjects: string[]): string | null {
  if (selectedSubjects.length === 0) return 'Please select at least one subject'
  if (selectedSubjects.length > 6) return 'Maximum of 6 subjects allowed'
  return null
}
