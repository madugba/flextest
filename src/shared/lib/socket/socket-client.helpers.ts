import type { ConnectionStatus, SocketState } from './socket-events'
import type { StatusCallback } from './socket-client.types'

export function buildSocketState(
  status: ConnectionStatus,
  reconnectAttempts: number,
  error?: Error
): SocketState {
  return {
    status,
    connected: status === 'connected',
    reconnectAttempts,
    error,
  }
}

export function notifyStatusSubscribers(
  subscribers: Set<StatusCallback>,
  state: SocketState
): void {
  subscribers.forEach((callback) => {
    try {
      callback(state)
    } catch (err) {
      console.error('[Socket] Status callback error:', err)
    }
  })
}
