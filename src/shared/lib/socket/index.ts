/**
 * Socket Library Exports
 */

export { socketClient, getSocketClient } from './socket-client';
export type {
  ServerToClientEvents,
  ClientToServerEvents,
  ConnectionStatus,
  SocketState,
  MetricsUpdateData,
  SessionUpdateData,
  CandidateUpdateData,
  CandidateLoginEvent,
  CandidateLogoutEvent,
  ExamStartedEvent,
  ExamAnswerSubmittedEvent,
  SocketError,
} from './socket-events';
