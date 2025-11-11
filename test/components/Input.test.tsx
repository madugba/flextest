import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '@/shared/ui/Input'

describe('Input Component', () => {
  it('should render input without label', () => {
    render(<Input placeholder="Enter text" />)
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toBeInTheDocument()
  })

  it('should render input with label', () => {
    render(<Input label="Email" />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('should show required indicator when required', () => {
    render(<Input label="Email" required />)
    const label = screen.getByText('Email')
    expect(label).toHaveTextContent('*')
  })

  it('should display error message', () => {
    render(<Input label="Email" error="Invalid email" />)
    expect(screen.getByText('Invalid email')).toBeInTheDocument()
    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('should display helper text when no error', () => {
    render(<Input label="Email" helperText="Enter your email address" />)
    expect(screen.getByText('Enter your email address')).toBeInTheDocument()
  })

  it('should not show helper text when error is present', () => {
    render(
      <Input
        label="Email"
        error="Invalid email"
        helperText="Enter your email address"
      />
    )
    expect(screen.getByText('Invalid email')).toBeInTheDocument()
    expect(screen.queryByText('Enter your email address')).not.toBeInTheDocument()
  })

  it('should handle user input', async () => {
    const user = userEvent.setup()
    render(<Input label="Email" />)
    const input = screen.getByLabelText('Email')

    await user.type(input, 'test@example.com')
    expect(input).toHaveValue('test@example.com')
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Input label="Email" disabled />)
    const input = screen.getByLabelText('Email')
    expect(input).toBeDisabled()
  })

  it('should apply fullWidth class when fullWidth is true', () => {
    render(<Input fullWidth />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('w-full')
  })
})

