/**
 * Socket.IO Client Singleton
 * Manages WebSocket connection to backend server
 */

import { io, Socket } from 'socket.io-client';
import { SOCKET_CONFIG } from '@/shared/config/socket.config';
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  SocketState,
  ConnectionStatus,
} from './socket-events';

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

class SocketClient {
  private socket: TypedSocket | null = null;
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private statusCallbacks: Set<(state: SocketState) => void> = new Set();

  /**
   * Initialize socket connection
   */
  connect(): TypedSocket {
    if (this.socket?.connected) {
      console.log('[Socket] Already connected');
      return this.socket;
    }

    console.log('[Socket] Connecting to', SOCKET_CONFIG.url);

    this.socket = io(SOCKET_CONFIG.url, SOCKET_CONFIG.options) as TypedSocket;
    this.setupEventListeners();
    this.socket.connect();

    return this.socket;
  }

  /**
   * Disconnect socket
   */
  disconnect(): void {
    if (!this.socket) return;

    console.log('[Socket] Disconnecting...');
    this.socket.disconnect();
    this.socket = null;
    this.reconnectAttempts = 0;
  }

  /**
   * Get socket instance
   */
  getSocket(): TypedSocket | null {
    return this.socket;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Subscribe to connection status changes
   */
  onStatusChange(callback: (state: SocketState) => void): () => void {
    this.statusCallbacks.add(callback);
    return () => {
      this.statusCallbacks.delete(callback);
    };
  }

  /**
   * Notify all status subscribers
   */
  private notifyStatusChange(status: ConnectionStatus, error?: Error): void {
    const state: SocketState = {
      status,
      connected: status === 'connected',
      reconnectAttempts: this.reconnectAttempts,
      error,
    };

    this.statusCallbacks.forEach((callback) => {
      try {
        callback(state);
      } catch (err) {
        console.error('[Socket] Status callback error:', err);
      }
    });
  }

  /**
   * Setup socket event listeners
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('[Socket] Connected');
      this.reconnectAttempts = 0;
      this.notifyStatusChange('connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
      this.notifyStatusChange('disconnected');

      if (reason === 'io server disconnect') {
        this.socket?.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error);
      this.notifyStatusChange('error', error);
    });

    this.socket.io.on('reconnect_attempt', (attemptNumber) => {
      this.reconnectAttempts = attemptNumber;
      console.log(`[Socket] Reconnection attempt ${attemptNumber}`);
      this.notifyStatusChange('reconnecting');
    });

    this.socket.io.on('reconnect_failed', () => {
      console.error('[Socket] Reconnection failed after max attempts');
      this.notifyStatusChange('error', new Error('Reconnection failed'));
    });

    this.socket.io.on('reconnect', (attemptNumber) => {
      console.log(`[Socket] Reconnected after ${attemptNumber} attempts`);
      this.reconnectAttempts = 0;
      this.notifyStatusChange('connected');
    });
  }

  /**
   * Emit event to server
   */
  emit<K extends keyof ClientToServerEvents>(
    event: K,
    ...args: Parameters<ClientToServerEvents[K]>
  ): void {
    if (!this.socket) {
      console.warn('[Socket] Cannot emit: not connected');
      return;
    }

    console.log(`[Socket] 📤 Emitting event: ${String(event)}`, {
      connected: this.socket.connected,
      args: args.length > 0 ? args : 'no args',
    });

    this.socket.emit(event, ...args);
  }

  /**
   * Listen to event from server
   */
  on<K extends keyof ServerToClientEvents>(
    event: K,
    listener: ServerToClientEvents[K]
  ): () => void {
    if (!this.socket) {
      console.warn('[Socket] Cannot listen: not connected');
      return () => {};
    }

    this.socket.on(event, listener as never);

    return () => {
      this.socket?.off(event, listener as never);
    };
  }

  /**
   * Remove event listener
   */
  off<K extends keyof ServerToClientEvents>(
    event: K,
    listener?: ServerToClientEvents[K]
  ): void {
    if (!this.socket) return;

    if (listener) {
      this.socket.off(event, listener as never);
    } else {
      this.socket.off(event);
    }
  }
}

let socketClientInstance: SocketClient | null = null;

export function getSocketClient(): SocketClient {
  if (!socketClientInstance) {
    socketClientInstance = new SocketClient();
  }
  return socketClientInstance;
}

export const socketClient = getSocketClient();
