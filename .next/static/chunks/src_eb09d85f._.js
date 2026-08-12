(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/shared/config/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Application configuration
 * Automatically detects local IP in development for cross-device access
 */ __turbopack_context__.s([
    "config",
    ()=>config
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const config = {
    apiBaseUrl: ("TURBOPACK compile-time value", "http://localhost:3000/v1/api") || 'http://localhost:3000/v1/api',
    isDevelopment: ("TURBOPACK compile-time value", "development") === 'development',
    isProduction: ("TURBOPACK compile-time value", "development") === 'production',
    importApiBaseUrl: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_IMPORT_API_URL || 'https://fastapi-5gql.onrender.com'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/shared/api/client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ApiClient",
    ()=>ApiClient,
    "ApiError",
    ()=>ApiError,
    "apiClient",
    ()=>apiClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/config/index.ts [app-client] (ecmascript)");
;
;
;
class ApiError extends Error {
    constructor(message, code, statusCode, details){
        super(message), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "message", void 0), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "code", void 0), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "statusCode", void 0), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "details", void 0), this.message = message, this.code = code, this.statusCode = statusCode, this.details = details;
        this.name = 'ApiError';
    }
}
class ApiClient {
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
    constructor(baseUrl){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "instance", void 0);
        this.instance = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
            baseURL: baseUrl,
            timeout: 20000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        this.instance.interceptors.request.use((config)=>{
            const url = config.url || '';
            const requiresAuth = !/\/auth\/logout(\b|$)/.test(url);
            if (requiresAuth && "object" !== 'undefined') {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    config.headers.Authorization = "Bearer ".concat(token);
                }
            }
            return config;
        }, (error)=>{
            return Promise.reject(error);
        });
        this.instance.interceptors.response.use((response)=>response, (error)=>{
            if (error.response) {
                var _apiResponse_error, _apiResponse_error1, _apiResponse_error2;
                const apiResponse = error.response.data;
                throw new ApiError(((_apiResponse_error = apiResponse.error) === null || _apiResponse_error === void 0 ? void 0 : _apiResponse_error.message) || 'An error occurred', (_apiResponse_error1 = apiResponse.error) === null || _apiResponse_error1 === void 0 ? void 0 : _apiResponse_error1.code, error.response.status, (_apiResponse_error2 = apiResponse.error) === null || _apiResponse_error2 === void 0 ? void 0 : _apiResponse_error2.details);
            } else if (error.request) {
                throw new ApiError('Network error: Unable to reach server', 'NETWORK_ERROR');
            } else {
                throw new ApiError(error.message, 'UNKNOWN_ERROR');
            }
        });
    }
}
const apiClient = new ApiClient(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["config"].apiBaseUrl);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/shared/api/authApi.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/api/client.ts [app-client] (ecmascript)");
;
async function login(credentials) {
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post('/auth/login', credentials);
        if (!response.success || !response.data) {
            var _response_error, _response_error1, _response_error2;
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"](((_response_error = response.error) === null || _response_error === void 0 ? void 0 : _response_error.message) || 'Login failed', ((_response_error1 = response.error) === null || _response_error1 === void 0 ? void 0 : _response_error1.code) || 'LOGIN_FAILED', undefined, (_response_error2 = response.error) === null || _response_error2 === void 0 ? void 0 : _response_error2.details);
        }
        return {
            success: response.success,
            message: 'Login successful',
            data: response.data
        };
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"]) {
            throw error;
        }
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"](error instanceof Error ? error.message : 'Unknown error occurred', 'UNKNOWN_ERROR');
    }
}
async function logout() {
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post('/auth/logout', {});
        if (!response.success) {
            var _response_error, _response_error1;
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"](((_response_error = response.error) === null || _response_error === void 0 ? void 0 : _response_error.message) || 'Logout failed', ((_response_error1 = response.error) === null || _response_error1 === void 0 ? void 0 : _response_error1.code) || 'LOGOUT_FAILED');
        }
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"]) {
            throw error;
        }
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"](error instanceof Error ? error.message : 'Unknown error occurred', 'UNKNOWN_ERROR');
    }
}
async function getCurrentUser() {
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get('/auth/me');
        if (!response.success || !response.data) {
            var _response_error, _response_error1, _response_error2;
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"](((_response_error = response.error) === null || _response_error === void 0 ? void 0 : _response_error.message) || 'Failed to fetch user profile', ((_response_error1 = response.error) === null || _response_error1 === void 0 ? void 0 : _response_error1.code) || 'FETCH_FAILED', undefined, (_response_error2 = response.error) === null || _response_error2 === void 0 ? void 0 : _response_error2.details);
        }
        return response.data;
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"]) {
            throw error;
        }
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"](error instanceof Error ? error.message : 'Unknown error occurred', 'UNKNOWN_ERROR');
    }
}
function isAuthenticated() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const token = localStorage.getItem('accessToken');
    return !!token;
}
function setAuthToken(token) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    localStorage.setItem('accessToken', token);
}
function getAuthToken() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return localStorage.getItem('accessToken');
}
function removeAuthToken() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    localStorage.removeItem('accessToken');
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/shared/contexts/AuthContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$authApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/api/authApi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/api/client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider(param) {
    let { children } = param;
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const initAuth = {
                "AuthProvider.useEffect.initAuth": async ()=>{
                    const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$authApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuthToken"])();
                    if (!token) {
                        setLoading(false);
                        return;
                    }
                    try {
                        const userData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$authApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUser"])();
                        setUser(userData);
                    } catch (e) {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$authApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeAuthToken"])();
                        setUser(null);
                    } finally{
                        setLoading(false);
                    }
                }
            }["AuthProvider.useEffect.initAuth"];
            initAuth();
        }
    }["AuthProvider.useEffect"], []);
    const login = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[login]": async (credentials)=>{
            try {
                setLoading(true);
                setError(null);
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$authApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["login"])(credentials);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$authApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setAuthToken"])(response.data.token.accessToken);
                setUser(response.data.user);
                router.push('/dashboard');
            } catch (err) {
                const errorMessage = err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"] ? err.message : 'Login failed. Please try again.';
                setError(errorMessage);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$authApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeAuthToken"])();
                setUser(null);
                throw err;
            } finally{
                setLoading(false);
            }
        }
    }["AuthProvider.useCallback[login]"], [
        router
    ]);
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[logout]": async ()=>{
            try {
                setLoading(true);
                try {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$authApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logout"])();
                } catch (e) {}
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$authApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeAuthToken"])();
                setUser(null);
                setError(null);
                router.push('/login');
            } finally{
                setLoading(false);
            }
        }
    }["AuthProvider.useCallback[logout]"], [
        router
    ]);
    const refreshUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[refreshUser]": async ()=>{
            try {
                const userData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$authApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUser"])();
                setUser(userData);
            } catch (e) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$api$2f$authApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeAuthToken"])();
                setUser(null);
                router.push('/login');
            }
        }
    }["AuthProvider.useCallback[refreshUser]"], [
        router
    ]);
    const updateUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[updateUser]": (userData)=>{
            setUser({
                "AuthProvider.useCallback[updateUser]": (prevUser)=>{
                    if (!prevUser) return null;
                    return {
                        ...prevUser,
                        ...userData
                    };
                }
            }["AuthProvider.useCallback[updateUser]"]);
        }
    }["AuthProvider.useCallback[updateUser]"], []);
    const clearError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[clearError]": ()=>{
            setError(null);
        }
    }["AuthProvider.useCallback[clearError]"], []);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/shared/contexts/AuthContext.tsx",
        lineNumber: 139,
        columnNumber: 10
    }, this);
}
_s(AuthProvider, "lElwiDUtG4VbSTN9O4cRmpyQbKA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/shared/config/socket.config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SOCKET_CONFIG",
    ()=>SOCKET_CONFIG
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const SOCKET_CONFIG = {
    url: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000',
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/shared/lib/socket/socket-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/socket.io-client/build/esm/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$socket$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/config/socket.config.ts [app-client] (ecmascript)");
;
;
;
class SocketClient {
    /**
   * Initialize socket connection
   */ connect() {
        var _this_socket;
        if ((_this_socket = this.socket) === null || _this_socket === void 0 ? void 0 : _this_socket.connected) {
            console.log('[Socket] Already connected');
            return this.socket;
        }
        console.log('[Socket] Connecting to', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$socket$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOCKET_CONFIG"].url);
        this.socket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["io"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$socket$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOCKET_CONFIG"].url, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$config$2f$socket$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOCKET_CONFIG"].options);
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
        var _this_socket;
        var _this_socket_connected;
        return (_this_socket_connected = (_this_socket = this.socket) === null || _this_socket === void 0 ? void 0 : _this_socket.connected) !== null && _this_socket_connected !== void 0 ? _this_socket_connected : false;
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
                var _this_socket;
                (_this_socket = this.socket) === null || _this_socket === void 0 ? void 0 : _this_socket.connect();
            }
        });
        this.socket.on('connect_error', (error)=>{
            console.error('[Socket] Connection error:', error);
            this.notifyStatusChange('error', error);
        });
        this.socket.io.on('reconnect_attempt', (attemptNumber)=>{
            this.reconnectAttempts = attemptNumber;
            console.log("[Socket] Reconnection attempt ".concat(attemptNumber));
            this.notifyStatusChange('reconnecting');
        });
        this.socket.io.on('reconnect_failed', ()=>{
            console.error('[Socket] Reconnection failed after max attempts');
            this.notifyStatusChange('error', new Error('Reconnection failed'));
        });
        this.socket.io.on('reconnect', (attemptNumber)=>{
            console.log("[Socket] Reconnected after ".concat(attemptNumber, " attempts"));
            this.reconnectAttempts = 0;
            this.notifyStatusChange('connected');
        });
    }
    /**
   * Emit event to server
   */ emit(event) {
        for(var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            args[_key - 1] = arguments[_key];
        }
        if (!this.socket) {
            console.warn('[Socket] Cannot emit: not connected');
            return;
        }
        console.log("[Socket] 📤 Emitting event: ".concat(String(event)), {
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
            var _this_socket;
            (_this_socket = this.socket) === null || _this_socket === void 0 ? void 0 : _this_socket.off(event, listener);
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
    constructor(){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "socket", null);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "reconnectAttempts", 0);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "MAX_RECONNECT_ATTEMPTS", 5);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "statusCallbacks", new Set());
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/shared/lib/socket/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Socket Library Exports
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$lib$2f$socket$2f$socket$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/lib/socket/socket-client.ts [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/shared/providers/SocketProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SocketProvider",
    ()=>SocketProvider,
    "useSocketContext",
    ()=>useSocketContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * Socket Provider
 * Provides Socket.IO connection context to the application
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$lib$2f$socket$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/shared/lib/socket/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$lib$2f$socket$2f$socket$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/lib/socket/socket-client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
const SocketContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function SocketProvider(param) {
    let { children, autoConnect = true } = param;
    _s();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        status: 'disconnected',
        connected: false,
        reconnectAttempts: 0
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SocketProvider.useEffect": ()=>{
            const unsubscribe = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$lib$2f$socket$2f$socket$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["socketClient"].onStatusChange({
                "SocketProvider.useEffect.unsubscribe": (newState)=>{
                    setState(newState);
                }
            }["SocketProvider.useEffect.unsubscribe"]);
            if (autoConnect) {
                console.log('[SocketProvider] Auto-connecting...');
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$lib$2f$socket$2f$socket$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["socketClient"].connect();
            }
            return ({
                "SocketProvider.useEffect": ()=>{
                    unsubscribe();
                    if (autoConnect) {
                        console.log('[SocketProvider] Disconnecting...');
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$lib$2f$socket$2f$socket$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["socketClient"].disconnect();
                    }
                }
            })["SocketProvider.useEffect"];
        }
    }["SocketProvider.useEffect"], [
        autoConnect
    ]);
    const value = {
        socket: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$lib$2f$socket$2f$socket$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["socketClient"],
        state,
        isConnected: state.connected
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SocketContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/shared/providers/SocketProvider.tsx",
        lineNumber: 57,
        columnNumber: 10
    }, this);
}
_s(SocketProvider, "jWksO5y4a9cw+pjLy5fzvENReYg=");
_c = SocketProvider;
function useSocketContext() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(SocketContext);
    if (!context) {
        throw new Error('useSocketContext must be used within a SocketProvider');
    }
    return context;
}
_s1(useSocketContext, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "SocketProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/shared/ui/sonner.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Toaster",
    ()=>Toaster
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const Toaster = (param)=>{
    let { ...props } = param;
    _s();
    const { theme = "system" } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toaster"], {
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
_s(Toaster, "EriOrahfenYKDCErPq+L6926Dw4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = Toaster;
;
var _c;
__turbopack_context__.k.register(_c, "Toaster");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$providers$2f$SocketProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/providers/SocketProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$ui$2f$sonner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/shared/ui/sonner.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const createQueryClient = ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClient"]({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
                gcTime: 5 * 60 * 1000,
                refetchOnWindowFocus: false,
                retry: 1
            }
        }
    });
function Providers(param) {
    let { children } = param;
    _s();
    const [queryClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(createQueryClient);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
        client: queryClient,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthProvider"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$providers$2f$SocketProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SocketProvider"], {
                autoConnect: true,
                children: [
                    children,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$shared$2f$ui$2f$sonner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toaster"], {}, void 0, false, {
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
_s(Providers, "8wwU/q8EVh6cr0R0IXF0hGsLMag=");
_c = Providers;
var _c;
__turbopack_context__.k.register(_c, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_eb09d85f._.js.map