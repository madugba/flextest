import type { Socket } from 'socket.io-client'
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  SocketState,
} from './socket-events'

export type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>

export type StatusCallback = (state: SocketState) => void
