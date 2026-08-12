module.exports = [
"[project]/.next-internal/server/app/api/sessions/[sessionId]/scores/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[project]/src/app/api/sessions/[sessionId]/scores/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
// ---------------------------------------------------------------------------
// Formula evaluator
// ---------------------------------------------------------------------------
function computeScore(correct, wrong, total, formula, negativeMarking, negMarkValue) {
    const skipped = Math.max(0, total - correct - wrong);
    const attempted = correct + wrong;
    // Long names match what the Settings formula builder actually inserts
    // (entities/score-configuration/model/types.ts AVAILABLE_PLACEHOLDERS) —
    // every formula built through the UI uses these. Short aliases are kept
    // only in case a formula was ever hand-typed with the old names.
    const replacements = [
        [
            /\{correctAnswers\}/gi,
            correct
        ],
        [
            /\{wrongAnswers\}/gi,
            wrong
        ],
        [
            /\{skippedQuestions\}/gi,
            skipped
        ],
        [
            /\{totalQuestions\}/gi,
            total
        ],
        [
            /\{attemptedQuestions\}/gi,
            attempted
        ],
        [
            /\{correct\}/gi,
            correct
        ],
        [
            /\{wrong\}/gi,
            wrong
        ],
        [
            /\{total\}/gi,
            total
        ],
        [
            /\{skipped\}/gi,
            skipped
        ]
    ];
    let expr = formula;
    for (const [pattern, value] of replacements){
        expr = expr.replace(pattern, value.toString());
    }
    if (/^[\d\s+\-*/().]+$/.test(expr)) {
        try {
            const result = Number(Function(`'use strict'; return (${expr})`)());
            if (isFinite(result)) return Math.max(0, result);
        } catch  {}
    }
    const base = negativeMarking ? correct - wrong * negMarkValue : correct;
    return Math.max(0, base);
}
async function GET(_request, { params }) {
    const { sessionId } = await params;
    if (!sessionId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'sessionId is required'
        }, {
            status: 400
        });
    }
    let client;
    try {
        client = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].connect();
        // 1. Session info
        const sessionRes = await client.query(`SELECT id, name, date, center_id FROM exam_sessions WHERE id = $1`, [
            sessionId
        ]);
        if (sessionRes.rows.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Session not found'
            }, {
                status: 404
            });
        }
        const session = sessionRes.rows[0];
        // 2. Candidates who have at least one answer for this session.
        //    candidate_results is not populated by the backend, so candidate_answers
        //    is the reliable source. candidate.status is not used because it changes
        //    when a candidate is reassigned after submitting.
        const candidatesRes = await client.query(`SELECT id, first_name, last_name, surname, firstname
       FROM (
         SELECT DISTINCT c.id, c.first_name, c.last_name, c.surname, c.firstname
         FROM candidate_answers ca
         JOIN candidates c ON c.id = ca.candidate_id
         WHERE ca.session_id = $1
       ) t
       ORDER BY
         COALESCE(NULLIF(t.surname,   ''), t.last_name),
         COALESCE(NULLIF(t.firstname, ''), t.first_name)`, [
            sessionId
        ]);
        // 3. Questions for the session (joined with subject name)
        const questionsRes = await client.query(`SELECT q.id, q.subject_id, s.name AS subject_name, q.answer AS correct_answer
       FROM questions q
       JOIN subjects s ON s.id = q.subject_id
       WHERE q.session_id = $1`, [
            sessionId
        ]);
        // 4. All candidate answers for the session
        const answersRes = await client.query(`SELECT candidate_id, question_id, answer
       FROM candidate_answers
       WHERE session_id = $1`, [
            sessionId
        ]);
        // 5. Active score configuration for this session's center (fallback to plain correct count).
        //    isActive is scoped per-center (score_configurations.center_id), so this must be
        //    filtered by the session's own center — not just "any" active row in the table.
        const scoreConfigRes = session.center_id ? await client.query(`SELECT name, formula, scoring_type, negative_marking, negative_mark_value
           FROM score_configurations
           WHERE is_active = true AND center_id = $1
           ORDER BY updated_at DESC
           LIMIT 1`, [
            session.center_id
        ]) : {
            rows: []
        };
        const scoreConfig = scoreConfigRes.rows[0] ?? {
            name: 'Default',
            formula: 'correct',
            scoring_type: 'POINTS',
            negative_marking: false,
            negative_mark_value: null
        };
        const negMarkValue = scoreConfig.negative_mark_value ? parseFloat(scoreConfig.negative_mark_value) : 0;
        // Build per-subject question index
        const subjectMap = new Map();
        for (const q of questionsRes.rows){
            if (!subjectMap.has(q.subject_id)) {
                subjectMap.set(q.subject_id, {
                    id: q.subject_id,
                    name: q.subject_name,
                    questions: []
                });
            }
            subjectMap.get(q.subject_id).questions.push(q);
        }
        // Build answer lookup: `${candidateId}:${questionId}` → answer
        const answerMap = new Map();
        for (const a of answersRes.rows){
            answerMap.set(`${a.candidate_id}:${a.question_id}`, a.answer);
        }
        const subjects = Array.from(subjectMap.values());
        const candidates = candidatesRes.rows.map((cand)=>{
            const displayName = [
                cand.surname || cand.last_name,
                cand.firstname || cand.first_name
            ].filter(Boolean).join(' ');
            const subjectScores = subjects.map((subj)=>{
                let correct = 0;
                let wrong = 0;
                for (const q of subj.questions){
                    const given = answerMap.get(`${cand.id}:${q.id}`);
                    if (given == null) continue;
                    if (given === q.correct_answer) correct++;
                    else wrong++;
                }
                const total = subj.questions.length;
                const skipped = total - correct - wrong;
                const score = computeScore(correct, wrong, total, scoreConfig.formula, scoreConfig.negative_marking, negMarkValue);
                return {
                    subjectId: subj.id,
                    subjectName: subj.name,
                    correctAnswers: correct,
                    wrongAnswers: wrong,
                    skippedQuestions: skipped,
                    totalQuestions: total,
                    score,
                    scoreConfig: {
                        name: scoreConfig.name,
                        formula: scoreConfig.formula,
                        scoringType: scoreConfig.scoring_type
                    }
                };
            });
            const totalScore = subjectScores.reduce((sum, s)=>sum + s.score, 0);
            return {
                candidateId: cand.id,
                candidateName: displayName,
                subjects: subjectScores,
                totalScore
            };
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            sessionId: session.id,
            sessionName: session.name,
            sessionDate: session.date.toISOString(),
            candidates,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('[session-scores] error:', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: err instanceof Error ? err.message : 'Database error'
        }, {
            status: 500
        });
    } finally{
        try {
            client?.release();
        } catch  {}
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ffc3058e._.js.map