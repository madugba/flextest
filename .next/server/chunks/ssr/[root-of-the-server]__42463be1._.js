module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

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
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[project]/src/shared/config/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Application configuration
 * Automatically detects local IP in development for cross-device access
 */ __turbopack_context__.s([
    "config",
    ()=>config
]);
const config = {
    apiBaseUrl: ("TURBOPACK compile-time value", "http://localhost:3000/v1/api") || 'http://localhost:3000/v1/api',
    isDevelopment: ("TURBOPACK compile-time value", "development") === 'development',
    isProduction: ("TURBOPACK compile-time value", "development") === 'production',
    importApiBaseUrl: process.env.NEXT_PUBLIC_IMPORT_API_URL || 'https://fastapi-5gql.onrender.com'
};
}),
"[project]/src/shared/api/client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ApiClient",
    ()=>ApiClient,
    "ApiError",
    ()=>ApiError,
    "apiClient",
    ()=>apiClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/config/index.ts [app-ssr] (ecmascript)");
;
;
class ApiError extends Error {
    message;
    code;
    statusCode;
    details;
    constructor(message, code, statusCode, details){
        super(message), this.message = message, this.code = code, this.statusCode = statusCode, this.details = details;
        this.name = 'ApiError';
    }
}
class ApiClient {
    instance;
    constructor(baseUrl){
        this.instance = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].create({
            baseURL: baseUrl,
            timeout: 20000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        this.instance.interceptors.request.use((config)=>{
            const url = config.url || '';
            const requiresAuth = !/\/auth\/logout(\b|$)/.test(url);
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            return config;
        }, (error)=>{
            return Promise.reject(error);
        });
        this.instance.interceptors.response.use((response)=>response, (error)=>{
            if (error.response) {
                const apiResponse = error.response.data;
                throw new ApiError(apiResponse.error?.message || 'An error occurred', apiResponse.error?.code, error.response.status, apiResponse.error?.details);
            } else if (error.request) {
                throw new ApiError('Network error: Unable to reach server', 'NETWORK_ERROR');
            } else {
                throw new ApiError(error.message, 'UNKNOWN_ERROR');
            }
        });
    }
    async request(config) {
        const response = await this.instance.request(config);
        return response.data;
    }
    async get(endpoint, config) {
        return this.request({
            ...config,
            method: 'GET',
            url: endpoint
        });
    }
    async post(endpoint, data, config) {
        return this.request({
            ...config,
            method: 'POST',
            url: endpoint,
            data
        });
    }
    async put(endpoint, data, config) {
        return this.request({
            ...config,
            method: 'PUT',
            url: endpoint,
            data
        });
    }
    async patch(endpoint, data, config) {
        return this.request({
            ...config,
            method: 'PATCH',
            url: endpoint,
            data
        });
    }
    async delete(endpoint, config) {
        return this.request({
            ...config,
            method: 'DELETE',
            url: endpoint
        });
    }
}
const apiClient = new ApiClient(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["config"].apiBaseUrl);
}),
"[project]/src/shared/api/authApi.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAuthToken",
    ()=>getAuthToken,
    "getCurrentUser",
    ()=>getCurrentUser,
    "isAuthenticated",
    ()=>isAuthenticated,
    "login",
    ()=>login,
    "logout",
    ()=>logout,
    "removeAuthToken",
    ()=>removeAuthToken,
    "setAuthToken",
    ()=>setAuthToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/api/client.ts [app-ssr] (ecmascript)");
;
async function login(credentials) {
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post('/auth/login', credentials);
        if (!response.success || !response.data) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ApiError"](response.error?.message || 'Login failed', response.error?.code || 'LOGIN_FAILED', undefined, response.error?.details);
        }
        return {
            success: response.success,
            message: 'Login successful',
            data: response.data
        };
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ApiError"]) {
            throw error;
        }
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ApiError"](error instanceof Error ? error.message : 'Unknown error occurred', 'UNKNOWN_ERROR');
    }
}
async function logout() {
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post('/auth/logout', {});
        if (!response.success) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ApiError"](response.error?.message || 'Logout failed', response.error?.code || 'LOGOUT_FAILED');
        }
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ApiError"]) {
            throw error;
        }
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ApiError"](error instanceof Error ? error.message : 'Unknown error occurred', 'UNKNOWN_ERROR');
    }
}
async function getCurrentUser() {
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get('/auth/me');
        if (!response.success || !response.data) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ApiError"](response.error?.message || 'Failed to fetch user profile', response.error?.code || 'FETCH_FAILED', undefined, response.error?.details);
        }
        return response.data;
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ApiError"]) {
            throw error;
        }
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ApiError"](error instanceof Error ? error.message : 'Unknown error occurred', 'UNKNOWN_ERROR');
    }
}
function isAuthenticated() {
    if ("TURBOPACK compile-time truthy", 1) return false;
    //TURBOPACK unreachable
    ;
    const token = undefined;
}
function setAuthToken(token) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function getAuthToken() {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
function removeAuthToken() {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
}),
"[project]/src/shared/contexts/AuthContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/api/authApi.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/api/client.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const initAuth = async ()=>{
            const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuthToken"])();
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const userData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUser"])();
                setUser(userData);
            } catch  {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["removeAuthToken"])();
                setUser(null);
            } finally{
                setLoading(false);
            }
        };
        initAuth();
    }, []);
    const login = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (credentials)=>{
        try {
            setLoading(true);
            setError(null);
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["login"])(credentials);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setAuthToken"])(response.data.token.accessToken);
            setUser(response.data.user);
            router.push('/dashboard');
        } catch (err) {
            const errorMessage = err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ApiError"] ? err.message : 'Login failed. Please try again.';
            setError(errorMessage);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["removeAuthToken"])();
            setUser(null);
            throw err;
        } finally{
            setLoading(false);
        }
    }, [
        router
    ]);
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            setLoading(true);
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logout"])();
            } catch  {}
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["removeAuthToken"])();
            setUser(null);
            setError(null);
            router.push('/login');
        } finally{
            setLoading(false);
        }
    }, [
        router
    ]);
    const refreshUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            const userData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUser"])();
            setUser(userData);
        } catch  {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["removeAuthToken"])();
            setUser(null);
            router.push('/login');
        }
    }, [
        router
    ]);
    const updateUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((userData)=>{
        setUser((prevUser)=>{
            if (!prevUser) return null;
            return {
                ...prevUser,
                ...userData
            };
        });
    }, []);
    const clearError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setError(null);
    }, []);
    const value = {
        user,
        loading,
        error,
        login,
        logout,
        refreshUser,
        updateUser,
        clearError,
        isAuthenticated: !!user
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/shared/contexts/AuthContext.tsx",
        lineNumber: 139,
        columnNumber: 10
    }, this);
}
function useAuth() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[project]/src/shared/config/socket.config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SOCKET_CONFIG",
    ()=>SOCKET_CONFIG
]);
const SOCKET_CONFIG = {
    url: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000',
    options: {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3_000,
        reconnectionDelayMax: 10_000,
        timeout: 10_000,
        transports: [
            'websocket',
            'polling'
        ],
        autoConnect: false
    }
};
}),
"[project]/src/shared/lib/socket/socket-client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Socket.IO Client Singleton
 * Manages WebSocket connection to backend server
 */ __turbopack_context__.s([
    "getSocketClient",
    ()=>getSocketClient,
    "socketClient",
    ()=>socketClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2d$debug$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/socket.io-client/build/esm-debug/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$socket$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/config/socket.config.ts [app-ssr] (ecmascript)");
;
;
class SocketClient {
    socket = null;
    reconnectAttempts = 0;
    MAX_RECONNECT_ATTEMPTS = 5;
    statusCallbacks = new Set();
    /**
   * Initialize socket connection
   */ connect() {
        if (this.socket?.connected) {
            console.log('[Socket] Already connected');
            return this.socket;
        }
        console.log('[Socket] Connecting to', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$socket$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOCKET_CONFIG"].url);
        this.socket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2d$debug$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["io"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$socket$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOCKET_CONFIG"].url, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$socket$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOCKET_CONFIG"].options);
        this.setupEventListeners();
        this.socket.connect();
        return this.socket;
    }
    /**
   * Disconnect socket
   */ disconnect() {
        if (!this.socket) return;
        console.log('[Socket] Disconnecting...');
        this.socket.disconnect();
        this.socket = null;
        this.reconnectAttempts = 0;
    }
    /**
   * Get socket instance
   */ getSocket() {
        return this.socket;
    }
    /**
   * Check if connected
   */ isConnected() {
        return this.socket?.connected ?? false;
    }
    /**
   * Subscribe to connection status changes
   */ onStatusChange(callback) {
        this.statusCallbacks.add(callback);
        return ()=>{
            this.statusCallbacks.delete(callback);
        };
    }
    /**
   * Notify all status subscribers
   */ notifyStatusChange(status, error) {
        const state = {
            status,
            connected: status === 'connected',
            reconnectAttempts: this.reconnectAttempts,
            error
        };
        this.statusCallbacks.forEach((callback)=>{
            try {
                callback(state);
            } catch (err) {
                console.error('[Socket] Status callback error:', err);
            }
        });
    }
    /**
   * Setup socket event listeners
   */ setupEventListeners() {
        if (!this.socket) return;
        this.socket.on('connect', ()=>{
            console.log('[Socket] Connected');
            this.reconnectAttempts = 0;
            this.notifyStatusChange('connected');
        });
        this.socket.on('disconnect', (reason)=>{
            console.log('[Socket] Disconnected:', reason);
            this.notifyStatusChange('disconnected');
            if (reason === 'io server disconnect') {
                this.socket?.connect();
            }
        });
        this.socket.on('connect_error', (error)=>{
            console.error('[Socket] Connection error:', error);
            this.notifyStatusChange('error', error);
        });
        this.socket.io.on('reconnect_attempt', (attemptNumber)=>{
            this.reconnectAttempts = attemptNumber;
            console.log(`[Socket] Reconnection attempt ${attemptNumber}`);
            this.notifyStatusChange('reconnecting');
        });
        this.socket.io.on('reconnect_failed', ()=>{
            console.error('[Socket] Reconnection failed after max attempts');
            this.notifyStatusChange('error', new Error('Reconnection failed'));
        });
        this.socket.io.on('reconnect', (attemptNumber)=>{
            console.log(`[Socket] Reconnected after ${attemptNumber} attempts`);
            this.reconnectAttempts = 0;
            this.notifyStatusChange('connected');
        });
    }
    /**
   * Emit event to server
   */ emit(event, ...args) {
        if (!this.socket) {
            console.warn('[Socket] Cannot emit: not connected');
            return;
        }
        console.log(`[Socket] 📤 Emitting event: ${String(event)}`, {
            connected: this.socket.connected,
            args: args.length > 0 ? args : 'no args'
        });
        this.socket.emit(event, ...args);
    }
    /**
   * Listen to event from server
   */ on(event, listener) {
        if (!this.socket) {
            console.warn('[Socket] Cannot listen: not connected');
            return ()=>{};
        }
        this.socket.on(event, listener);
        return ()=>{
            this.socket?.off(event, listener);
        };
    }
    /**
   * Remove event listener
   */ off(event, listener) {
        if (!this.socket) return;
        if (listener) {
            this.socket.off(event, listener);
        } else {
            this.socket.off(event);
        }
    }
}
let socketClientInstance = null;
function getSocketClient() {
    if (!socketClientInstance) {
        socketClientInstance = new SocketClient();
    }
    return socketClientInstance;
}
const socketClient = getSocketClient();
}),
"[project]/src/shared/lib/socket/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Socket Library Exports
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$lib$2f$socket$2f$socket$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/lib/socket/socket-client.ts [app-ssr] (ecmascript)");
;
}),
"[project]/src/shared/providers/SocketProvider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SocketProvider",
    ()=>SocketProvider,
    "useSocketContext",
    ()=>useSocketContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * Socket Provider
 * Provides Socket.IO connection context to the application
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$lib$2f$socket$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/shared/lib/socket/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$lib$2f$socket$2f$socket$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/lib/socket/socket-client.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
const SocketContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function SocketProvider({ children, autoConnect = true }) {
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        status: 'disconnected',
        connected: false,
        reconnectAttempts: 0
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const unsubscribe = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$lib$2f$socket$2f$socket$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["socketClient"].onStatusChange((newState)=>{
            setState(newState);
        });
        if (autoConnect) {
            console.log('[SocketProvider] Auto-connecting...');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$lib$2f$socket$2f$socket$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["socketClient"].connect();
        }
        return ()=>{
            unsubscribe();
            if (autoConnect) {
                console.log('[SocketProvider] Disconnecting...');
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$lib$2f$socket$2f$socket$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["socketClient"].disconnect();
            }
        };
    }, [
        autoConnect
    ]);
    const value = {
        socket: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$lib$2f$socket$2f$socket$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["socketClient"],
        state,
        isConnected: state.connected
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SocketContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/shared/providers/SocketProvider.tsx",
        lineNumber: 57,
        columnNumber: 10
    }, this);
}
function useSocketContext() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(SocketContext);
    if (!context) {
        throw new Error('useSocketContext must be used within a SocketProvider');
    }
    return context;
}
}),
"[project]/src/shared/ui/sonner.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Toaster",
    ()=>Toaster
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-themes/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
"use client";
;
;
;
const Toaster = ({ ...props })=>{
    const { theme = "system" } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTheme"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toaster"], {
        theme: theme,
        className: "toaster group",
        style: {
            "--normal-bg": "var(--popover)",
            "--normal-text": "var(--popover-foreground)",
            "--normal-border": "var(--border)"
        },
        ...props
    }, void 0, false, {
        fileName: "[project]/src/shared/ui/sonner.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
;
}),
"[project]/src/app/providers.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/contexts/AuthContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$providers$2f$SocketProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/providers/SocketProvider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$ui$2f$sonner$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/ui/sonner.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
const createQueryClient = ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClient"]({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
                gcTime: 5 * 60 * 1000,
                refetchOnWindowFocus: false,
                retry: 1
            }
        }
    });
function Providers({ children }) {
    const [queryClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(createQueryClient);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
        client: queryClient,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AuthProvider"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$providers$2f$SocketProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SocketProvider"], {
                autoConnect: true,
                children: [
                    children,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$ui$2f$sonner$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toaster"], {}, void 0, false, {
                        fileName: "[project]/src/app/providers.tsx",
                        lineNumber: 29,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/providers.tsx",
                lineNumber: 27,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/providers.tsx",
            lineNumber: 26,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/providers.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__42463be1._.js.map