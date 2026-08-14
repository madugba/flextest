import { toast } from 'sonner'
import * as XLSX from 'xlsx'
import type { ExcelCandidate } from '../model/types'

export async function parseExcelFile(file: File): Promise<ExcelCandidate[]> {
  const workbook = XLSX.read(await file.arrayBuffer())
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
  const normalizeCol = (name: string) => {
    const n = name.trim().toLowerCase().replace(/\s+/g, '')
    if (['candidateid', 'studentid'].includes(n)) return 'candidateid'
    if (['lastname', 'surname'].includes(n)) return 'lastName'
    if (['firstname', 'givenname'].includes(n)) return 'firstName'
    if (['othername', 'middlename'].includes(n)) return 'otherName'
    return n
  }
  const firstRow = rows[0] as Record<string, unknown>
  if (!firstRow) throw new Error('Excel file is empty')
  const colMap: Record<string, string> = {}
  Object.keys(firstRow).forEach((k) => {
    const n = normalizeCol(k)
    if (['candidateid', 'lastName', 'firstName', 'otherName'].includes(n)) colMap[n] = k
  })
  if (!colMap.lastName || !colMap.firstName)
    throw new Error('Excel must have "lastName" and "firstName" columns')
  return (rows as Record<string, unknown>[]).map((row, i) => {
    const lastName = String(row[colMap.lastName] || '').trim()
    const firstName = String(row[colMap.firstName] || '').trim()
    if (!lastName || !firstName) throw new Error(`Row ${i + 2} is missing name fields`)
    return {
      candidateid: colMap.candidateid ? String(row[colMap.candidateid] || '').trim() || null : null,
      lastName,
      firstName,
      otherName: colMap.otherName ? String(row[colMap.otherName] || '').trim() || null : null,
    }
  })
}

export function downloadSampleExcel() {
  const ws = XLSX.utils.json_to_sheet([
    { candidateid: 'BPA/21/043', lastName: 'Okpoko', firstName: 'Maryann', otherName: '' },
    { candidateid: null, lastName: 'Smith', firstName: 'John', otherName: 'Michael' },
    { candidateid: 'BPA/23/1114', lastName: 'Onyejiaka', firstName: 'Ifechukwu', otherName: '' },
  ])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Candidates')
  XLSX.writeFile(wb, 'candidates_sample.xlsx')
  toast.success('Sample file downloaded!')
}
