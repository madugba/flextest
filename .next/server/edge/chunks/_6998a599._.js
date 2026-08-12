(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/_6998a599._.js",
"[project]/src/instrumentation.ts [instrumentation-edge] (ecmascript)", ((__turbopack_context__) => {
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
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
}
}),
"[project]/edge-wrapper.js { MODULE => \"[project]/src/instrumentation.ts [instrumentation-edge] (ecmascript)\" } [instrumentation-edge] (ecmascript)", ((__turbopack_context__, module, exports) => {

self._ENTRIES ||= {};
const modProm = Promise.resolve().then(()=>__turbopack_context__.i("[project]/src/instrumentation.ts [instrumentation-edge] (ecmascript)"));
modProm.catch(()=>{});
self._ENTRIES["middleware_instrumentation"] = new Proxy(modProm, {
    get (modProm, name) {
        if (name === "then") {
            return (res, rej)=>modProm.then(res, rej);
        }
        let result = (...args)=>modProm.then((mod)=>(0, mod[name])(...args));
        result.then = (res, rej)=>modProm.then((mod)=>mod[name]).then(res, rej);
        return result;
    }
});
}),
]);

//# sourceMappingURL=_6998a599._.js.map