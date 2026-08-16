# FlexTest Examiner — State Management (End-to-End Reference)

This document classifies **every form of state** in the examiner app (`src/`) by type and
walks through how each one is created, read, updated, and torn down — end to end.

---

## 1. State Taxonomy at a Glance

| # | Type | Where it lives | Example |
|---|------|----------------|---------|
| 1 | **Global React context** | `src/shared/contexts/AuthContext.tsx`, `src/shared/providers/SocketProvider.tsx` | current user, socket connection status |
| 2 | **Module-level singletons** (non-React) | `socket-client.ts`, `api/client.ts`, `token-storage.ts`, `center-cache.ts`, `ai-generation.helpers.ts` | socket instance, axios instance, JWT, center cache, circuit breakers |
| 3 | **Server state** (TanStack Query) | `features/metrics/**`, `features/monitoring/**` | metrics, monitoring stats/details, timer |
| 4 | **Server-side persistent state** (Next runtime) | `src/lib/{db,redis,timer-*,sync-lock}.ts`, `src/app/api/**` | Redis timer keys, Postgres rows, passport files |
| 5 | **Browser persistence** | `localStorage` / `sessionStorage` | `accessToken`, subject-module mapping, import flags |
| 6 | **URL state** | `useSearchParams`, `useParams`, `usePathname`, server `searchParams` | `?session=`, `[sessionId]/[subjectId]` |
| 7 | **Local component state** | `useState` / `useRef` inside feature hooks & widgets | wizards, dialogs, filters, forms |
| 8 | **Derived state** | `useMemo` + selector functions | `formatSeconds`, metrics selector hooks |
| 9 | **Real-time event state** | Socket.IO (`useSocketEvent`, `useMetricsSocket`) | `metrics:update`, `candidate:login`, `exam:answerSubmitted` |

There is **no** Zustand / Redux / Jotai. Server state is managed exclusively with
**TanStack Query**, and only inside the `metrics` and `monitoring` features. Everything else
uses `useState` + `useEffect` + direct API calls.

---

## 2. Provider Hierarchy (where global state is mounted)

```
app/layout.tsx
└─ <Providers>                              app/providers.tsx  ('use client')
   └─ <QueryClientProvider>                 staleTime 60s · gcTime 5min · refetchOnWindowFocus false · retry 1
      └─ <AuthProvider>                     shared/contexts/AuthContext.tsx
         └─ <SocketProvider autoConnect>    shared/providers/SocketProvider.tsx
            ├─ page tree                    app/page.tsx → login/forgot-password/onboarding/dashboard/…
            └─ <Toaster>                    shared/ui/sonner
```

- `app/dashboard/layout.tsx` adds only the `Sidebar` (`widgets/dashboard/ui/Sidebar.tsx`, uses `usePathname`).
- `src/shared/providers/QueryProvider.tsx` is **dead code** (never imported) — the active
  `QueryClient` is the one in `app/providers.tsx`.

---

## 3. Global React Context State

### 3.1 AuthContext — `src/shared/contexts/AuthContext.tsx`
Holds the authenticated identity for the whole SPA.

| Member | Kind | Purpose |
|--------|------|---------|
| `user` | `useState<User \| null>` | current user (from `getCurrentUser`) |
| `loading` | `useState<boolean>` | true until initial token check resolves |
| `error` | `useState<string \| null>` | last auth failure message |
| `isAuthenticated` | derived | `!!user` |
| `login(creds)` | `useCallback` | calls `apiLogin`, persists token, sets user, `router.push('/dashboard')` |
| `logout()` | `useCallback` | calls `apiLogout` (best-effort), clears token+user, `router.push('/login')` |
| `refreshUser()` | `useCallback` | re-fetches user; on failure clears token and redirects |
| `updateUser(partial)` | `useCallback` | local merge into `user` (no refetch) |
| `clearError()` | `useCallback` | resets `error` |

**Lifecycle:** on mount, `initAuth()` reads the token from localStorage
(`getAuthToken()`), calls `getCurrentUser()`, and populates `user`; a failed fetch calls
`removeAuthToken()` and leaves `user` null.

**Consumers:** `features/dashboard/model/useDashboardPage.ts`, `features/login/model/useLoginPage.ts`,
`features/profile/model/useProfilePage.ts`, `widgets/dashboard/ui/DashboardHeader.tsx`
(user display + logout + local `showUserMenu`/`showNotifications` toggles).

### 3.2 SocketContext — `src/shared/providers/SocketProvider.tsx`
Exposes the singleton socket plus a mirror of its connection status.

| Member | Kind | Purpose |
|--------|------|---------|
| `socket` | singleton instance | `socketClient` from `shared/lib/socket/socket-client.ts` |
| `state` | `useState<SocketState>` | `{ status, connected, reconnectAttempts }` |
| `isConnected` | derived | `state.connected` |

**Mechanism:** the provider subscribes to `socketClient.onStatusChange(...)` and copies every
status broadcast into local `useState`. With `autoConnect` (default true) it calls
`socketClient.connect()` on mount and `.disconnect()` on unmount.

**Consumers:** `shared/hooks/useSocket.ts` (thin wrapper), `shared/hooks/useSocketEvent.ts`,
`shared/hooks/useMetricsSocket.ts`, `features/monitoring/model/useMonitoringSocketHandlers.ts`.

---

## 4. Module-Level Singleton State (non-React)

These live outside React and survive hot-reloads/re-renders by design.

| Singleton | File | Holds | Notes |
|-----------|------|-------|-------|
| `socketClient` | `src/shared/lib/socket/socket-client.ts` | lazy `SocketClient` (`socket`, `reconnectAttempts`, `statusCallbacks: Set`) | `MAX_RECONNECT_ATTEMPTS = 5`; notifies subscribers via `buildSocketState`/`notifyStatusSubscribers` |
| `apiClient` | `src/shared/api/client.ts` | axios instance (baseUrl from `config.apiBaseUrl`, 20s timeout) | request interceptor injects `Authorization: Bearer <localStorage token>` except `/auth/logout`; response interceptor normalizes errors to `ApiError`; adds `ngrok-skip-browser-warning` when base URL contains `ngrok` |
| token helpers | `src/shared/lib/token-storage.ts` | `accessToken` wrapper over localStorage | get/set/remove |
| center cache | `src/shared/lib/center-cache.ts` | module vars `centerCache`, `cacheTime` | 30-day TTL; only caches truthy values |
| center-check cache | `src/processes/center-check/lib/cache.ts` + `lib/checkCenter.ts` | `SimpleCache<boolean>` (Map + expiry) + `pendingRequests` dedupe | 60s memoized center validation per URL |
| AI circuit breakers | `src/shared/services/ai-generation.helpers.ts` | `circuitBreakers: Map<string, CircuitBreaker>` | per-model CLOSED/OPEN/HALF_OPEN, failure threshold 3, recovery 30s |
| app config | `src/shared/config/index.ts` | plain const object | `apiBaseUrl`, etc. |
| pg pool | `src/lib/db.ts` | `globalThis.__pgPool` (`Pool`, `max: 5`) | reused across hot-reloads in dev; server-only |
| redis client | `src/lib/redis.ts` | lazy ioredis singleton (`getRedis()`) | `lazyConnect`, retry strategy; server-only |
| passport storage | `src/lib/passport-storage.ts` | filesystem writes to `public/passport` | path-traversal guard |

---

## 5. Server State — TanStack Query

Only two features use it: **metrics** and **monitoring**.

### 5.1 Metrics — `src/features/metrics/model/`
| Query key | Hook | Source | Config |
|-----------|------|--------|--------|
| `['metrics', 'dashboard']` | `useDashboardMetrics` | `GET /metrics/summary` | `staleTime: Infinity`, `gcTime: 10min` |
| `['metrics', 'system']` | `useSystemMetrics` | `GET /metrics/system` | same |
| `['metrics', 'business']` | `useBusinessMetrics` | `GET /metrics/business` | same |

- **Readers:** selector hooks in `useMetricsQuery.ts` (`useServerStatus`, `useCPUMetrics`,
  `useMemoryMetrics`, `useConnectionMetrics`, `usePerformanceMetrics`, `useLastUpdate`,
  `useMetricsConnection`) — each subscribes to the dashboard query and extracts a slice, so
  components only re-render when that slice changes.
- **Writer (realtime):** `useMetricsStream.ts` opens an SSE `EventSource` at
  `/metrics/stream` and writes into the cache with `queryClient.setQueryData(...)` across all
  three keys (batched). It holds 5 refs (`eventSourceRef`, `reconnectTimeoutRef`,
  `reconnectDelayRef` 5s, `pendingUpdatesRef`, `batchTimeoutRef`) and falls back to polling
  when the stream is unavailable.

### 5.2 Monitoring — `src/features/monitoring/model/`
| Query key | Hook | Source | Config |
|-----------|------|--------|--------|
| `['timer', sessionId]` | `useTimer` | `GET /api/timer/{id}` (Redis) | `refetchInterval: 10s`, `staleTime: 0`, `retry: 2` |
| `['monitoring','session',sid,'statistics']` | `useMonitoringQueries` | `GET /monitoring/sessions/{sid}/statistics` | poll 30s when auto-refresh, `staleTime: 0` |
| `['monitoring','session',sid,'details']` | `useMonitoringQueries` | `GET /monitoring/sessions/{sid}` | no interval (progress kept live via socket + ref) |

**Orchestration** (`useMonitoringData.ts`):
- `progressRef` — a `useRef(new Map())` that is the **source of truth for candidate
  progress** and survives details-query refetches (the details endpoint does not return
  progress fields).
- `useCandidateProgressSync.ts` — `syncCandidatesProgress()` fetches
  `GET /monitoring/sessions/{sid}/progress` and seeds `progressRef`, then `setQueryData` into details.
- `useProgressPatch.ts` — after every details refetch (`prevIsFetchingDetailsRef`),
  re-applies the `progressRef` Map back into the cache so progress is never wiped.
- Socket handlers (`useMonitoringSocketHandlers.ts`) subscribe to
  `candidate:login | candidate:logout | exam:started | exam:answerSubmitted | candidate:update`
  and mutate the cache **optimistically** via handler factories in `model/handlers/*`:
  `createCandidateLoginHandler`, `createCandidateLogoutHandler`, `createCandidateUpdateHandler`,
  `createExamStartedHandler`, `createAnswerSubmittedHandler`, `applyEndSessionSuccess`.

**Mutations:**
- `useControlSessionMutation` — POST `/monitoring/sessions/{sid}/control`; on end-success
  applies `applyEndSessionSuccess` (optimistic SUBMITTED) and invalidates the stats query
  (full invalidation after 15s).
- `useLogoutCandidate` — POST logout; invalidates stats + details **and** PATCHes
  `/api/timer/{sid}/{cid}` (pause) as a socket-independent backup.
- `useBulkLogoutCandidates` — bulk logout with per-partial-result toasts; invalidates stats + details.

---

## 6. Server-Side Persistent State (Next.js runtime)

### 6.1 Redis — exam timer (the refactored timer system)
Files: `src/lib/{timer-state,timer-keys,timer-store,timer-sync,sync-lock}.ts`,
started by `src/instrumentation.ts` (`register()` only when `NEXT_RUNTIME === 'nodejs'`).

| Redis key | Meaning | TTL |
|-----------|---------|-----|
| `flextest:exam:session:{sid}` | `TimerState { startEpochMs, durationSeconds, consumedSeconds, status, updatedAt }` | `durationSeconds + 7200` (min 7200) |
| `flextest:exam:timer:{sid}:{cid}` | per-candidate pause/elapsed anchor | same |
| `flextest:exam:timer:sync:lock` | 5-min DB-sync lock | `SET EX 120 NX` |

- **Read path** (`app/api/timer/[sessionId]/route.ts`): Redis → DB fallback
  (`SELECT duration, status FROM exam_sessions`; ACTIVE → RUNNING, else STOPPED).
- **Per-candidate path** (`[...candidateSegments]/route.ts`): `candidateId = segments.join('/')`
  (handles nested ids like `BPA/26/01197`); GET Redis → DB fallback
  (`current_session_progress.time_left`), PATCH = pause.
- **Sync job** (`timer-sync.ts`): every 5 min, guarded by the Redis lock, batches 50 rows with
  DB concurrency 10, writes `current_session_progress.remainingSeconds`, skips STOPPED sessions.
- `timer-state.ts` `computeRemaining()` is anchor-based (start/consumed vs wall clock), so
  elapsed time survives the 10s client poll interval.

### 6.2 PostgreSQL — API route handlers
`src/app/api/**/route.ts` (server-only, uses `src/lib/db.ts` pool):
- `sessions/[sessionId]/stats` — DB reads: scheduled from `subject_combinations`, submitted
  from `candidate_answers`, active from `candidates.status='ACTIVE'`, absent = scheduled − submitted.
- `sessions/[sessionId]/scores` — DB read + local formula evaluator (`computeScore`,
  placeholders like `{correctAnswers}`, regex-guarded `Function()` eval, fallback
  `correct − wrong*negMarkValue`, clamped ≥ 0).
- `candidates/reassign` — Postgres transaction: updates candidate session/status + copies
  `candidate_subjects` rows with `randomUUID()`.
- `admin/reset-sessions` — **stub** (returns 503; expects backend on port 3001).
- `import/proxy` — server-side fetch proxy (30s timeout) for the bulk-import API.
- `questions/[id]` — PATCH proxy to the backend `/questions/{id}`.
- `sessions/[sessionId]/force-submit` — proxies `/candidates/submit-exam` per candidate
  (`Promise.allSettled`; 409 treated as success).
- `upload/passport` — filesystem: `sniffImageType` (JPEG/PNG/WebP/GIF), 5MB cap,
  `savePassportImage` / `deletePassportImage`.

---

## 7. Browser Persistence

| Key | Storage | Written | Read / Removed | Purpose |
|-----|---------|---------|----------------|---------|
| `accessToken` | localStorage | `login` (AuthContext → `setAuthToken`) | apiClient interceptor; AuthContext `initAuth`; `questionApi` | JWT for every authenticated request |
| `flextest:score-push:subject-module-mapping` | localStorage | `useModuleMapping.ts` (save-on-set) | `moduleMappingStorage.ts` (lazy init) | subject → module mapping, set once, reused on every score push |
| `questions-uploaded` | sessionStorage | `createHandleImport.ts`, `createHandleSubmitGenerated.ts` | `useSessionQuestionsInitialLoad.ts` (equals-check then remove) | one-time "just uploaded, reload data" flag per session |
| `pending_subject_import` | sessionStorage | `useSubjectImport.ts:197` | `subjects-confirm-import/model/storage.ts` | carries parsed subjects across the import-wizard pages |
| `centerData` | sessionStorage | **no writer found (orphaned)** | `useLoadCenterData.ts` (read), `createHandleCreateCenter.ts` (remove) | legacy onboarding center form persistence |

Note: `centerData` is read but never written anywhere in `src/` — a leftover from a previous
onboarding flow.

---

## 8. URL State

| File | Hook | Data |
|------|------|------|
| `features/monitoring/model/useMonitoringView.ts` | `useSearchParams` | `?session=` selects the monitored exam session |
| `features/questions-upload/model/useSubjectUploadPage.ts` | `useParams` | `[sessionId]`, `[subjectId]` for AI question generation |
| `features/session-questions-upload/model/useSessionUploadQuestionsPage.ts` | `useParams` | `[sessionId]` |
| `widgets/dashboard/ui/Sidebar.tsx` | `usePathname` | active nav highlight |
| `app/error/page.tsx` | server `searchParams` | `type/message/details` → `parseErrorParams.ts` (sanitized, 300/1200-char caps) |
| `app/dashboard/reports/[sessionId]/scores/page.tsx` | server params prop | `sessionId` |

---

## 9. Local Component State (`useState` / `useRef`)

No `useReducer` anywhere. The heaviest `useState` users:

| File | `useState` calls | What it owns |
|------|------------------|--------------|
| `features/candidate-import/model/useCandidateImportState.ts` | 30 | dialog open/close, import tab, centers/sessions/configs, selected IDs, parsed classes/students |
| `features/exam-sessions/model/useExamSessionsPage.ts` (+`state/useExamSessionsData.ts`) | 18 + 8 | 6 dialog openers, create/edit forms, edit/delete/duplicate/reschedule targets |
| `features/subject-import/model/useSubjectImport.ts` | 14 | stepwise wizard (upload → parse → confirm), pending subjects |
| `features/settings/model/scoreConfigurations/effects/useScoreConfigurationState.ts` | 14 | list, form, validationResult, previewResult, 8 busy flags |
| `features/monitoring/model/state/useMonitoringViewState.ts` | 14 | search/filter/autoRefresh, `selectedCandidates` Set, 5 confirm dialogs, `subjectQuestionCounts` Map |
| `features/reset-sessions/model/state/useResetSessionsState.ts` | 8 | confirmation state + 30s countdown |
| `features/candidate-add/model/useAddCandidateForm.ts` | 6 | form fields, selected subjects, sessions, loading/error |
| `features/questions-upload/model/state/*` | 7 each | `useQuestionFormState`, `useQuestionDataState`, `useQuestionAiState` (+ exported `DEFAULT_AI_GENERATE_FORM`) |
| `widgets/candidate-table/ui/CandidateTable.tsx` | 13 | row selection, expanded rows, menu state |

**Widget tables** (`widgets/*/model/use*Table.ts`) do **not** use TanStack Query — they use
`useState` + `useEffect` + direct API calls (pagination, filters, `refreshTrigger`,
401-specific errors).

**Notable `useRef` patterns:**
- `useTimer.ts` — `tickIntervalRef` + `anchorRef` (1s display tick interpolated from last poll).
- `useMetricsStream.ts` — 5 refs (SSE lifecycle + reconnect backoff + batched writes).
- `useMonitoringData.ts` — `progressRef` Map (progress survives refetches).
- `useMonitoringQueries.ts` — `sessionDurationSecondsRef` (fresh duration in mutation callbacks).
- `useProgressPatch.ts` — `prevIsFetchingDetailsRef`; `useCandidateProgressSync.ts` — `progressSeedRef`.
- `useSocketEvent.ts` — `handlerRef` (always latest handler).
- `candidate-add/ui/PassportPhotoSection.tsx` — `fileInputRef`, `videoRef` (webcam capture).
- `report-upload-results/model/useScorePush.ts` — `resultsRef` (results committed once at the end).

---

## 10. Derived State

- `useTimer` returns `remainingHms` / `elapsedHms` via `useMemo(() => formatSeconds(displaySeconds))`.
- `useMonitoringViewDerived.ts` computes `filteredCandidates` from candidates + view filters.
- Metrics selector hooks (`useServerStatus`, `useCPUMetrics`, …) derive slices from the
  dashboard query.
- `features/monitoring/model/selectors/formatSeconds.ts` — pure formatting util.

---

## 11. Real-Time State (Socket.IO)

**Client → server** (`ClientToServerEvents`):
`ping`, `subscribe:metrics`, `subscribe:session(sid)`, `subscribe:candidate(cid)`,
`unsubscribe:metrics`, `unsubscribe:session(sid)`, `unsubscribe:candidate(cid)`.

**Server → client** (`ServerToClientEvents`):
`connect`, `disconnect`, `connect_error`,
`metrics:update`, `clients:connected`, `clients:disconnected`,
`candidate:login`, `candidate:logout`, `exam:started`, `exam:answerSubmitted`,
`session:update`, `candidate:update`, `error`, `pong`.

| Hook | Subscribes | Effect |
|------|-----------|--------|
| `useMetricsSocket` | `metrics:update`, `clients:connected`, `clients:disconnected` | local `useState` for metrics + connected client count; emits subscribe/unsubscribe on connect |
| `useMonitoringSocketHandlers` | 5 candidate/exam events | optimistic `setQueryData` into monitoring cache |

`useSocketEvent` registers handlers only while `isConnected`, keeps the latest handler in a
ref, and cleans up on unmount.

---

## 12. E2E Technical Walkthroughs

### 12.1 Authentication
1. `LoginPage` (`features/login/model/useLoginPage.ts`) calls `auth.login(creds)`.
2. `AuthContext.login` → `apiLogin` (axios via `apiClient`) → backend `/auth/login`.
3. Success: `setAuthToken` writes `accessToken` to localStorage; `setUser`; `router.push('/dashboard')`.
4. Any later request: `apiClient` interceptor reads `accessToken` from localStorage and adds
   `Authorization: Bearer …` (except `/auth/logout`).
5. Hard reload: `AuthProvider` `initAuth` reads token → `getCurrentUser` → `setUser`; on 401 the
   token is removed and the user is treated as logged out.
6. `logout()` → best-effort `apiLogout` → `removeAuthToken` → `setUser(null)` → `/login`.

### 12.2 Monitoring (live session screen)
1. Route `/dashboard/monitoring?session=<sid>` → `useMonitoringView` reads `?session` (URL state).
2. `useMonitoringData` mounts:
   - stats query (`/monitoring/sessions/{sid}/statistics`, 30s poll) for counts + status;
   - details query (`/monitoring/sessions/{sid}`, no poll) for the candidate list.
3. `useTimer` polls `/api/timer/{sid}` every 10s (Redis) and ticks the display down locally 1s/s.
4. `useMonitoringSocketHandlers` subscribes to the session; each `candidate:login` /
   `exam:answerSubmitted` event runs an optimistic `setQueryData` patch (+ updates `progressRef`).
5. `useProgressPatch` re-applies `progressRef` after every details refetch so progress survives.
6. User actions: `useControlSessionMutation` (start/pause/resume/end), `useLogoutCandidate`,
   `useBulkLogoutCandidates` — each invalidates stats/details so the UI converges with the server.
7. Selection/filtering is local state (`useMonitoringViewState` + `useMonitoringViewDerived`).

### 12.3 Exam timer
1. `useTimer` issues `GET /api/timer/{sid}` every 10s (`queryKey ['timer', sid]`).
2. Server reads Redis `flextest:exam:session:{sid}`; on miss falls back to Postgres
   `exam_sessions` (ACTIVE → RUNNING).
3. Between polls the client ticks `displaySeconds` down 1s/s **only while `status === 'RUNNING'`**
   using the anchor ref (poll value + `fetchedAt`), so the UI is smooth and never overruns.
4. Pausing a candidate sends `PATCH /api/timer/{sid}/{cid}` (also done by `useLogoutCandidate`).
5. A background sync (`instrumentation` → `timer-sync`) writes remaining time to Postgres every
   5 min under the Redis lock — the Redis value is the primary truth, Postgres is the fallback.

### 12.4 Metrics dashboard
1. `useDashboardMetrics` + selector hooks read `['metrics','dashboard']` (staleTime Infinity).
2. `useMetricsStream` opens the SSE stream; every `metrics:update` is batched and written into
   all three metrics keys via `setQueryData`, giving near-real-time updates without refetches.
3. If the stream drops, the reconnection refs back off (5s) and the query falls back to polling.

### 12.5 Candidate import wizard
`useCandidateImportState` (30 `useState`) drives: file/tab selection, centers/sessions/configs,
parsed classes & students, selected candidate IDs, and dialog visibility. Data flows from the
`import/proxy` API route into local state; submissions PATCH/refresh the candidates table
(widget local state + `refreshTrigger`).

### 12.6 Question upload + session questions
1. Route params `[sessionId]/[subjectId]` (URL state) drive `useSubjectUploadPage`.
2. Manual import (`createHandleImport`) or AI generation (`createHandleSubmitGenerated`)
   stores `questions-uploaded = sessionId` in sessionStorage.
3. `useSessionQuestionsInitialLoad` reads the flag on the session page, refetches data, then
   removes it — one-shot "reload after upload" without a persisted marker.

### 12.7 Subject import wizard
`useSubjectImport` writes parsed subjects to sessionStorage (`pending_subject_import`);
`subjects-confirm-import` reads/clears it via its `storage.ts` wrapper, completing the
cross-page hand-off.

### 12.8 Report upload / score push
1. `useModuleMapping` lazily loads `flextest:score-push:subject-module-mapping` from
   localStorage and saves on set — the mapping is chosen once and reused on every push.
2. `useScorePush` pushes scores with bounded concurrency (PUSH_CONCURRENCY=8), tracking
   progress in state and committing `resultsRef` once at the end.

### 12.9 Onboarding
`useOnboardingSetupPage` (step 1–3 wizard, center + admin forms) → on completion calls
`completeOnboarding`, clears the module `centerCache`, and routes to `/login`. The legacy
`centerData` sessionStorage read (`useLoadCenterData`) is orphaned (no writer).

### 12.10 Server API routes (DB/Redis/FS)
See §6.2. Highlights: `/sessions/{id}/stats` and `/sessions/{id}/scores` read Postgres
directly from the Next serverless function; `/candidates/reassign` runs a DB transaction;
`/upload/passport` writes files; `/api/timer/*` reads/writes Redis with a Postgres fallback.

---

## 13. Reference Tables

### Query keys
```
['metrics', 'dashboard'] | ['metrics', 'system'] | ['metrics', 'business']
['timer', sessionId]
['monitoring', 'session', sessionId, 'statistics']
['monitoring', 'session', sessionId, 'details']
```

### Storage keys
```
localStorage:  accessToken · flextest:score-push:subject-module-mapping
sessionStorage: questions-uploaded · pending_subject_import · centerData (orphaned read)
```

### Redis keys
```
flextest:exam:session:{sid}
flextest:exam:timer:{sid}:{cid}
flextest:exam:timer:sync:lock          (SET EX 120 NX)
```

### REST endpoints used by the SPA
```
GET  /metrics/summary | /metrics/system | /metrics/business | /metrics/stream (SSE)
GET  /monitoring/sessions | /monitoring/sessions/{sid}/statistics | /monitoring/sessions/{sid} | /monitoring/sessions/{sid}/progress
POST /monitoring/sessions/{sid}/control
GET  /api/timer/{sid} · GET|PATCH /api/timer/{sid}/{candidateSegments}
GET  /api/sessions/{sid}/stats · /api/sessions/{sid}/scores · POST /api/sessions/{sid}/force-submit
POST /api/upload/passport · /api/import/proxy · PATCH /api/questions/{id}
```

---

## 14. Data-Flow Diagrams

### Monitoring screen — one update round-trip
```
backend (Socket.IO)                     examiner browser
        │  candidate:login                 │
        │─────────────────────────────────►│ useSocketEvent
        │                                  │   ▼
        │                                  │ createCandidateLoginHandler
        │                                  │   ▼ queryClient.setQueryData
        │                                  │ ['monitoring',session,sid,'details']
        │                                  │   ▼  (also progressRef.set)
        │                                  │ useProgressPatch re-applies refs on refetch
        │  statistics (30s poll)  ◄───────│ useMonitoringQueries
        │  timer (10s poll)        ◄───────│ useTimer  (Redis-backed /api/timer)
        │  PATCH pause/logout      ◄───────│ useLogoutCandidate / control mutation
```

### State source-of-truth per layer
```
URL ?session ──► monitoring queries ──► TanStack cache ──► UI
socket events ─┘        ▲  ▲                │  ▲
                     progressRef (Map) ─────┘  │ optimistic setQueryData
                     useProgressPatch ─────────┘
Redis (timer) ──► /api/timer ──► useTimer ──► local displaySeconds + 1s tick
```
