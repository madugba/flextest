# Design System Components

A comprehensive design system built with Tailwind CSS for the FlexTest Admin application.

## Design Tokens

### Colors

**Primary**: Indigo-600 (#4f46e5)
- Used for primary actions, links, and brand elements
- Hover: #4338ca
- Active: #3730a3

**Secondary**: Slate-600 (#64748b)
- Used for secondary actions and less prominent elements
- Hover: #475569
- Active: #334155

**Semantic Colors**:
- Success: Green-600 (#10b981)
- Warning: Amber-600 (#f59e0b)
- Error: Red-600 (#ef4444)
- Info: Blue-600 (#3b82f6)

### Typography

System font stack with optimized rendering:
```
-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif
```

### Spacing Scale

- XS: 0.25rem (4px)
- SM: 0.5rem (8px)
- MD: 1rem (16px)
- LG: 1.5rem (24px)
- XL: 2rem (32px)
- 2XL: 3rem (48px)

### Border Radius

- SM: 0.375rem (6px)
- MD: 0.5rem (8px)
- LG: 0.75rem (12px)
- XL: 1rem (16px)
- FULL: 9999px

## Components

### Button

A versatile button component with multiple variants and sizes.

```tsx
import { Button } from '@/shared/ui'

// Primary button (default)
<Button>Click me</Button>

// Variants
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Loading state
<Button isLoading>Saving...</Button>

// Full width
<Button fullWidth>Full Width</Button>
```

**Props**:
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean
- `fullWidth`: boolean
- All standard button HTML attributes

### Input

A form input component with label, error, and helper text support.

```tsx
import { Input } from '@/shared/ui'

<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
/>

// With error
<Input
  label="Password"
  type="password"
  error="Password must be at least 8 characters"
/>

// With helper text
<Input
  label="Username"
  helperText="Choose a unique username"
/>

// Full width
<Input label="Full Name" fullWidth />
```

**Props**:
- `label`: string
- `error`: string
- `helperText`: string
- `fullWidth`: boolean
- All standard input HTML attributes

### Card

A container component for grouping related content.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/shared/ui'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Optional description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Variants
<Card variant="default">Default Card</Card>
<Card variant="bordered">Bordered Card</Card>
<Card variant="elevated">Elevated Card</Card>

// Padding
<Card padding="none">No Padding</Card>
<Card padding="sm">Small Padding</Card>
<Card padding="lg">Large Padding</Card>
```

**Card Props**:
- `variant`: 'default' | 'bordered' | 'elevated'
- `padding`: 'none' | 'sm' | 'md' | 'lg'

### Badge

Small status indicators or labels.

```tsx
import { Badge } from '@/shared/ui'

<Badge>Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">Info</Badge>

// Sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
```

**Props**:
- `variant`: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
- `size`: 'sm' | 'md' | 'lg'

### Alert

Display important messages to users.

```tsx
import { Alert } from '@/shared/ui'

<Alert variant="success" title="Success">
  Your changes have been saved successfully.
</Alert>

<Alert variant="warning" title="Warning">
  Please verify your email address.
</Alert>

<Alert variant="error" title="Error">
  An error occurred while processing your request.
</Alert>

<Alert variant="info" title="Info">
  New features are available!
</Alert>

// With close button
<Alert
  variant="success"
  onClose={() => console.log('closed')}
>
  Dismissible alert
</Alert>
```

**Props**:
- `variant`: 'success' | 'warning' | 'error' | 'info'
- `title`: string (optional)
- `onClose`: () => void (optional, adds close button)

### Spinner

Loading indicator.

```tsx
import { Spinner } from '@/shared/ui'

<Spinner />
```

## Usage Guidelines

### Accessibility

All components include proper ARIA attributes and keyboard navigation support:
- Buttons have proper focus states
- Inputs have associated labels
- Alerts have appropriate roles
- Focus is visible and follows WCAG guidelines

### Responsive Design

Components are fully responsive and work across all device sizes:
- Mobile-first approach
- Breakpoint-aware spacing
- Touch-friendly hit targets (min 44x44px)

### Dark Mode

All colors automatically adapt to dark mode via CSS custom properties defined in `globals.css`.

### Best Practices

1. **Use semantic variants**: Choose the variant that matches the action's meaning
2. **Consistent sizing**: Stick to the defined size scale
3. **Accessibility first**: Always provide labels for inputs and meaningful button text
4. **Loading states**: Use `isLoading` prop instead of disabling buttons
5. **Error messages**: Provide clear, actionable error messages

## Customization

All design tokens are defined as CSS custom properties in `src/app/globals.css`. You can customize them to match your brand:

```css
:root {
  --primary: #your-primary-color;
  --secondary: #your-secondary-color;
  /* ... other tokens */
}
```

## Examples

See the error page (`src/app/error/page.tsx`) for real-world usage examples of these components.
