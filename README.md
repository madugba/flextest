# Flextest Frontend

Flextest helps exam centers manage candidates, sessions, and realtime monitoring from a single dashboard.

## What’s Inside
- App Router on React 19 with Tailwind CSS 4 and Radix UI primitives for consistent, accessible widgets.
- TanStack Query wraps our Axios client for resilient data fetching against the `backend` API.
- Socket.IO keeps proctoring and session state in sync.
- Feature-Sliced structure (`src/app`, `src/features`, `src/entities`, `src/shared`) keeps domain logic and UI components cleanly separated.

## Quick Start
1. Install Node.js 20+ and npm 10+ (matching the backend requirements).
2. From this folder:
   ```bash
   npm install
   npm run dev
   ```
3. Visit http://localhost:3001 to browse the dashboard.

The dev server proxies only the frontend. The backend lives in `../flextest-backend` and should be running in parallel for full functionality.

## Environment
Create a `.env.local` with the values you need:

```
NEXT_PUBLIC_API_URL=http://localhost:3000/v1/api        # REST + gRPC gateway from the backend
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000            # Socket.IO origin
NEXT_PUBLIC_IMPORT_API_URL=?
NEXT_PUBLIC_SERVER_IPS=127.0.0.1,.....           # Optional allowlist for trusted networks
```

All variables are safe for the browser. Anything secret should stay on the backend.

## Everyday Scripts
- `npm run dev` — Start the Turbopack dev server on port 3001.
- `npm run build && npm run start` — Production build and serve.
- `npm run lint` / `npm run lint:fix` — Check or fix ESLint issues.
- `npm run type-check` — Validate the TypeScript contracts.
- `npm run test` — Execute the Jest suite.
- `npm run test:e2e` — Playwright end-to-end flows (center check, monitoring, etc.).

## Testing Notes
UI pieces lean on React Testing Library, while full workflows rely on Playwright under `src/e2e`. Keep backend and database fixtures in step when running Playwright suites to avoid authentication hiccups.

## Folder Landmarks
- `src/app/dashboard` — Main administrator experience.
- `src/features/*` — Reusable feature modules like candidate onboarding and center management.
- `src/entities/*` — Type-safe domain models and adapters.
- `src/shared` — Cross-cutting concerns (Axios client, config, providers, utilities).
- `candidate/` (sibling directory) — The kiosk/proctored exam runtime that talks to the same backend.

## Working With AI Generation
`src/shared/services/ai-generation.service.ts` orchestrates OpenAI, Google Gemini, and DeepSeek with circuit breakers and strict JSON parsing. Supply API keys via backend configuration—no secrets should be embedded in this app.

