import { getSocketClient } from '@/shared/lib/socket/socket-client'
import { io } from 'socket.io-client'

jest.mock('socket.io-client')
jest.mock('@/shared/config/socket.config', () => ({
  SOCKET_CONFIG: {
    url: 'http://localhost:3001',
    options: {},
  },
}))

const mockedIo = io as jest.MockedFunction<typeof io>

describe('SocketClient', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getSocketClient', () => {
    it('should return singleton instance', () => {
      const client1 = getSocketClient()
      const client2 = getSocketClient()
      expect(client1).toBe(client2)
    })
  })

  describe('connect', () => {
    it('should connect to socket server', () => {
      const mockSocket = {
        connected: false,
        connect: jest.fn(),
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
        disconnect: jest.fn(),
        io: {
          on: jest.fn(),
        },
      }

      mockedIo.mockReturnValue(mockSocket as any)

      const client = getSocketClient()
      const socket = client.connect()

      expect(mockedIo).toHaveBeenCalledWith('http://localhost:3001', {})
      expect(mockSocket.connect).toHaveBeenCalled()
      expect(socket).toBeDefined()
    })

    it('should return existing socket if already connected', () => {
      const mockSocket = {
        connected: true,
        connect: jest.fn(),
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
        disconnect: jest.fn(),
        io: {
          on: jest.fn(),
        },
      }

      mockedIo.mockReturnValue(mockSocket as any)

      const client = getSocketClient()
      const socket1 = client.connect()
      const socket2 = client.connect()

      expect(socket1).toBe(socket2)
    })
  })

  describe('isConnected', () => {
    it('should return connection status', () => {
      const mockSocket = {
        connected: true,
        connect: jest.fn(),
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
        disconnect: jest.fn(),
        io: {
          on: jest.fn(),
        },
      }

      mockedIo.mockReturnValue(mockSocket as any)

      const client = getSocketClient()
      client.connect()

      expect(client.isConnected()).toBe(true)
      
      // Clean up
      client.disconnect()
    })
  })

  describe('disconnect', () => {
    it('should handle disconnect when no socket exists', () => {
      const client = getSocketClient()
      expect(() => client.disconnect()).not.toThrow()
    })
  })

  describe('emit', () => {
    it('should not emit if not connected', () => {
      const client = getSocketClient()
      expect(() => client.emit('ping')).not.toThrow()
    })
  })
})
