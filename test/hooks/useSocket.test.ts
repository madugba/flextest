import { renderHook } from '@testing-library/react'
import { useSocket } from '@/shared/hooks/useSocket'
import { useSocketContext } from '@/shared/providers/SocketProvider'

jest.mock('@/shared/providers/SocketProvider')

const mockUseSocketContext = useSocketContext as jest.MockedFunction<typeof useSocketContext>

describe('useSocket Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return socket instance and state', () => {
    const mockSocket = {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      connected: true,
    }

    const mockState = {
      status: 'connected' as const,
      connected: true,
      reconnectAttempts: 0,
    }

    mockUseSocketContext.mockReturnValue({
      socket: mockSocket as any,
      state: mockState,
      isConnected: true,
    })

    const { result } = renderHook(() => useSocket())

    expect(result.current.socket).toBe(mockSocket)
    expect(result.current.state).toEqual(mockState)
    expect(result.current.isConnected).toBe(true)
    expect(result.current.reconnectAttempts).toBe(0)
  })

  it('should return reconnect attempts from state', () => {
    const mockState = {
      status: 'reconnecting' as const,
      connected: false,
      reconnectAttempts: 3,
    }

    mockUseSocketContext.mockReturnValue({
      socket: null,
      state: mockState,
      isConnected: false,
    })

    const { result } = renderHook(() => useSocket())

    expect(result.current.reconnectAttempts).toBe(3)
    expect(result.current.isConnected).toBe(false)
  })

  it('should handle disconnected state', () => {
    const mockState = {
      status: 'disconnected' as const,
      connected: false,
      reconnectAttempts: 0,
    }

    mockUseSocketContext.mockReturnValue({
      socket: null,
      state: mockState,
      isConnected: false,
    })

    const { result } = renderHook(() => useSocket())

    expect(result.current.isConnected).toBe(false)
    expect(result.current.socket).toBeNull()
  })
})

