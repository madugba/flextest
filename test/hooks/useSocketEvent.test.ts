import { renderHook } from '@testing-library/react'
import { useSocketEvent } from '@/shared/hooks/useSocketEvent'
import { useSocket } from '@/shared/hooks/useSocket'

jest.mock('@/shared/hooks/useSocket')

const mockUseSocket = useSocket as jest.MockedFunction<typeof useSocket>

describe('useSocketEvent Hook', () => {
  const mockSocket = {
    on: jest.fn(() => jest.fn()),
    off: jest.fn(),
    emit: jest.fn(),
    connected: true,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseSocket.mockReturnValue({
      socket: mockSocket as any,
      state: {
        status: 'connected',
        connected: true,
        reconnectAttempts: 0,
      },
      isConnected: true,
      reconnectAttempts: 0,
    })
  })

  it('should subscribe to socket event when connected', () => {
    const handler = jest.fn()

    renderHook(() => {
      useSocketEvent('candidate:login', handler)
    })

    expect(mockSocket.on).toHaveBeenCalledWith('candidate:login', expect.any(Function))
  })

  it('should not subscribe when not connected', () => {
    mockUseSocket.mockReturnValue({
      socket: null,
      state: {
        status: 'disconnected',
        connected: false,
        reconnectAttempts: 0,
      },
      isConnected: false,
      reconnectAttempts: 0,
    })

    const handler = jest.fn()

    renderHook(() => {
      useSocketEvent('candidate:login', handler)
    })

    expect(mockSocket.on).not.toHaveBeenCalled()
  })

  it('should cleanup subscription on unmount', () => {
    const cleanup = jest.fn()
    mockSocket.on.mockReturnValue(cleanup)

    const { unmount } = renderHook(() => {
      useSocketEvent('candidate:login', jest.fn())
    })

    unmount()

    expect(cleanup).toHaveBeenCalled()
  })

  it('should call the latest handler after it changes without re-subscribing', () => {
    const handler1 = jest.fn()
    const handler2 = jest.fn()

    let subscribedListener: ((...args: any[]) => void) | undefined
    mockSocket.on.mockImplementation((_event, listener: any) => {
      subscribedListener = listener
      return jest.fn()
    })

    const { rerender } = renderHook(
      ({ handler }) => {
        useSocketEvent('candidate:login', handler)
      },
      { initialProps: { handler: handler1 } }
    )

    // Initially subscribed once
    expect(mockSocket.on).toHaveBeenCalledTimes(1)
    expect(typeof subscribedListener).toBe('function')

    // Fire event -> should call handler1
    subscribedListener && subscribedListener({ id: '1' })
    expect(handler1).toHaveBeenCalledTimes(1)

    // Update handler
    rerender({ handler: handler2 })

    // Fire event again -> should call handler2 (updated via ref)
    subscribedListener && subscribedListener({ id: '2' })
    expect(handler2).toHaveBeenCalledTimes(1)

    // Ensure no additional subscriptions happened
    expect(mockSocket.on).toHaveBeenCalledTimes(1)
  })
})

