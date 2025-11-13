import { render, screen } from '@testing-library/react'
import { Badge } from '@/shared/ui/Badge'

describe('Badge Component', () => {
  it('should render badge with text', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('should apply variant classes', () => {
    const { rerender } = render(<Badge variant="destructive">Error</Badge>)
    let badge = screen.getByText('Error')
    expect(badge).toHaveClass('bg-destructive')

    rerender(<Badge variant="outline">Outline</Badge>)
    badge = screen.getByText('Outline')
    expect(badge).toBeInTheDocument()
  })

  it('should merge custom className', () => {
    render(<Badge className="custom-badge">Custom</Badge>)
    const badge = screen.getByText('Custom')
    expect(badge).toHaveClass('custom-badge')
  })

  it('should render as child component when asChild is true', () => {
    render(
      <Badge asChild>
        <a href="/test">Link Badge</a>
      </Badge>
    )
    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test')
  })
})

