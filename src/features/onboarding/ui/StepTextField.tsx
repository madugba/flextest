import type { ChangeEvent, ReactNode } from 'react'

interface StepTextFieldProps {
  name: string
  label: string
  value: string
  type?: string
  placeholder: string
  minLength?: number
  footer?: ReactNode
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export function StepTextField({
  name,
  label,
  value,
  type = 'text',
  placeholder,
  minLength,
  footer,
  onChange,
}: StepTextFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        minLength={minLength}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
        placeholder={placeholder}
      />
      {footer}
    </div>
  )
}
