import { StyleSheet } from '@react-pdf/renderer'

export const tableStyles = StyleSheet.create({
  table: {
    width: '100%',
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #e5e7eb',
    paddingVertical: 8,
    minHeight: 40,
    alignItems: 'flex-start',
    width: '100%',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingVertical: 10,
    fontWeight: 'bold',
    alignItems: 'center',
    width: '100%',
  },
  tableCell: {
    padding: 6,
    fontSize: 9,
  },
  candidateCell: {
    padding: 6,
    fontSize: 9,
    fontWeight: 'bold',
    width: 120,
    minWidth: 120,
  },
  subjectCell: {
    padding: 6,
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    minWidth: 80,
  },
  subjectCellContent: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
  },
  subjectCellLabel: {
    fontSize: 8,
    color: '#6b7280',
    marginBottom: 3,
  },
  subjectCellValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  totalCell: {
    padding: 6,
    fontSize: 10,
    fontWeight: 'bold',
    width: 80,
    minWidth: 80,
    textAlign: 'right',
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    border: '1 solid #bfdbfe',
    borderRadius: 4,
    padding: 10,
    marginTop: 10,
  },
  infoText: {
    fontSize: 8,
    color: '#1e40af',
    marginBottom: 3,
  },
})
