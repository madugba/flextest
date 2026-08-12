(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/shared/ui/Spinner.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Spinner",
    ()=>Spinner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2Icon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2Icon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/lib/utils.ts [app-client] (ecmascript)");
;
;
;
function Spinner(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2Icon$3e$__["Loader2Icon"], {
        role: "status",
        "aria-label": "Loading",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("size-4 animate-spin", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/shared/ui/Spinner.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Spinner;
;
var _c;
__turbopack_context__.k.register(_c, "Spinner");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/entities/metrics/api/metricsApi.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createMetricsStream",
    ()=>createMetricsStream,
    "formatBytes",
    ()=>formatBytes,
    "formatUptime",
    ()=>formatUptime,
    "getActivityEvents",
    ()=>getActivityEvents,
    "getBusinessMetrics",
    ()=>getBusinessMetrics,
    "getDashboardMetrics",
    ()=>getDashboardMetrics,
    "getMetricColor",
    ()=>getMetricColor,
    "getStatusColor",
    ()=>getStatusColor,
    "getSystemMetrics",
    ()=>getSystemMetrics
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/api/client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/config/index.ts [app-client] (ecmascript)");
;
;
async function getDashboardMetrics() {
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get('/metrics/summary');
    if (!response.data) {
        throw new Error('No metrics data received');
    }
    return response.data;
}
async function getSystemMetrics() {
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get('/metrics/system');
    if (!response.data) {
        throw new Error('No system metrics data received');
    }
    return response.data;
}
async function getBusinessMetrics() {
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get('/metrics/business');
    if (!response.data) {
        throw new Error('No business metrics data received');
    }
    return response.data;
}
async function getActivityEvents() {
    let limit = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 20;
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get("/metrics/activity?limit=".concat(limit));
    if (!response.data) {
        return [];
    }
    return response.data;
}
function createMetricsStream() {
    const baseUrl = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["config"].apiBaseUrl;
    const streamUrl = "".concat(baseUrl, "/metrics/stream");
    const eventSource = new EventSource(streamUrl);
    return eventSource;
}
function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = [
        'B',
        'KB',
        'MB',
        'GB',
        'TB'
    ];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return "".concat(parseFloat((bytes / Math.pow(k, i)).toFixed(2)), " ").concat(sizes[i]);
}
function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor(seconds % 86400 / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);
    const parts = [];
    if (days > 0) parts.push("".concat(days, "d"));
    if (hours > 0) parts.push("".concat(hours, "h"));
    if (minutes > 0) parts.push("".concat(minutes, "m"));
    return parts.length > 0 ? parts.join(' ') : '< 1m';
}
function getStatusColor(status) {
    switch(status){
        case 'healthy':
            return 'bg-green-50 text-green-700 border-green-200';
        case 'degraded':
            return 'bg-yellow-50 text-yellow-700 border-yellow-200';
        case 'down':
            return 'bg-red-50 text-red-700 border-red-200';
        default:
            return 'bg-gray-50 text-gray-700 border-gray-200';
    }
}
function getMetricColor(value, warningThreshold, criticalThreshold) {
    if (value >= criticalThreshold) {
        return 'text-red-600';
    } else if (value >= warningThreshold) {
        return 'text-yellow-600';
    }
    return 'text-green-600';
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/metrics/model/useMetricsQuery.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useBusinessMetrics",
    ()=>useBusinessMetrics,
    "useCPUMetrics",
    ()=>useCPUMetrics,
    "useConnectionMetrics",
    ()=>useConnectionMetrics,
    "useDashboardMetrics",
    ()=>useDashboardMetrics,
    "useLastUpdate",
    ()=>useLastUpdate,
    "useMemoryMetrics",
    ()=>useMemoryMetrics,
    "useMetricsConnection",
    ()=>useMetricsConnection,
    "usePerformanceMetrics",
    ()=>usePerformanceMetrics,
    "useServerStatus",
    ()=>useServerStatus,
    "useSystemMetrics",
    ()=>useSystemMetrics
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$entities$2f$metrics$2f$api$2f$metricsApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/entities/metrics/api/metricsApi.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature(), _s8 = __turbopack_context__.k.signature(), _s9 = __turbopack_context__.k.signature();
;
;
function useDashboardMetrics() {
    _s();
    const cacheDurationMs = 10 * 60 * 1000;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'metrics',
            'dashboard'
        ],
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$entities$2f$metrics$2f$api$2f$metricsApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDashboardMetrics"],
        staleTime: Infinity,
        gcTime: cacheDurationMs
    });
}
_s(useDashboardMetrics, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useSystemMetrics() {
    _s1();
    const cacheDurationMs = 10 * 60 * 1000;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'metrics',
            'system'
        ],
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$entities$2f$metrics$2f$api$2f$metricsApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSystemMetrics"],
        staleTime: Infinity,
        gcTime: cacheDurationMs
    });
}
_s1(useSystemMetrics, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useBusinessMetrics() {
    _s2();
    const cacheDurationMs = 10 * 60 * 1000;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'metrics',
            'business'
        ],
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$entities$2f$metrics$2f$api$2f$metricsApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getBusinessMetrics"],
        staleTime: Infinity,
        gcTime: cacheDurationMs
    });
}
_s2(useBusinessMetrics, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useServerStatus() {
    var _data_system_server, _data_system, _data_system_server1, _data_system1, _data_system_server2, _data_system2;
    _s3();
    const { data } = useDashboardMetrics();
    return {
        status: (data === null || data === void 0 ? void 0 : (_data_system = data.system) === null || _data_system === void 0 ? void 0 : (_data_system_server = _data_system.server) === null || _data_system_server === void 0 ? void 0 : _data_system_server.status) || 'unknown',
        uptime: (data === null || data === void 0 ? void 0 : (_data_system1 = data.system) === null || _data_system1 === void 0 ? void 0 : (_data_system_server1 = _data_system1.server) === null || _data_system_server1 === void 0 ? void 0 : _data_system_server1.uptime) || 0,
        timestamp: (data === null || data === void 0 ? void 0 : (_data_system2 = data.system) === null || _data_system2 === void 0 ? void 0 : (_data_system_server2 = _data_system2.server) === null || _data_system_server2 === void 0 ? void 0 : _data_system_server2.timestamp) || new Date().toISOString()
    };
}
_s3(useServerStatus, "Qr2A8uqALsKXCiRmWX4l+dnajfQ=", false, function() {
    return [
        useDashboardMetrics
    ];
});
function useCPUMetrics() {
    var _data_system;
    _s4();
    const { data } = useDashboardMetrics();
    return data === null || data === void 0 ? void 0 : (_data_system = data.system) === null || _data_system === void 0 ? void 0 : _data_system.cpu;
}
_s4(useCPUMetrics, "Qr2A8uqALsKXCiRmWX4l+dnajfQ=", false, function() {
    return [
        useDashboardMetrics
    ];
});
function useMemoryMetrics() {
    var _data_system;
    _s5();
    const { data } = useDashboardMetrics();
    return data === null || data === void 0 ? void 0 : (_data_system = data.system) === null || _data_system === void 0 ? void 0 : _data_system.memory;
}
_s5(useMemoryMetrics, "Qr2A8uqALsKXCiRmWX4l+dnajfQ=", false, function() {
    return [
        useDashboardMetrics
    ];
});
function useConnectionMetrics() {
    _s6();
    const { data } = useDashboardMetrics();
    return data === null || data === void 0 ? void 0 : data.connections;
}
_s6(useConnectionMetrics, "Qr2A8uqALsKXCiRmWX4l+dnajfQ=", false, function() {
    return [
        useDashboardMetrics
    ];
});
function usePerformanceMetrics() {
    _s7();
    const { data } = useDashboardMetrics();
    return data === null || data === void 0 ? void 0 : data.performance;
}
_s7(usePerformanceMetrics, "Qr2A8uqALsKXCiRmWX4l+dnajfQ=", false, function() {
    return [
        useDashboardMetrics
    ];
});
function useLastUpdate() {
    _s8();
    const { dataUpdatedAt } = useDashboardMetrics();
    return dataUpdatedAt ? new Date(dataUpdatedAt) : null;
}
_s8(useLastUpdate, "FyrkDI17dTpllkC6F82tl6jd0RE=", false, function() {
    return [
        useDashboardMetrics
    ];
});
function useMetricsConnection() {
    _s9();
    const { isError, isLoading, isFetching } = useDashboardMetrics();
    return {
        connected: !isError && !isLoading,
        loading: isLoading,
        fetching: isFetching,
        error: isError
    };
}
_s9(useMetricsConnection, "DPLUV9bG4Lfk1dWmIkJMsSJmAa4=", false, function() {
    return [
        useDashboardMetrics
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/metrics/model/useMetricsStream.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useMetricsStream",
    ()=>useMetricsStream
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$authApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/api/authApi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/config/index.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
function useMetricsStream() {
    _s();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const eventSourceRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const reconnectTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(undefined);
    const reconnectDelayRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(5_000);
    const pendingUpdatesRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    const batchTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(undefined);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useMetricsStream.useEffect": ()=>{
            const flushBatch = {
                "useMetricsStream.useEffect.flushBatch": ()=>{
                    const updates = pendingUpdatesRef.current;
                    if (Object.keys(updates).length === 0) return;
                    queryClient.setQueryData([
                        'metrics',
                        'dashboard'
                    ], {
                        "useMetricsStream.useEffect.flushBatch": (old)=>{
                            if (!old) return old;
                            return {
                                ...old,
                                ...updates.system && {
                                    system: updates.system
                                },
                                ...updates.business && {
                                    business: updates.business
                                },
                                ...updates.connections && {
                                    connections: updates.connections
                                },
                                ...updates.performance && {
                                    performance: updates.performance
                                }
                            };
                        }
                    }["useMetricsStream.useEffect.flushBatch"]);
                    if (updates.system) {
                        queryClient.setQueryData([
                            'metrics',
                            'system'
                        ], updates.system);
                    }
                    if (updates.business) {
                        queryClient.setQueryData([
                            'metrics',
                            'business'
                        ], updates.business);
                    }
                    pendingUpdatesRef.current = {};
                }
            }["useMetricsStream.useEffect.flushBatch"];
            const scheduleBatch = {
                "useMetricsStream.useEffect.scheduleBatch": ()=>{
                    if (batchTimeoutRef.current) return;
                    const batchDelayMs = 200;
                    batchTimeoutRef.current = setTimeout({
                        "useMetricsStream.useEffect.scheduleBatch": ()=>{
                            flushBatch();
                            batchTimeoutRef.current = undefined;
                        }
                    }["useMetricsStream.useEffect.scheduleBatch"], batchDelayMs);
                }
            }["useMetricsStream.useEffect.scheduleBatch"];
            const baseDelayMs = 5_000;
            const maxDelayMs = 60_000;
            const getRetryAfterMs = {
                "useMetricsStream.useEffect.getRetryAfterMs": (response)=>{
                    const retryAfter = response.headers.get('retry-after');
                    if (!retryAfter) return undefined;
                    const asNumber = Number(retryAfter);
                    if (!Number.isNaN(asNumber)) {
                        return asNumber * 1000;
                    }
                    const retryDate = Date.parse(retryAfter);
                    if (!Number.isNaN(retryDate)) {
                        return Math.max(retryDate - Date.now(), baseDelayMs);
                    }
                    return undefined;
                }
            }["useMetricsStream.useEffect.getRetryAfterMs"];
            const resetReconnectDelay = {
                "useMetricsStream.useEffect.resetReconnectDelay": ()=>{
                    reconnectDelayRef.current = baseDelayMs;
                }
            }["useMetricsStream.useEffect.resetReconnectDelay"];
            const nextReconnectDelay = {
                "useMetricsStream.useEffect.nextReconnectDelay": (minimumDelay)=>{
                    const current = reconnectDelayRef.current;
                    const baseline = minimumDelay ? Math.max(current, minimumDelay) : current;
                    const next = Math.min(Math.max(baseline * 1.5, baseDelayMs), maxDelayMs);
                    reconnectDelayRef.current = next;
                    return next;
                }
            }["useMetricsStream.useEffect.nextReconnectDelay"];
            const scheduleReconnect = {
                "useMetricsStream.useEffect.scheduleReconnect": (delay)=>{
                    if (reconnectTimeoutRef.current) {
                        clearTimeout(reconnectTimeoutRef.current);
                    }
                    reconnectTimeoutRef.current = setTimeout({
                        "useMetricsStream.useEffect.scheduleReconnect": ()=>{
                            reconnectTimeoutRef.current = undefined;
                            connectSSE();
                        }
                    }["useMetricsStream.useEffect.scheduleReconnect"], delay);
                }
            }["useMetricsStream.useEffect.scheduleReconnect"];
            const connectSSE = {
                "useMetricsStream.useEffect.connectSSE": async ()=>{
                    if (eventSourceRef.current) {
                        eventSourceRef.current.close();
                    }
                    const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$authApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuthToken"])();
                    if (!token) {
                        console.warn('No auth token available for metrics stream');
                        return;
                    }
                    const url = "".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["config"].apiBaseUrl, "/metrics/stream");
                    try {
                        const response = await fetch(url, {
                            method: 'GET',
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Accept': 'text/event-stream'
                            }
                        });
                        if (!response.ok) {
                            var _getRetryAfterMs;
                            const retryDelay = (_getRetryAfterMs = getRetryAfterMs(response)) !== null && _getRetryAfterMs !== void 0 ? _getRetryAfterMs : nextReconnectDelay();
                            console.warn("SSE connection failed (".concat(response.status, "). Retrying in ").concat(retryDelay / 1000, "s"));
                            scheduleReconnect(retryDelay);
                            return;
                        }
                        if (!response.body) {
                            const retryDelay = nextReconnectDelay();
                            console.warn("SSE response body empty. Retrying in ".concat(retryDelay / 1000, "s"));
                            scheduleReconnect(retryDelay);
                            return;
                        }
                        resetReconnectDelay();
                        const reader = response.body.getReader();
                        const decoder = new TextDecoder();
                        let buffer = '';
                        const eventSource = {
                            close: {
                                "useMetricsStream.useEffect.connectSSE": ()=>{
                                    reader.cancel();
                                }
                            }["useMetricsStream.useEffect.connectSSE"]
                        };
                        eventSourceRef.current = eventSource;
                        const processStream = {
                            "useMetricsStream.useEffect.connectSSE.processStream": async ()=>{
                                try {
                                    while(true){
                                        const { done, value } = await reader.read();
                                        if (done) {
                                            console.log('SSE stream closed');
                                            break;
                                        }
                                        buffer += decoder.decode(value, {
                                            stream: true
                                        });
                                        const lines = buffer.split('\n\n');
                                        buffer = lines.pop() || '';
                                        for (const line of lines){
                                            if (!line.trim()) continue;
                                            const eventMatch = line.match(/^event: (.+)$/m);
                                            const dataMatch = line.match(/^data: (.+)$/m);
                                            if (eventMatch && dataMatch) {
                                                const eventType = eventMatch[1];
                                                const eventData = dataMatch[1];
                                                handleSSEEvent(eventType, eventData);
                                            }
                                        }
                                    }
                                } catch (error) {
                                    console.error('Error reading SSE stream:', error);
                                }
                            }
                        }["useMetricsStream.useEffect.connectSSE.processStream"];
                        const handleSSEEvent = {
                            "useMetricsStream.useEffect.connectSSE.handleSSEEvent": (eventType, data)=>{
                                try {
                                    switch(eventType){
                                        case 'connected':
                                            console.log('📡 Metrics stream connected:', data);
                                            break;
                                        case 'metrics':
                                            {
                                                const metrics = JSON.parse(data);
                                                queryClient.setQueryData([
                                                    'metrics',
                                                    'dashboard'
                                                ], metrics);
                                                if (metrics.system) {
                                                    queryClient.setQueryData([
                                                        'metrics',
                                                        'system'
                                                    ], metrics.system);
                                                }
                                                if (metrics.business) {
                                                    queryClient.setQueryData([
                                                        'metrics',
                                                        'business'
                                                    ], metrics.business);
                                                }
                                                break;
                                            }
                                        case 'system_update':
                                            {
                                                const systemMetrics = JSON.parse(data);
                                                pendingUpdatesRef.current.system = systemMetrics;
                                                scheduleBatch();
                                                break;
                                            }
                                        case 'business_update':
                                            {
                                                const businessMetrics = JSON.parse(data);
                                                pendingUpdatesRef.current.business = businessMetrics;
                                                scheduleBatch();
                                                break;
                                            }
                                        case 'connection_update':
                                            {
                                                const connectionMetrics = JSON.parse(data);
                                                pendingUpdatesRef.current.connections = connectionMetrics;
                                                scheduleBatch();
                                                break;
                                            }
                                        case 'performance_update':
                                            {
                                                const performanceMetrics = JSON.parse(data);
                                                pendingUpdatesRef.current.performance = performanceMetrics;
                                                scheduleBatch();
                                                break;
                                            }
                                        case 'heartbeat':
                                            console.log('💓 Heartbeat:', data);
                                            break;
                                        default:
                                            console.warn('Unknown SSE event:', eventType);
                                    }
                                } catch (error) {
                                    console.error("Error handling ".concat(eventType, " event:"), error);
                                }
                            }
                        }["useMetricsStream.useEffect.connectSSE.handleSSEEvent"];
                        processStream();
                    } catch (error) {
                        console.error('❌ SSE connection error:', error);
                        const retryDelay = nextReconnectDelay();
                        console.log("🔄 Reconnecting to metrics stream in ".concat(retryDelay / 1000, "s..."));
                        scheduleReconnect(retryDelay);
                    }
                }
            }["useMetricsStream.useEffect.connectSSE"];
            connectSSE();
            return ({
                "useMetricsStream.useEffect": ()=>{
                    if (eventSourceRef.current) {
                        eventSourceRef.current.close();
                        eventSourceRef.current = null;
                    }
                    if (reconnectTimeoutRef.current) {
                        clearTimeout(reconnectTimeoutRef.current);
                    }
                    if (batchTimeoutRef.current) {
                        clearTimeout(batchTimeoutRef.current);
                        flushBatch();
                    }
                }
            })["useMetricsStream.useEffect"];
        }
    }["useMetricsStream.useEffect"], [
        queryClient
    ]);
    return {
        connected: eventSourceRef.current !== null
    };
}
_s(useMetricsStream, "ki0XtyZYHwnpJEL4SMbjzQtm6Q0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/features/metrics/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$metrics$2f$model$2f$useMetricsQuery$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/metrics/model/useMetricsQuery.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$metrics$2f$model$2f$useMetricsStream$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/metrics/model/useMetricsStream.ts [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/entities/metrics/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$entities$2f$metrics$2f$api$2f$metricsApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/entities/metrics/api/metricsApi.ts [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/dashboard/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$ui$2f$Spinner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/ui/Spinner.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$dashboard$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/widgets/dashboard/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$dashboard$2f$ui$2f$DashboardHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/widgets/dashboard/ui/DashboardHeader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$dashboard$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/widgets/dashboard/ui/MetricCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$metrics$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/metrics/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$metrics$2f$model$2f$useMetricsQuery$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/metrics/model/useMetricsQuery.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$metrics$2f$model$2f$useMetricsStream$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/metrics/model/useMetricsStream.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$entities$2f$metrics$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/entities/metrics/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$entities$2f$metrics$2f$api$2f$metricsApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/entities/metrics/api/metricsApi.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
function DashboardPage() {
    var _system_server, _system_server_status, _system_server1, _system_server2, _system_server3, _system_server4, _system_cpu_usage, _system_cpu, _system_cpu_average, _system_cpu1, _system_cpu2, _system_cpu3, _system_memory, _system_memory_percentage, _system_memory1, _system_memory2, _system_memory3, _system_memory4, _connections_clients, _connections_clients1, _business_centers, _business_centers1, _business_admins, _business_admins1, _business_sessions, _business_security, _business_security1, _business_security2, _connections_database, _connections_database1, _connections_database2, _connections_redis, _connections_redis1, _connections_redis2, _system_requests_perSecond, _system_requests, _system_requests1, _performance_responseTime, _performance_responseTime1, _performance_responseTime2, _performance_responseTime3, _performance_responseTime4, _performance_errorRate_percentage, _performance_errorRate, _performance_errorRate1, _performance_errorRate2, _performance_errorRate3;
    _s();
    const { user, loading: authLoading, isAuthenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$metrics$2f$model$2f$useMetricsStream$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMetricsStream"])();
    const { data: metrics, isLoading, isError, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$metrics$2f$model$2f$useMetricsQuery$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDashboardMetrics"])();
    const lastUpdate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$metrics$2f$model$2f$useMetricsQuery$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLastUpdate"])();
    const { connected } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$metrics$2f$model$2f$useMetricsQuery$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMetricsConnection"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardPage.useEffect": ()=>{
            if (!authLoading && !isAuthenticated) {
                router.push('/login');
            }
        }
    }["DashboardPage.useEffect"], [
        authLoading,
        isAuthenticated,
        router
    ]);
    if (authLoading || isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-1 items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$ui$2f$Spinner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Spinner"], {}, void 0, false, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 37,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-4 text-sm text-gray-600",
                        children: "Loading dashboard..."
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 38,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 36,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 35,
            columnNumber: 7
        }, this);
    }
    if (!user) {
        return null;
    }
    if (isError) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$dashboard$2f$ui$2f$DashboardHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DashboardHeader"], {
                    serverStatus: "unknown",
                    lastUpdate: null,
                    connected: false
                }, void 0, false, {
                    fileName: "[project]/src/app/dashboard/page.tsx",
                    lineNumber: 51,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                    className: "flex-1 overflow-auto p-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-red-50 border border-red-200 rounded-lg p-4 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-red-800 font-medium",
                                children: "Error loading metrics"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 54,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-red-600 text-sm mt-1",
                                children: error instanceof Error ? error.message : 'Failed to load dashboard metrics'
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 55,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 53,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/dashboard/page.tsx",
                    lineNumber: 52,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true);
    }
    if (!metrics) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-1 items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$ui$2f$Spinner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Spinner"], {}, void 0, false, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 68,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-4 text-sm text-gray-600",
                        children: "Loading metrics data..."
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 69,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 67,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/dashboard/page.tsx",
            lineNumber: 66,
            columnNumber: 7
        }, this);
    }
    const system = metrics === null || metrics === void 0 ? void 0 : metrics.system;
    const connections = metrics === null || metrics === void 0 ? void 0 : metrics.connections;
    const business = metrics === null || metrics === void 0 ? void 0 : metrics.business;
    const performance = metrics === null || metrics === void 0 ? void 0 : metrics.performance;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$dashboard$2f$ui$2f$DashboardHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DashboardHeader"], {
                serverStatus: (system === null || system === void 0 ? void 0 : (_system_server = system.server) === null || _system_server === void 0 ? void 0 : _system_server.status) || 'unknown',
                lastUpdate: lastUpdate,
                connected: connected
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "flex-1 overflow-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-7xl mx-auto space-y-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "grid grid-cols-1 xl:grid-cols-2 gap-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-2xl font-bold text-gray-900",
                                        children: [
                                            "Welcome back, ",
                                            user.firstName,
                                            "!"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 92,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-gray-600 mt-1",
                                        children: "Monitor your system in real-time"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 95,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 91,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboard/page.tsx",
                            lineNumber: 90,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$dashboard$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                                    title: "Server Status",
                                    value: (system === null || system === void 0 ? void 0 : (_system_server1 = system.server) === null || _system_server1 === void 0 ? void 0 : (_system_server_status = _system_server1.status) === null || _system_server_status === void 0 ? void 0 : _system_server_status.toUpperCase()) || 'UNKNOWN',
                                    subtitle: (system === null || system === void 0 ? void 0 : (_system_server2 = system.server) === null || _system_server2 === void 0 ? void 0 : _system_server2.uptime) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$entities$2f$metrics$2f$api$2f$metricsApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatUptime"])(system.server.uptime) : '',
                                    status: (system === null || system === void 0 ? void 0 : (_system_server3 = system.server) === null || _system_server3 === void 0 ? void 0 : _system_server3.status) === 'healthy' ? 'healthy' : (system === null || system === void 0 ? void 0 : (_system_server4 = system.server) === null || _system_server4 === void 0 ? void 0 : _system_server4.status) === 'degraded' ? 'warning' : 'critical',
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-6 h-6",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                            lineNumber: 115,
                                            columnNumber: 19
                                        }, void 0)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 114,
                                        columnNumber: 17
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                    lineNumber: 102,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$dashboard$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                                    title: "CPU Usage",
                                    value: "".concat((system === null || system === void 0 ? void 0 : (_system_cpu = system.cpu) === null || _system_cpu === void 0 ? void 0 : (_system_cpu_usage = _system_cpu.usage) === null || _system_cpu_usage === void 0 ? void 0 : _system_cpu_usage.toFixed(1)) || 0, "%"),
                                    subtitle: "Avg: ".concat((system === null || system === void 0 ? void 0 : (_system_cpu1 = system.cpu) === null || _system_cpu1 === void 0 ? void 0 : (_system_cpu_average = _system_cpu1.average) === null || _system_cpu_average === void 0 ? void 0 : _system_cpu_average.toFixed(1)) || 0, "%"),
                                    status: ((system === null || system === void 0 ? void 0 : (_system_cpu2 = system.cpu) === null || _system_cpu2 === void 0 ? void 0 : _system_cpu2.usage) || 0) > 85 ? 'critical' : ((system === null || system === void 0 ? void 0 : (_system_cpu3 = system.cpu) === null || _system_cpu3 === void 0 ? void 0 : _system_cpu3.usage) || 0) > 70 ? 'warning' : 'healthy',
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-6 h-6",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                            lineNumber: 138,
                                            columnNumber: 19
                                        }, void 0)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 137,
                                        columnNumber: 17
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                    lineNumber: 125,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$dashboard$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                                    title: "Memory",
                                    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$entities$2f$metrics$2f$api$2f$metricsApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatBytes"])((system === null || system === void 0 ? void 0 : (_system_memory = system.memory) === null || _system_memory === void 0 ? void 0 : _system_memory.used) || 0),
                                    subtitle: "".concat((system === null || system === void 0 ? void 0 : (_system_memory1 = system.memory) === null || _system_memory1 === void 0 ? void 0 : (_system_memory_percentage = _system_memory1.percentage) === null || _system_memory_percentage === void 0 ? void 0 : _system_memory_percentage.toFixed(1)) || 0, "% of ").concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$entities$2f$metrics$2f$api$2f$metricsApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatBytes"])((system === null || system === void 0 ? void 0 : (_system_memory2 = system.memory) === null || _system_memory2 === void 0 ? void 0 : _system_memory2.total) || 0)),
                                    status: ((system === null || system === void 0 ? void 0 : (_system_memory3 = system.memory) === null || _system_memory3 === void 0 ? void 0 : _system_memory3.percentage) || 0) > 90 ? 'critical' : ((system === null || system === void 0 ? void 0 : (_system_memory4 = system.memory) === null || _system_memory4 === void 0 ? void 0 : _system_memory4.percentage) || 0) > 75 ? 'warning' : 'healthy',
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-6 h-6",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                            lineNumber: 161,
                                            columnNumber: 19
                                        }, void 0)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 160,
                                        columnNumber: 17
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                    lineNumber: 148,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$dashboard$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                                    title: "Connected Clients",
                                    value: (connections === null || connections === void 0 ? void 0 : (_connections_clients = connections.clients) === null || _connections_clients === void 0 ? void 0 : _connections_clients.active) || 0,
                                    subtitle: "Peak: ".concat((connections === null || connections === void 0 ? void 0 : (_connections_clients1 = connections.clients) === null || _connections_clients1 === void 0 ? void 0 : _connections_clients1.peak) || 0),
                                    status: "neutral",
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-6 h-6",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                            lineNumber: 178,
                                            columnNumber: 19
                                        }, void 0)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 177,
                                        columnNumber: 17
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                    lineNumber: 171,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/dashboard/page.tsx",
                            lineNumber: 101,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$dashboard$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                                    title: "Total Centers",
                                    value: (business === null || business === void 0 ? void 0 : (_business_centers = business.centers) === null || _business_centers === void 0 ? void 0 : _business_centers.total) || 0,
                                    subtitle: "".concat((business === null || business === void 0 ? void 0 : (_business_centers1 = business.centers) === null || _business_centers1 === void 0 ? void 0 : _business_centers1.active) || 0, " active"),
                                    status: "neutral",
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-6 h-6",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                            lineNumber: 197,
                                            columnNumber: 19
                                        }, void 0)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 196,
                                        columnNumber: 17
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                    lineNumber: 190,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$dashboard$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                                    title: "Total Admins",
                                    value: (business === null || business === void 0 ? void 0 : (_business_admins = business.admins) === null || _business_admins === void 0 ? void 0 : _business_admins.total) || 0,
                                    subtitle: "".concat((business === null || business === void 0 ? void 0 : (_business_admins1 = business.admins) === null || _business_admins1 === void 0 ? void 0 : _business_admins1.active) || 0, " active today"),
                                    status: "neutral",
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-6 h-6",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                            lineNumber: 214,
                                            columnNumber: 19
                                        }, void 0)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 213,
                                        columnNumber: 17
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                    lineNumber: 207,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$dashboard$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                                    title: "Active Sessions",
                                    value: (business === null || business === void 0 ? void 0 : (_business_sessions = business.sessions) === null || _business_sessions === void 0 ? void 0 : _business_sessions.active) || 0,
                                    subtitle: "Live sessions",
                                    status: "neutral",
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-6 h-6",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                            lineNumber: 231,
                                            columnNumber: 19
                                        }, void 0)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 230,
                                        columnNumber: 17
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                    lineNumber: 224,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$dashboard$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                                    title: "Failed Logins",
                                    value: (business === null || business === void 0 ? void 0 : (_business_security = business.security) === null || _business_security === void 0 ? void 0 : _business_security.failedLogins) || 0,
                                    subtitle: "Last hour",
                                    status: ((business === null || business === void 0 ? void 0 : (_business_security1 = business.security) === null || _business_security1 === void 0 ? void 0 : _business_security1.failedLogins) || 0) > 10 ? 'critical' : ((business === null || business === void 0 ? void 0 : (_business_security2 = business.security) === null || _business_security2 === void 0 ? void 0 : _business_security2.failedLogins) || 0) > 5 ? 'warning' : 'healthy',
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-6 h-6",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                            lineNumber: 254,
                                            columnNumber: 19
                                        }, void 0)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 253,
                                        columnNumber: 17
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                    lineNumber: 241,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/dashboard/page.tsx",
                            lineNumber: 189,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$dashboard$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                                    title: "Database Connections",
                                    value: "".concat((connections === null || connections === void 0 ? void 0 : (_connections_database = connections.database) === null || _connections_database === void 0 ? void 0 : _connections_database.active) || 0, "/").concat((connections === null || connections === void 0 ? void 0 : (_connections_database1 = connections.database) === null || _connections_database1 === void 0 ? void 0 : _connections_database1.max) || 0),
                                    subtitle: "".concat((connections === null || connections === void 0 ? void 0 : (_connections_database2 = connections.database) === null || _connections_database2 === void 0 ? void 0 : _connections_database2.idle) || 0, " idle"),
                                    status: "neutral"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                    lineNumber: 266,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$dashboard$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                                    title: "Redis Status",
                                    value: (connections === null || connections === void 0 ? void 0 : (_connections_redis = connections.redis) === null || _connections_redis === void 0 ? void 0 : _connections_redis.connected) ? 'Connected' : 'Disconnected',
                                    subtitle: (connections === null || connections === void 0 ? void 0 : (_connections_redis1 = connections.redis) === null || _connections_redis1 === void 0 ? void 0 : _connections_redis1.connected) ? 'Healthy' : 'Check connection',
                                    status: (connections === null || connections === void 0 ? void 0 : (_connections_redis2 = connections.redis) === null || _connections_redis2 === void 0 ? void 0 : _connections_redis2.connected) ? 'healthy' : 'critical'
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                    lineNumber: 273,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$dashboard$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                                    title: "Requests/Second",
                                    value: (system === null || system === void 0 ? void 0 : (_system_requests = system.requests) === null || _system_requests === void 0 ? void 0 : (_system_requests_perSecond = _system_requests.perSecond) === null || _system_requests_perSecond === void 0 ? void 0 : _system_requests_perSecond.toFixed(2)) || '0.00',
                                    subtitle: "".concat((system === null || system === void 0 ? void 0 : (_system_requests1 = system.requests) === null || _system_requests1 === void 0 ? void 0 : _system_requests1.total) || 0, " total"),
                                    status: "neutral"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                    lineNumber: 280,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/dashboard/page.tsx",
                            lineNumber: 265,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$dashboard$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                                    title: "Avg Response Time",
                                    value: "".concat((performance === null || performance === void 0 ? void 0 : (_performance_responseTime = performance.responseTime) === null || _performance_responseTime === void 0 ? void 0 : _performance_responseTime.average) || 0, "ms"),
                                    subtitle: "P50",
                                    status: ((performance === null || performance === void 0 ? void 0 : (_performance_responseTime1 = performance.responseTime) === null || _performance_responseTime1 === void 0 ? void 0 : _performance_responseTime1.average) || 0) > 500 ? 'critical' : ((performance === null || performance === void 0 ? void 0 : (_performance_responseTime2 = performance.responseTime) === null || _performance_responseTime2 === void 0 ? void 0 : _performance_responseTime2.average) || 0) > 200 ? 'warning' : 'healthy'
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                    lineNumber: 289,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$dashboard$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                                    title: "P95 Response Time",
                                    value: "".concat((performance === null || performance === void 0 ? void 0 : (_performance_responseTime3 = performance.responseTime) === null || _performance_responseTime3 === void 0 ? void 0 : _performance_responseTime3.p95) || 0, "ms"),
                                    subtitle: "95th percentile",
                                    status: "neutral"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                    lineNumber: 302,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$dashboard$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                                    title: "P99 Response Time",
                                    value: "".concat((performance === null || performance === void 0 ? void 0 : (_performance_responseTime4 = performance.responseTime) === null || _performance_responseTime4 === void 0 ? void 0 : _performance_responseTime4.p99) || 0, "ms"),
                                    subtitle: "99th percentile",
                                    status: "neutral"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                    lineNumber: 309,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$dashboard$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                                    title: "Error Rate",
                                    value: "".concat((performance === null || performance === void 0 ? void 0 : (_performance_errorRate = performance.errorRate) === null || _performance_errorRate === void 0 ? void 0 : (_performance_errorRate_percentage = _performance_errorRate.percentage) === null || _performance_errorRate_percentage === void 0 ? void 0 : _performance_errorRate_percentage.toFixed(2)) || 0, "%"),
                                    subtitle: "".concat((performance === null || performance === void 0 ? void 0 : (_performance_errorRate1 = performance.errorRate) === null || _performance_errorRate1 === void 0 ? void 0 : _performance_errorRate1.count) || 0, " errors"),
                                    status: ((performance === null || performance === void 0 ? void 0 : (_performance_errorRate2 = performance.errorRate) === null || _performance_errorRate2 === void 0 ? void 0 : _performance_errorRate2.percentage) || 0) > 5 ? 'critical' : ((performance === null || performance === void 0 ? void 0 : (_performance_errorRate3 = performance.errorRate) === null || _performance_errorRate3 === void 0 ? void 0 : _performance_errorRate3.percentage) || 0) > 1 ? 'warning' : 'healthy'
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                    lineNumber: 316,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/dashboard/page.tsx",
                            lineNumber: 288,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/dashboard/page.tsx",
                    lineNumber: 89,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 88,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(DashboardPage, "iWXe6hdEKjwSbYNZUjj3iGepBQ0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$metrics$2f$model$2f$useMetricsStream$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMetricsStream"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$metrics$2f$model$2f$useMetricsQuery$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDashboardMetrics"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$metrics$2f$model$2f$useMetricsQuery$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLastUpdate"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$metrics$2f$model$2f$useMetricsQuery$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMetricsConnection"]
    ];
});
_c = DashboardPage;
const SystemHealthSection = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].memo(_c1 = (param)=>{
    let { system, connections } = param;
    var _system_server_status, _system_server, _system_server1, _system_server2, _system_server3, _system_cpu_usage, _system_cpu, _system_cpu_average, _system_cpu1, _system_cpu2, _system_cpu3, _system_memory, _system_memory_percentage, _system_memory1, _system_memory2, _system_memory3, _system_memory4, _connections_clients, _connections_clients1;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-lg font-semibold text-gray-900 mb-4",
                children: "System Health"
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 340,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$dashboard$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                        title: "Server Status",
                        value: (system === null || system === void 0 ? void 0 : (_system_server = system.server) === null || _system_server === void 0 ? void 0 : (_system_server_status = _system_server.status) === null || _system_server_status === void 0 ? void 0 : _system_server_status.toUpperCase()) || 'UNKNOWN',
                        subtitle: (system === null || system === void 0 ? void 0 : (_system_server1 = system.server) === null || _system_server1 === void 0 ? void 0 : _system_server1.uptime) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$entities$2f$metrics$2f$api$2f$metricsApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatUptime"])(system.server.uptime) : '',
                        status: (system === null || system === void 0 ? void 0 : (_system_server2 = system.server) === null || _system_server2 === void 0 ? void 0 : _system_server2.status) === 'healthy' ? 'healthy' : (system === null || system === void 0 ? void 0 : (_system_server3 = system.server) === null || _system_server3 === void 0 ? void 0 : _system_server3.status) === 'degraded' ? 'warning' : 'critical',
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-6 h-6",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 355,
                                columnNumber: 13
                            }, void 0)
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboard/page.tsx",
                            lineNumber: 354,
                            columnNumber: 11
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 342,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$dashboard$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                        title: "CPU Usage",
                        value: "".concat((system === null || system === void 0 ? void 0 : (_system_cpu = system.cpu) === null || _system_cpu === void 0 ? void 0 : (_system_cpu_usage = _system_cpu.usage) === null || _system_cpu_usage === void 0 ? void 0 : _system_cpu_usage.toFixed(1)) || 0, "%"),
                        subtitle: "Avg: ".concat((system === null || system === void 0 ? void 0 : (_system_cpu1 = system.cpu) === null || _system_cpu1 === void 0 ? void 0 : (_system_cpu_average = _system_cpu1.average) === null || _system_cpu_average === void 0 ? void 0 : _system_cpu_average.toFixed(1)) || 0, "%"),
                        status: ((system === null || system === void 0 ? void 0 : (_system_cpu2 = system.cpu) === null || _system_cpu2 === void 0 ? void 0 : _system_cpu2.usage) || 0) > 85 ? 'critical' : ((system === null || system === void 0 ? void 0 : (_system_cpu3 = system.cpu) === null || _system_cpu3 === void 0 ? void 0 : _system_cpu3.usage) || 0) > 70 ? 'warning' : 'healthy',
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-6 h-6",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 378,
                                columnNumber: 13
                            }, void 0)
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboard/page.tsx",
                            lineNumber: 377,
                            columnNumber: 11
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 365,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$dashboard$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                        title: "Memory",
                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$entities$2f$metrics$2f$api$2f$metricsApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatBytes"])((system === null || system === void 0 ? void 0 : (_system_memory = system.memory) === null || _system_memory === void 0 ? void 0 : _system_memory.used) || 0),
                        subtitle: "".concat((system === null || system === void 0 ? void 0 : (_system_memory1 = system.memory) === null || _system_memory1 === void 0 ? void 0 : (_system_memory_percentage = _system_memory1.percentage) === null || _system_memory_percentage === void 0 ? void 0 : _system_memory_percentage.toFixed(1)) || 0, "% of ").concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$entities$2f$metrics$2f$api$2f$metricsApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatBytes"])((system === null || system === void 0 ? void 0 : (_system_memory2 = system.memory) === null || _system_memory2 === void 0 ? void 0 : _system_memory2.total) || 0)),
                        status: ((system === null || system === void 0 ? void 0 : (_system_memory3 = system.memory) === null || _system_memory3 === void 0 ? void 0 : _system_memory3.percentage) || 0) > 90 ? 'critical' : ((system === null || system === void 0 ? void 0 : (_system_memory4 = system.memory) === null || _system_memory4 === void 0 ? void 0 : _system_memory4.percentage) || 0) > 75 ? 'warning' : 'healthy',
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-6 h-6",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 401,
                                columnNumber: 13
                            }, void 0)
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboard/page.tsx",
                            lineNumber: 400,
                            columnNumber: 11
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 388,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$dashboard$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                        title: "Active Clients",
                        value: (connections === null || connections === void 0 ? void 0 : (_connections_clients = connections.clients) === null || _connections_clients === void 0 ? void 0 : _connections_clients.active) || 0,
                        subtitle: "Peak: ".concat((connections === null || connections === void 0 ? void 0 : (_connections_clients1 = connections.clients) === null || _connections_clients1 === void 0 ? void 0 : _connections_clients1.peak) || 0),
                        status: "neutral",
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-6 h-6",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 418,
                                columnNumber: 13
                            }, void 0)
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboard/page.tsx",
                            lineNumber: 417,
                            columnNumber: 11
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 411,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 341,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/dashboard/page.tsx",
        lineNumber: 339,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c2 = SystemHealthSection;
const BusinessMetricsSection = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].memo(_c3 = (param)=>{
    let { business } = param;
    var _business_centers, _business_centers1, _business_admins, _business_admins1, _business_sessions, _business_security, _business_security1, _business_security2;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-lg font-semibold text-gray-900 mb-4",
                children: "Business Metrics"
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 433,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$dashboard$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                        title: "Total Centers",
                        value: (business === null || business === void 0 ? void 0 : (_business_centers = business.centers) === null || _business_centers === void 0 ? void 0 : _business_centers.total) || 0,
                        subtitle: "".concat((business === null || business === void 0 ? void 0 : (_business_centers1 = business.centers) === null || _business_centers1 === void 0 ? void 0 : _business_centers1.active) || 0, " active"),
                        status: "neutral",
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-6 h-6",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 442,
                                columnNumber: 13
                            }, void 0)
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboard/page.tsx",
                            lineNumber: 441,
                            columnNumber: 11
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 435,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$dashboard$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                        title: "Total Admins",
                        value: (business === null || business === void 0 ? void 0 : (_business_admins = business.admins) === null || _business_admins === void 0 ? void 0 : _business_admins.total) || 0,
                        subtitle: "".concat((business === null || business === void 0 ? void 0 : (_business_admins1 = business.admins) === null || _business_admins1 === void 0 ? void 0 : _business_admins1.active) || 0, " active today"),
                        status: "neutral",
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-6 h-6",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 459,
                                columnNumber: 13
                            }, void 0)
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboard/page.tsx",
                            lineNumber: 458,
                            columnNumber: 11
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 452,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$dashboard$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                        title: "Active Sessions",
                        value: (business === null || business === void 0 ? void 0 : (_business_sessions = business.sessions) === null || _business_sessions === void 0 ? void 0 : _business_sessions.active) || 0,
                        subtitle: "Live sessions",
                        status: "neutral",
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-6 h-6",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 476,
                                columnNumber: 13
                            }, void 0)
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboard/page.tsx",
                            lineNumber: 475,
                            columnNumber: 11
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 469,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$dashboard$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                        title: "Failed Logins",
                        value: (business === null || business === void 0 ? void 0 : (_business_security = business.security) === null || _business_security === void 0 ? void 0 : _business_security.failedLogins) || 0,
                        subtitle: "Last hour",
                        status: ((business === null || business === void 0 ? void 0 : (_business_security1 = business.security) === null || _business_security1 === void 0 ? void 0 : _business_security1.failedLogins) || 0) > 10 ? 'critical' : ((business === null || business === void 0 ? void 0 : (_business_security2 = business.security) === null || _business_security2 === void 0 ? void 0 : _business_security2.failedLogins) || 0) > 5 ? 'warning' : 'healthy',
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-6 h-6",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 499,
                                columnNumber: 13
                            }, void 0)
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboard/page.tsx",
                            lineNumber: 498,
                            columnNumber: 11
                        }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 486,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 434,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/dashboard/page.tsx",
        lineNumber: 432,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c4 = BusinessMetricsSection;
const InfrastructureSection = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].memo(_c5 = (param)=>{
    let { connections, system } = param;
    var _connections_database, _connections_database1, _connections_database2, _connections_redis, _connections_redis1, _connections_redis2, _system_requests_perSecond, _system_requests, _system_requests1;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-lg font-semibold text-gray-900 mb-4",
                children: "Infrastructure"
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 517,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-3 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$dashboard$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                        title: "Database Connections",
                        value: "".concat((connections === null || connections === void 0 ? void 0 : (_connections_database = connections.database) === null || _connections_database === void 0 ? void 0 : _connections_database.active) || 0, "/").concat((connections === null || connections === void 0 ? void 0 : (_connections_database1 = connections.database) === null || _connections_database1 === void 0 ? void 0 : _connections_database1.max) || 0),
                        subtitle: "".concat((connections === null || connections === void 0 ? void 0 : (_connections_database2 = connections.database) === null || _connections_database2 === void 0 ? void 0 : _connections_database2.idle) || 0, " idle"),
                        status: "neutral"
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 519,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$dashboard$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                        title: "Redis Status",
                        value: (connections === null || connections === void 0 ? void 0 : (_connections_redis = connections.redis) === null || _connections_redis === void 0 ? void 0 : _connections_redis.connected) ? 'Connected' : 'Disconnected',
                        subtitle: (connections === null || connections === void 0 ? void 0 : (_connections_redis1 = connections.redis) === null || _connections_redis1 === void 0 ? void 0 : _connections_redis1.connected) ? 'Healthy' : 'Check connection',
                        status: (connections === null || connections === void 0 ? void 0 : (_connections_redis2 = connections.redis) === null || _connections_redis2 === void 0 ? void 0 : _connections_redis2.connected) ? 'healthy' : 'critical'
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 526,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$dashboard$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                        title: "Requests/Second",
                        value: (system === null || system === void 0 ? void 0 : (_system_requests = system.requests) === null || _system_requests === void 0 ? void 0 : (_system_requests_perSecond = _system_requests.perSecond) === null || _system_requests_perSecond === void 0 ? void 0 : _system_requests_perSecond.toFixed(2)) || '0.00',
                        subtitle: "".concat((system === null || system === void 0 ? void 0 : (_system_requests1 = system.requests) === null || _system_requests1 === void 0 ? void 0 : _system_requests1.total) || 0, " total"),
                        status: "neutral"
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 533,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 518,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/dashboard/page.tsx",
        lineNumber: 516,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c6 = InfrastructureSection;
const PerformanceSection = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].memo(_c7 = (param)=>{
    let { performance } = param;
    var _performance_responseTime, _performance_responseTime1, _performance_responseTime2, _performance_responseTime3, _performance_responseTime4, _performance_errorRate_percentage, _performance_errorRate, _performance_errorRate1, _performance_errorRate2, _performance_errorRate3;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-lg font-semibold text-gray-900 mb-4",
                children: "Performance"
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 545,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-4 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$dashboard$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                        title: "Avg Response Time",
                        value: "".concat((performance === null || performance === void 0 ? void 0 : (_performance_responseTime = performance.responseTime) === null || _performance_responseTime === void 0 ? void 0 : _performance_responseTime.average) || 0, "ms"),
                        subtitle: "P50",
                        status: ((performance === null || performance === void 0 ? void 0 : (_performance_responseTime1 = performance.responseTime) === null || _performance_responseTime1 === void 0 ? void 0 : _performance_responseTime1.average) || 0) > 500 ? 'critical' : ((performance === null || performance === void 0 ? void 0 : (_performance_responseTime2 = performance.responseTime) === null || _performance_responseTime2 === void 0 ? void 0 : _performance_responseTime2.average) || 0) > 200 ? 'warning' : 'healthy'
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 547,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$dashboard$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                        title: "P95 Response Time",
                        value: "".concat((performance === null || performance === void 0 ? void 0 : (_performance_responseTime3 = performance.responseTime) === null || _performance_responseTime3 === void 0 ? void 0 : _performance_responseTime3.p95) || 0, "ms"),
                        subtitle: "95th percentile",
                        status: "neutral"
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 560,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$dashboard$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                        title: "P99 Response Time",
                        value: "".concat((performance === null || performance === void 0 ? void 0 : (_performance_responseTime4 = performance.responseTime) === null || _performance_responseTime4 === void 0 ? void 0 : _performance_responseTime4.p99) || 0, "ms"),
                        subtitle: "99th percentile",
                        status: "neutral"
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 567,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$widgets$2f$dashboard$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MetricCard"], {
                        title: "Error Rate",
                        value: "".concat((performance === null || performance === void 0 ? void 0 : (_performance_errorRate = performance.errorRate) === null || _performance_errorRate === void 0 ? void 0 : (_performance_errorRate_percentage = _performance_errorRate.percentage) === null || _performance_errorRate_percentage === void 0 ? void 0 : _performance_errorRate_percentage.toFixed(2)) || 0, "%"),
                        subtitle: "".concat((performance === null || performance === void 0 ? void 0 : (_performance_errorRate1 = performance.errorRate) === null || _performance_errorRate1 === void 0 ? void 0 : _performance_errorRate1.count) || 0, " errors"),
                        status: ((performance === null || performance === void 0 ? void 0 : (_performance_errorRate2 = performance.errorRate) === null || _performance_errorRate2 === void 0 ? void 0 : _performance_errorRate2.percentage) || 0) > 5 ? 'critical' : ((performance === null || performance === void 0 ? void 0 : (_performance_errorRate3 = performance.errorRate) === null || _performance_errorRate3 === void 0 ? void 0 : _performance_errorRate3.percentage) || 0) > 1 ? 'warning' : 'healthy'
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 574,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 546,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/dashboard/page.tsx",
        lineNumber: 544,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c8 = PerformanceSection;
SystemHealthSection.displayName = 'SystemHealthSection';
BusinessMetricsSection.displayName = 'BusinessMetricsSection';
InfrastructureSection.displayName = 'InfrastructureSection';
PerformanceSection.displayName = 'PerformanceSection';
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8;
__turbopack_context__.k.register(_c, "DashboardPage");
__turbopack_context__.k.register(_c1, "SystemHealthSection$React.memo");
__turbopack_context__.k.register(_c2, "SystemHealthSection");
__turbopack_context__.k.register(_c3, "BusinessMetricsSection$React.memo");
__turbopack_context__.k.register(_c4, "BusinessMetricsSection");
__turbopack_context__.k.register(_c5, "InfrastructureSection$React.memo");
__turbopack_context__.k.register(_c6, "InfrastructureSection");
__turbopack_context__.k.register(_c7, "PerformanceSection$React.memo");
__turbopack_context__.k.register(_c8, "PerformanceSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_3e63c37b._.js.map