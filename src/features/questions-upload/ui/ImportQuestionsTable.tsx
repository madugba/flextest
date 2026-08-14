import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'
import { ShieldCheck } from 'lucide-react'
import type { ParsedRow } from '../model/types'

interface ImportQuestionsTableProps {
  parsedRows: ParsedRow[]
}

export function ImportQuestionsTable({ parsedRows }: ImportQuestionsTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto max-h-[50vh] overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-muted z-10">
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead className="min-w-[200px]">Question</TableHead>
              <TableHead className="min-w-[110px]">Opt A</TableHead>
              <TableHead className="min-w-[110px]">Opt B</TableHead>
              <TableHead className="min-w-[110px]">Opt C</TableHead>
              <TableHead className="min-w-[110px]">Opt D</TableHead>
              <TableHead className="w-12">Ans</TableHead>
              <TableHead className="min-w-[180px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parsedRows.map((row) => (
              <TableRow
                key={row.rowNumber}
                className={row.valid ? '' : 'bg-red-50 hover:bg-red-100'}
              >
                <TableCell className="text-muted-foreground text-xs">{row.rowNumber}</TableCell>
                <TableCell>
                  <span className="block max-w-[240px] truncate text-xs" title={row.question}>
                    {row.question || <span className="text-muted-foreground italic">empty</span>}
                  </span>
                </TableCell>
                {(['optionA', 'optionB', 'optionC', 'optionD'] as const).map((field) => (
                  <TableCell key={field}>
                    <span
                      className={`block max-w-[130px] truncate text-xs ${
                        row.valid && row.answer === field.slice(-1).toUpperCase()
                          ? 'font-semibold text-green-700'
                          : ''
                      }`}
                      title={row[field]}
                    >
                      {row[field] || (
                        <span className="text-muted-foreground italic">empty</span>
                      )}
                    </span>
                  </TableCell>
                ))}
                <TableCell>
                  <span
                    className={`text-xs font-medium ${
                      row.valid ? 'text-green-700' : 'text-red-600'
                    }`}
                  >
                    {row.answer || '—'}
                  </span>
                </TableCell>
                <TableCell>
                  {row.valid ? (
                    <span className="inline-flex items-center gap-1 text-xs text-green-700 font-medium">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Valid
                    </span>
                  ) : (
                    <span className="inline-flex flex-col gap-0.5">
                      {row.errors.map((err, i) => (
                        <span key={i} className="text-xs text-red-600 leading-tight">
                          · {err}
                        </span>
                      ))}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
