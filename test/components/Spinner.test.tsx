import { render, screen } from '@testing-library/react'
import { Spinner } from '@/shared/ui/Spinner'

describe('Spinner Component', () => {
  it('should render spinner', () => {
    render(<Spinner />)
    const spinner = screen.getByRole('status')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveAttribute('aria-label', 'Loading')
  })

  it('should apply custom className', () => {
    render(<Spinner className="custom-spinner" />)
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('custom-spinner')
  })

  it('should have animate-spin class', () => {
    render(<Spinner />)
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('animate-spin')
  })
})

