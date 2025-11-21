# Test Suite

This directory contains all unit and integration tests for the flextest application.

## Structure

```
test/
├── api/          # API client and service tests
├── components/   # React component tests
├── hooks/        # Custom React hooks tests
├── integration/  # Integration tests (to be added)
├── unit/         # Unit tests for utilities and services
└── utils/        # Utility function tests
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run only unit tests
npm run test:unit
```

## Test Coverage

Current coverage targets:
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## Test Files

### Components
- `Button.test.tsx` - Button component tests
- `Card.test.tsx` - Card component tests

### Hooks
- `useSocket.test.ts` - Socket hook tests

### API
- `client.test.ts` - API client tests

### Utils
- `utils.test.ts` - Utility function tests (cn)
- `helpers.test.ts` - Candidate helper function tests

### Unit
- `socket-client.test.ts` - Socket client singleton tests

