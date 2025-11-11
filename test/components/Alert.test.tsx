import { render, screen } from '@testing-library/react'
import { Alert, AlertTitle, AlertDescription } from '@/shared/ui/Alert'

describe('Alert Component', () => {
  it('should render alert with content', () => {
    render(
      <Alert>
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription>Alert description</AlertDescription>
      </Alert>
    )
    expect(screen.getByText('Alert Title')).toBeInTheDocument()
    expect(screen.getByText('Alert description')).toBeInTheDocument()
  })

  it('should apply variant classes', () => {
    const { rerender } = render(<Alert variant="destructive">Error</Alert>)
    let alert = screen.getByRole('alert')
    expect(alert).toHaveClass('text-destructive')

    rerender(<Alert variant="success">Success</Alert>)
    alert = screen.getByRole('alert')
    expect(alert).toHaveClass('bg-green-50')

    rerender(<Alert variant="warning">Warning</Alert>)
    alert = screen.getByRole('alert')
    expect(alert).toHaveClass('bg-yellow-50')

    rerender(<Alert variant="info">Info</Alert>)
    alert = screen.getByRole('alert')
    expect(alert).toHaveClass('bg-blue-50')
  })

  it('should merge custom className', () => {
    render(<Alert className="custom-alert">Custom</Alert>)
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('custom-alert')
  })

  it('should render complete alert structure', () => {
    render(
      <Alert variant="error">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Something went wrong</AlertDescription>
      </Alert>
    )
    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })
})

