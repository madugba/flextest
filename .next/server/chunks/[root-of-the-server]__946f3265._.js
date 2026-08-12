module.exports = [
"[project]/.next-internal/server/app/api/timer/[sessionId]/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/ioredis [external] (ioredis, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("ioredis", () => require("ioredis"));

module.exports = mod;
}),
"[project]/src/lib/redis.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "acquireSyncLock",
    ()=>acquireSyncLock,
    "computeRemaining",
    ()=>computeRemaining,
    "fanOutToAllCandidates",
    ()=>fanOutToAllCandidates,
    "getRedis",
    ()=>getRedis,
    "getSessionState",
    ()=>getSessionState,
    "getTimerState",
    ()=>getTimerState,
    "releaseSyncLock",
    ()=>releaseSyncLock,
    "scanAllCandidateTimers",
    ()=>scanAllCandidateTimers,
    "setSessionState",
    ()=>setSessionState,
    "setTimerState",
    ()=>setTimerState
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$ioredis__$5b$external$5d$__$28$ioredis$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/ioredis [external] (ioredis, cjs)");
;
// ---------------------------------------------------------------------------
// Singleton ioredis client
// ---------------------------------------------------------------------------
let _client = null;
function createClient() {
    const client = new __TURBOPACK__imported__module__$5b$externals$5d2f$ioredis__$5b$external$5d$__$28$ioredis$2c$__cjs$29$__["default"]({
        host: process.env.REDIS_HOST ?? 'localhost',
        port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
        db: parseInt(process.env.REDIS_DB ?? '0', 10),
        lazyConnect: true,
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        enableOfflineQueue: false,
        connectTimeout: 10_000,
        commandTimeout: 5_000,
        retryStrategy: (times)=>Math.min(times * 100, 3_000)
    });
    client.on('error', (err)=>{
        console.error('[examiner/redis] error:', err.message);
    });
    return client;
}
function getRedis() {
    if (!_client) _client = createClient();
    return _client;
}
function computeRemaining(state) {
    const runningElapsed = state.status === 'RUNNING' && state.startEpochMs !== null ? Math.floor((Date.now() - state.startEpochMs) / 1000) : 0;
    return Math.max(0, state.durationSeconds - state.consumedSeconds - runningElapsed);
}
// ---------------------------------------------------------------------------
// Key scheme (two namespaces, same TimerState shape):
//
//   flextest:exam:session:{sessionId}
//     → The session-level clock, set when examiner starts the session.
//       Used ONLY for examiner display (elapsed / remaining for the session).
//
//   flextest:exam:timer:{sessionId}:{candidateId}
//     → Per-candidate clock, anchored at the moment THAT candidate started
//       their exam. This is what feeds the DB sync and the candidate's display.
//
// The two clocks are independent. If a candidate joins 15 min late their
// timer still starts from durationSeconds; they don't lose 15 minutes.
// ---------------------------------------------------------------------------
const SESSION_KEY = (sid)=>`flextest:exam:session:${sid}`;
const CANDIDATE_KEY = (sid, cid)=>`flextest:exam:timer:${sid}:${cid}`;
const CANDIDATE_SCAN_PATTERN = (sid)=>`flextest:exam:timer:${sid}:*`;
const ALL_CANDIDATES_SCAN_PATTERN = 'flextest:exam:timer:*';
async function getSessionState(sessionId) {
    try {
        const raw = await getRedis().get(SESSION_KEY(sessionId));
        if (!raw) return null;
        return JSON.parse(raw);
    } catch  {
        return null;
    }
}
async function setSessionState(sessionId, state) {
    const ttl = state.durationSeconds + 7_200;
    await getRedis().set(SESSION_KEY(sessionId), JSON.stringify(state), 'EX', Math.max(ttl, 7_200));
}
async function getTimerState(sessionId, candidateId) {
    try {
        const raw = await getRedis().get(CANDIDATE_KEY(sessionId, candidateId));
        if (!raw) return null;
        return JSON.parse(raw);
    } catch  {
        return null;
    }
}
async function setTimerState(sessionId, candidateId, state) {
    const ttl = state.durationSeconds + 7_200;
    await getRedis().set(CANDIDATE_KEY(sessionId, candidateId), JSON.stringify(state), 'EX', Math.max(ttl, 7_200));
}
async function fanOutToAllCandidates(sessionId, mutate) {
    const redis = getRedis();
    // 1. Collect all candidate keys for this session
    const keys = [];
    let cursor = '0';
    do {
        const [next, batch] = await redis.scan(cursor, 'MATCH', CANDIDATE_SCAN_PATTERN(sessionId), 'COUNT', 2000);
        cursor = next;
        keys.push(...batch);
    }while (cursor !== '0')
    if (keys.length === 0) return;
    const now = Date.now();
    // 2. Pipeline-read all current states
    const readPipeline = redis.pipeline();
    for (const key of keys)readPipeline.get(key);
    const readResults = await readPipeline.exec();
    // 3. Mutate and pipeline-write
    const writePipeline = redis.pipeline();
    readResults?.forEach(([err, raw], i)=>{
        if (err || typeof raw !== 'string') return;
        try {
            const current = JSON.parse(raw);
            const next = mutate(current, now);
            const ttl = Math.max(next.durationSeconds + 7_200, 7_200);
            writePipeline.set(keys[i], JSON.stringify(next), 'EX', ttl);
        } catch  {
        // Corrupt key — skip
        }
    });
    await writePipeline.exec();
}
function parseCandidateKey(key) {
    // key = flextest:exam:timer:{sessionId}:{candidateId}
    const prefix = 'flextest:exam:timer:';
    if (!key.startsWith(prefix)) return null;
    const rest = key.slice(prefix.length) // '{sessionId}:{candidateId}'
    ;
    const colonIdx = rest.indexOf(':');
    if (colonIdx === -1) return null // old session-level key — ignore
    ;
    return {
        sessionId: rest.slice(0, colonIdx),
        candidateId: rest.slice(colonIdx + 1)
    };
}
async function scanAllCandidateTimers() {
    const redis = getRedis();
    const entries = [];
    let cursor = '0';
    do {
        const [next, keys] = await redis.scan(cursor, 'MATCH', ALL_CANDIDATES_SCAN_PATTERN, 'COUNT', 2000);
        cursor = next;
        for (const k of keys){
            const parsed = parseCandidateKey(k);
            if (parsed) entries.push(parsed);
        }
    }while (cursor !== '0')
    return entries;
}
// ---------------------------------------------------------------------------
// Distributed lock — ensures only ONE Next.js worker runs the 5-min DB sync
// ---------------------------------------------------------------------------
const SYNC_LOCK = 'flextest:exam:timer:sync:lock';
async function acquireSyncLock(instanceId) {
    try {
        const result = await getRedis().set(SYNC_LOCK, instanceId, 'EX', 120, 'NX');
        return result === 'OK';
    } catch  {
        return false;
    }
}
const RELEASE_LUA = `
  if redis.call('get', KEYS[1]) == ARGV[1] then
    return redis.call('del', KEYS[1])
  end
  return 0
`;
async function releaseSyncLock(instanceId) {
    try {
        await getRedis().eval(RELEASE_LUA, 1, SYNC_LOCK, instanceId);
    } catch  {
    // Non-fatal — TTL will expire the lock anyway
    }
}
}),
"[externals]/pg [external] (pg, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("pg");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/src/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "db",
    ()=>db
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/pg [external] (pg, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
function createPool() {
    const pool = new __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__["Pool"]({
        connectionString: process.env.DATABASE_URL,
        max: 5,
        idleTimeoutMillis: 30_000,
        connectionTimeoutMillis: 5_000
    });
    pool.on('error', (err)=>{
        console.error('[examiner/db] pool error:', err.message);
    });
    return pool;
}
const db = globalThis.__pgPool ?? createPool();
if ("TURBOPACK compile-time truthy", 1) {
    globalThis.__pgPool = db;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/app/api/timer/[sessionId]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/redis.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
const runtime = 'nodejs';
const dynamic = 'force-dynamic';
async function GET(_req, { params }) {
    const { sessionId } = await params;
    try {
        const state = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSessionState"])(sessionId);
        if (state) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                remainingSeconds: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["computeRemaining"])(state),
                durationSeconds: state.durationSeconds,
                status: state.status,
                source: 'redis'
            });
        }
        // Redis miss — fall back to DB for session metadata
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].query(`SELECT duration, status FROM exam_sessions WHERE id = $1`, [
            sessionId
        ]);
        if (result.rows.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Session not found'
            }, {
                status: 404
            });
        }
        const row = result.rows[0];
        const durationSeconds = (row.duration ?? 60) * 60;
        const sessionStatus = row.status === 'ACTIVE' ? 'RUNNING' : 'STOPPED';
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            remainingSeconds: durationSeconds,
            durationSeconds,
            status: sessionStatus,
            source: 'db'
        });
    } catch (err) {
        console.error('[/api/timer GET]', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch timer'
        }, {
            status: 500
        });
    }
}
async function POST(req, { params }) {
    const { sessionId } = await params;
    let body;
    try {
        body = await req.json();
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Invalid JSON body'
        }, {
            status: 400
        });
    }
    const now = Date.now();
    try {
        const existing = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSessionState"])(sessionId);
        let next;
        switch(body.action){
            case 'start':
                {
                    if (!body.durationSeconds || body.durationSeconds <= 0) {
                        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                            error: 'durationSeconds required for start'
                        }, {
                            status: 400
                        });
                    }
                    if (existing?.status === 'RUNNING') {
                        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                            ok: true,
                            remainingSeconds: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["computeRemaining"])(existing),
                            status: existing.status
                        });
                    }
                    next = {
                        startEpochMs: now,
                        durationSeconds: body.durationSeconds,
                        consumedSeconds: existing?.consumedSeconds ?? 0,
                        status: 'RUNNING',
                        updatedAt: now
                    };
                    break;
                }
            case 'pause':
                {
                    if (!existing || existing.status !== 'RUNNING') {
                        const rem = existing ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["computeRemaining"])(existing) : 0;
                        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                            ok: true,
                            remainingSeconds: rem,
                            status: existing?.status ?? 'STOPPED'
                        });
                    }
                    const elapsed = existing.startEpochMs ? Math.floor((now - existing.startEpochMs) / 1000) : 0;
                    next = {
                        ...existing,
                        consumedSeconds: existing.consumedSeconds + elapsed,
                        startEpochMs: null,
                        status: 'PAUSED',
                        updatedAt: now
                    };
                    break;
                }
            case 'resume':
                {
                    if (!existing || existing.status === 'RUNNING') {
                        const rem = existing ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["computeRemaining"])(existing) : 0;
                        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                            ok: true,
                            remainingSeconds: rem,
                            status: existing?.status ?? 'STOPPED'
                        });
                    }
                    next = {
                        ...existing,
                        startEpochMs: now,
                        status: 'RUNNING',
                        updatedAt: now
                    };
                    break;
                }
            case 'stop':
                {
                    const remaining = existing ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["computeRemaining"])(existing) : 0;
                    next = {
                        ...existing ?? {
                            durationSeconds: 0,
                            consumedSeconds: 0,
                            startEpochMs: null
                        },
                        consumedSeconds: existing ? existing.durationSeconds - remaining : 0,
                        startEpochMs: null,
                        status: 'STOPPED',
                        updatedAt: now
                    };
                    break;
                }
            default:
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Unknown action'
                }, {
                    status: 400
                });
        }
        // Update the session-level key
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setSessionState"])(sessionId, next);
        // Fan out the same action to every per-candidate timer.
        // Done after the session key is updated so examiner display is already
        // correct even if the fan-out is slow.
        const action = body.action;
        void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fanOutToAllCandidates"])(sessionId, (candidateState, fanOutNow)=>{
            switch(action){
                case 'pause':
                    {
                        if (candidateState.status !== 'RUNNING') return candidateState;
                        const elapsed = candidateState.startEpochMs ? Math.floor((fanOutNow - candidateState.startEpochMs) / 1000) : 0;
                        return {
                            ...candidateState,
                            consumedSeconds: candidateState.consumedSeconds + elapsed,
                            startEpochMs: null,
                            status: 'PAUSED',
                            updatedAt: fanOutNow
                        };
                    }
                case 'resume':
                    {
                        if (candidateState.status !== 'PAUSED') return candidateState;
                        return {
                            ...candidateState,
                            startEpochMs: fanOutNow,
                            status: 'RUNNING',
                            updatedAt: fanOutNow
                        };
                    }
                case 'stop':
                    {
                        const rem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["computeRemaining"])(candidateState);
                        return {
                            ...candidateState,
                            consumedSeconds: candidateState.durationSeconds - rem,
                            startEpochMs: null,
                            status: 'STOPPED',
                            updatedAt: fanOutNow
                        };
                    }
                default:
                    return candidateState;
            }
        }).catch((err)=>{
            console.error('[timer fan-out]', err);
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            remainingSeconds: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["computeRemaining"])(next),
            status: next.status
        });
    } catch (err) {
        console.error('[/api/timer POST]', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to update timer'
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__946f3265._.js.map