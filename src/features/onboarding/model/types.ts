export interface CenterData {
  centerName: string
  address: string
  phone: string
  email: string
  state: string
  lga: string
}

export interface AdminData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

export interface OnboardingStep {
  number: number
  title: string
}
