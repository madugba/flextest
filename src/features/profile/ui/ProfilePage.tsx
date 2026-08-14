'use client'

import { DashboardHeader } from '@/widgets/dashboard/ui/DashboardHeader'
import { Alert } from '@/shared/ui/Alert'
import { useProfilePage } from '../model/useProfilePage'
import { DangerZoneSection } from './DangerZoneSection'
import { DeleteAccountDialog } from './DeleteAccountDialog'
import { ProfileDetails } from './ProfileDetails'
import { ProfileForm } from './ProfileForm'
import { ProfileHeader } from './ProfileHeader'

export function ProfilePage() {
  const {
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
  } = useProfilePage()

  if (!user) {
    return (
      <div className="h-screen overflow-y-auto bg-gray-50">
        <DashboardHeader serverStatus="healthy" lastUpdate={new Date()} connected={true} />
        <div className="p-6">
          <Alert variant="destructive">No user data available</Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen overflow-y-auto bg-gray-50">
      <DashboardHeader serverStatus="healthy" lastUpdate={new Date()} connected={true} />

      <div className="p-6 max-w-4xl mx-auto space-y-6 pb-12 min-h-[calc(100vh-64px)]">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <ProfileHeader user={user} isEditing={isEditing} onEdit={handleEdit} />
          <div className="p-6 space-y-4">
            {isEditing ? (
              <ProfileForm
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                isLoading={isLoading}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            ) : (
              <ProfileDetails user={user} />
            )}
          </div>
        </div>

        {/* Danger Zone */}
        {!isEditing && <DangerZoneSection onDelete={() => setShowDeleteDialog(true)} />}

        {/* Delete Confirmation Dialog */}
        <DeleteAccountDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          isLoading={isLoading}
          onConfirm={handleDeleteAccount}
        />
      </div>
    </div>
  )
}
