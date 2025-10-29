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
import { Badge } from '@/shared/ui/Badge'
import { Spinner } from '@/shared/ui/Spinner'
import { Alert } from '@/shared/ui/Alert'
import { getAdminFullName, getAdminStatusLabel, type Admin } from '@/entities/admin'
import { BlockAdminButton } from '@/features/admin-block'
import { DeleteAdminDialog } from '@/features/admin-delete'
import { ChangePasswordDialog } from '@/features/admin-change-password'
import { useAdminTable } from '../model/useAdminTable'

interface AdminTableProps {
  onBlockUnblockSuccess?: (message: string) => void
  refreshTrigger?: number
}

export function AdminTable({ onBlockUnblockSuccess, refreshTrigger }: AdminTableProps = {}) {
  const { admins, loading, error, refresh } = useAdminTable({ refreshTrigger })

  const columns: ColumnDef<Admin>[] = [
    {
      accessorKey: 'firstName',
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold">
            {row.firstName?.[0]}{row.lastName?.[0]}
          </div>
          <span className="font-medium">{getAdminFullName(row)}</span>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      header: 'Center',
      cell: ({ row }) => (
        row.center?.name || <span className="text-muted-foreground">—</span>
      ),
    },
    {
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.isActive ? 'default' : 'destructive'}>
          {getAdminStatusLabel(row.isActive)}
        </Badge>
      ),
    },
    {
      header: 'Last Login',
      cell: ({ row }) => (
        row.lastLoginAt ? (
          new Date(row.lastLoginAt).toLocaleDateString()
        ) : (
          <span className="text-muted-foreground">Never</span>
        )
      ),
    },
    {
      header: <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="text-right">
          <AdminActions admin={row} onSuccess={refresh} onBlockUnblockSuccess={onBlockUnblockSuccess} />
        </div>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner />
        <span className="ml-2">Loading admins...</span>
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

  return <DataTable columns={columns} data={admins} emptyMessage="No admins found" />
}

interface AdminActionsProps {
  admin: Admin
  onSuccess: () => void
  onBlockUnblockSuccess?: (message: string) => void
}

function AdminActions({ admin, onSuccess, onBlockUnblockSuccess }: AdminActionsProps) {
  const handleBlockUnblock = (wasBlocked: boolean) => {
    if (onBlockUnblockSuccess) {
      const message = wasBlocked
        ? `Admin ${getAdminFullName(admin)} has been blocked successfully`
        : `Admin ${getAdminFullName(admin)} has been unblocked successfully`
      onBlockUnblockSuccess(message)
    } else {
      onSuccess()
    }
  }

  return (
    <ChangePasswordDialog onSuccess={onSuccess}>
      {({ onChangePassword }) => (
        <DeleteAdminDialog onSuccess={onSuccess}>
          {({ onDelete }) => (
            <BlockAdminButton admin={admin} onSuccess={handleBlockUnblock}>
              {({ onToggle }) => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onChangePassword(admin)}>
                      Change Password
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onToggle}>
                      {admin.isActive ? 'Block Admin' : 'Unblock Admin'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDelete(admin)}
                    >
                      Delete Admin
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </BlockAdminButton>
          )}
        </DeleteAdminDialog>
      )}
    </ChangePasswordDialog>
  )
}
