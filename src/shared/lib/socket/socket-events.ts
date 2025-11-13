/**
 * Socket Event Type Definitions
 * Defines all socket events between client and server
 */

export interface ServerToClientEvents {
  connect: () => void;
  disconnect: (reason: string) => void;
  connect_error: (error: Error) => void;

  'metrics:update': (data: MetricsUpdateData) => void;
  'clients:connected': (data: { connectedClients: number; timestamp: string }) => void;
  'clients:disconnected': (data: { connectedClients: number; timestamp: string }) => void;
  'candidate:login': (data: CandidateLoginEvent) => void;
  'candidate:logout': (data: CandidateLogoutEvent) => void;
  'exam:started': (data: ExamStartedEvent) => void;
  'exam:answerSubmitted': (data: ExamAnswerSubmittedEvent) => void;

  'timer:update': (data: TimerUpdateEvent) => void;
  'timer:started': (data: TimerStateEvent) => void;
  'timer:paused': (data: TimerStateEvent) => void;
  'timer:resumed': (data: TimerStateEvent) => void;
  'timer:stopped': (data: TimerStateEvent) => void;

  'session:update': (data: SessionUpdateData) => void;

  'candidate:update': (data: CandidateUpdateData) => void;

  error: (error: SocketError) => void;

  pong: () => void;
}

export interface ClientToServerEvents {
  ping: () => void;

  'subscribe:metrics': () => void;
  'subscribe:session': (sessionId: string) => void;
  'subscribe:candidate': (candidateId: string) => void;

  'unsubscribe:metrics': () => void;
  'unsubscribe:session': (sessionId: string) => void;
  'unsubscribe:candidate': (candidateId: string) => void;

  'timer:requestSnapshot': (sessionId: string) => void;
}

export interface MetricsUpdateData {
  totalCandidates: number;
  activeSessions: number;
  completedExams: number;
  connectedClients: number;
  timestamp: string;
}

export interface SessionUpdateData {
  sessionId: string;
  status: 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  activeCount: number;
  completedCount: number;
  timestamp: string;
}

export interface CandidateUpdateData {
  candidateId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUBMITTED';
  sessionId?: string | undefined;
  timestamp: string;
}

export interface CandidateLoginEvent {
  candidateId: string;
  candidateName: string;
  sessionId: string;
  sessionName: string;
  statistics: {
    scheduled: number;
    absent: number;
    active: number;
    submitted: number;
  };
  candidate: {
    id: string;
    firstName: string;
    lastName: string;
    surname: string | null;
    firstname: string | null;
    email: string | null;
    seatNumber: number;
    status: string;
    lastLoginAt: string;
    picture: string | null;
    clientInfo: string;
    subjects: Array<{
      id: string;
      name: string;
    }>;
  };
  timestamp: string;
}

export interface CandidateLogoutEvent {
  candidateId: string;
  candidateName: string;
  sessionId: string;
  sessionName: string;
  statistics: {
    scheduled: number;
    absent: number;
    active: number;
    submitted: number;
  };
  reason: string;
  timestamp: string;
}

export interface ExamStartedEvent {
  candidateId: string;
  sessionId: string;
  totalQuestions: number;
  totalAttempted: number;
}

export interface ExamAnswerSubmittedEvent {
  candidateId: string;
  sessionId: string;
  questionId: string;
  totalAttemptedQuestions: number;
  totalQuestions: number;
  timestamp?: number;
}

export type TimerStatus = 'RUNNING' | 'PAUSED' | 'STOPPED';

export interface TimerUpdateEvent {
  sessionId: string;
  remainingSeconds: number;
  status: TimerStatus;
  timestamp: number;
}

export interface TimerStateEvent {
  sessionId: string;
  status: TimerStatus;
  remainingSeconds?: number;
  timestamp: number;
}

export interface SocketError {
  code: string;
  message: string;
  details?: unknown;
}

export type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting' | 'error';

export interface SocketState {
  status: ConnectionStatus;
  connected: boolean;
  reconnectAttempts: number;
  error?: Error | undefined;
}
