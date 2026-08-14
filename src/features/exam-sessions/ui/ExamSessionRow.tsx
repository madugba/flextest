import Link from 'next/link'
import { MoreVertical, Copy } from 'lucide-react'
import type { ExamSession } from '@/entities/exam-session'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { getStatusBadgeColor } from '../model/selectors/getStatusBadgeColor'

interface ExamSessionRowProps {
  session: ExamSession
  onStart: (sessionId: string) => void
  onUploadQuestions: (sessionId: string) => void
  onReschedule: (session: ExamSession) => void
  onDuplicate: (session: ExamSession) => void
  onEdit: (session: ExamSession) => void
  onDelete: (session: ExamSession) => void
}

export function ExamSessionRow({
  session,
  onStart,
  onUploadQuestions,
  onReschedule,
  onDuplicate,
  onEdit,
  onDelete,
}: ExamSessionRowProps) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <Link
          href={`/dashboard/monitoring?session=${session.id}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          {session.name}
        </Link>
        <div className="text-xs text-gray-500">{session.totalQuestion} questions total</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div>{new Date(session.date).toLocaleDateString()}</div>
        <div className="text-xs">{session.time}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {session.center ? (
          <div>
            <div className="font-medium text-gray-900">{session.center.centerName}</div>
            <div className="text-xs">{session.center.state}</div>
          </div>
        ) : (
          <span className="text-gray-400">No center assigned</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.hallCapacity}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div>{session.duration} min</div>
        <div className="text-xs text-gray-400">
          {Math.floor(session.duration / 60)}h {session.duration % 60}m
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(session.status)}`}
        >
          {session.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary">
              <MoreVertical className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onStart(session.id)}>Start Exam</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUploadQuestions(session.id)}>Upload Questions</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onReschedule(session)}>Reschedule Exam</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate(session)}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate Exam
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(session)}>Edit</DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => onDelete(session)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  )
}
