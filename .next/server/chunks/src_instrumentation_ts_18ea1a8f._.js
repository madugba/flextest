module.exports = [
"[project]/src/instrumentation.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Next.js instrumentation — runs once per worker process at startup.
//
// IMPORTANT: this file is compiled for BOTH Node.js and Edge runtimes.
// Keep it free of any top-level Node.js-only APIs (process.pid, require, etc.).
// All Node.js-specific logic lives in ./lib/timer-sync, which is only imported
// when process.env.NEXT_RUNTIME === 'nodejs' — the exact equality form that
// lets Turbopack/webpack dead-code-eliminate the import from the Edge bundle.
__turbopack_context__.s([
    "register",
    ()=>register
]);
async function register() {
    if ("TURBOPACK compile-time truthy", 1) {
        const { startTimerSync } = await __turbopack_context__.A("[project]/src/lib/timer-sync.ts [instrumentation] (ecmascript, async loader)");
        startTimerSync();
    }
}
}),
];

//# sourceMappingURL=src_instrumentation_ts_18ea1a8f._.js.map