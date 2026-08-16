'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/shared/hooks/useAuth'
import { useDeleteAdminMutation, useUpdateAdminMutation } from '@/entities/admin'
import { createHandleCancel } from './handlers/createHandleCancel'
import { createHandleDeleteAccount } from './handlers/createHandleDeleteAccount'
import { createHandleEdit } from './handlers/createHandleEdit'
import { createHandleSave } from './handlers/createHandleSave'
import type { ProfilePageController } from './types'

export function useProfilePage(): ProfilePageController {
  const router = useRouter()
  const { user, logout, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')

  const updateMutation = useUpdateAdminMutation()
  const deleteMutation = useDeleteAdminMutation()

  const isLoading = updateMutation.isPending || deleteMutation.isPending

  const handleEdit = useCallback(
    () => createHandleEdit(setIsEditing, setFirstName, setLastName, user)(),
    [setIsEditing, setFirstName, setLastName, user]
  )

  const handleCancel = useCallback(() => createHandleCancel(setIsEditing)(), [setIsEditing])

  const handleSave = useCallback(
    () =>
      createHandleSave({
        user,
        firstName,
        lastName,
        updateUser,
        updateMutation,
        setIsEditing,
      })(),
    [user, firstName, lastName, updateUser, updateMutation, setIsEditing]
  )

  const handleDeleteAccount = useCallback(
    () =>
      createHandleDeleteAccount({
        user,
        router,
        logout,
        deleteMutation,
        setShowDeleteDialog,
      })(),
    [user, router, logout, deleteMutation, setShowDeleteDialog]
  )

  return {
    user,
    isEditing,
    isLoading,
    showDeleteDialog,
    setShowDeleteDialog,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    handleEdit,
    handleCancel,
    handleSave,
    handleDeleteAccount,
  }
}
