export type {
  Admin,
  CreateAdminRequest,
  UpdateAdminRequest,
  UpdatePasswordRequest,
} from './model/types'

export { AdminStatus } from './model/types'

export {
  getAllAdmins,
  getAdminByEmail,
  createAdmin,
  updateAdmin,
  updateAdminPassword,
  deleteAdmin,
  blockAdmin,
  unblockAdmin,
} from './api/adminApi'

export {
  useAdminsQuery,
} from './model/queries'

export {
  useCreateAdminMutation,
  useUpdateAdminMutation,
  useUpdateAdminPasswordMutation,
  useDeleteAdminMutation,
  useBlockAdminMutation,
  useUnblockAdminMutation,
} from './model/mutations'

export {
  validateCreateAdmin,
  validatePasswordChange,
  getAdminFullName,
  getAdminStatusLabel,
  MIN_PASSWORD_LENGTH,
} from './lib/validation'
