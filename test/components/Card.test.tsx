import { render, screen } from '@testing-library/react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from '@/shared/ui/Card'

describe('Card Components', () => {
  describe('Card', () => {
    it('should render card with children', () => {
      render(
        <Card>
          <div>Card content</div>
        </Card>
      )
      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      render(<Card className="custom-card" data-testid="card" />)
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('custom-card')
    })
  })

  describe('CardHeader', () => {
    it('should render card header', () => {
      render(
        <Card>
          <CardHeader>Header content</CardHeader>
        </Card>
      )
      expect(screen.getByText('Header content')).toBeInTheDocument()
    })
  })

  describe('CardTitle', () => {
    it('should render card title', () => {
      render(
        <Card>
          <CardTitle>Card Title</CardTitle>
        </Card>
      )
      expect(screen.getByText('Card Title')).toBeInTheDocument()
    })
  })

  describe('CardDescription', () => {
    it('should render card description', () => {
      render(
        <Card>
          <CardDescription>Card description</CardDescription>
        </Card>
      )
      expect(screen.getByText('Card description')).toBeInTheDocument()
    })
  })

  describe('CardContent', () => {
    it('should render card content', () => {
      render(
        <Card>
          <CardContent>Main content</CardContent>
        </Card>
      )
      expect(screen.getByText('Main content')).toBeInTheDocument()
    })
  })

  describe('CardFooter', () => {
    it('should render card footer', () => {
      render(
        <Card>
          <CardFooter>Footer content</CardFooter>
        </Card>
      )
      expect(screen.getByText('Footer content')).toBeInTheDocument()
    })
  })

  describe('CardAction', () => {
    it('should render card action', () => {
      render(
        <Card>
          <CardAction>Action button</CardAction>
        </Card>
      )
      expect(screen.getByText('Action button')).toBeInTheDocument()
    })
  })

  describe('Full Card Structure', () => {
    it('should render complete card structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
            <CardDescription>Test Description</CardDescription>
            <CardAction>Action</CardAction>
          </CardHeader>
          <CardContent>Content</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>
      )

      expect(screen.getByText('Test Card')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
      expect(screen.getByText('Content')).toBeInTheDocument()
      expect(screen.getByText('Footer')).toBeInTheDocument()
      expect(screen.getByText('Action')).toBeInTheDocument()
    })
  })
})

