'use client'

import { DataTable, type ColumnDef } from '@/shared/ui/data-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { Button } from '@/shared/ui/Button'
import { Spinner } from '@/shared/ui/Spinner'
import { Alert } from '@/shared/ui/Alert'
import { getCenterDisplayName, getCenterShortAddress, type Center } from '@/entities/center'
import { EditCenterDialog } from '@/features/center-edit'
import { DeleteCenterDialog } from '@/features/center-delete'
import { useCenterTable } from '../model/useCenterTable'

interface CenterTableProps {
  onUpdateSuccess?: (message: string) => void
  refreshTrigger?: number
}

export function CenterTable({ onUpdateSuccess, refreshTrigger }: CenterTableProps = {}) {
  const { centers, loading, error, refresh } = useCenterTable({ refreshTrigger })

  const columns: ColumnDef<Center>[] = [
    {
      accessorKey: 'centerName',
      header: 'Center Name',
      cell: ({ row }) => (
        <div className="font-medium">{getCenterDisplayName(row)}</div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
    },
    {
      header: 'Location',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {getCenterShortAddress(row)}
        </span>
      ),
    },
    {
      header: <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="text-right">
          <CenterActions center={row} onSuccess={refresh} onUpdateSuccess={onUpdateSuccess} />
        </div>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner />
        <span className="ml-2">Loading centers...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <div className="flex flex-col gap-2">
          <p>{error}</p>
          {error.includes('Authentication required') && (
            <a href="/login" className="text-sm underline hover:no-underline">
              Go to Login →
            </a>
          )}
        </div>
      </Alert>
    )
  }

  return <DataTable columns={columns} data={centers} emptyMessage="No centers found" />
}

interface CenterActionsProps {
  center: Center
  onSuccess: () => void
  onUpdateSuccess?: (message: string) => void
}

function CenterActions({ center, onSuccess, onUpdateSuccess }: CenterActionsProps) {
  const handleUpdate = () => {
    if (onUpdateSuccess) {
      onUpdateSuccess(`Center ${getCenterDisplayName(center)} has been updated successfully`)
    } else {
      onSuccess()
    }
  }

  const handleDelete = () => {
    if (onUpdateSuccess) {
      onUpdateSuccess(`Center ${getCenterDisplayName(center)} has been deleted successfully`)
    } else {
      onSuccess()
    }
  }

  return (
    <EditCenterDialog onSuccess={handleUpdate}>
      {({ onEdit }) => (
        <DeleteCenterDialog onSuccess={handleDelete}>
          {({ onDelete }) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onEdit(center)}>
                  Edit Center
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onDelete(center)}
                >
                  Delete Center
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </DeleteCenterDialog>
      )}
    </EditCenterDialog>
  )
}
