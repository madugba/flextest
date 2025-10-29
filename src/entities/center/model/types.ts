export interface Center {
  id: string
  centerName: string
  address: string
  phone: string
  email: string
  state: string
  lga: string
  createdAt: string
  updatedAt: string
}

export interface CreateCenterRequest {
  centerName: string
  address: string
  phone: string
  email: string
  state: string
  lga: string
}

export interface UpdateCenterRequest {
  centerName?: string
  address?: string
  phone?: string
  email?: string
  state?: string
  lga?: string
}
