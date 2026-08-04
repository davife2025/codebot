module.exports = [
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
"[project]/lib/agentrouter.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "agentRouterHeaders",
    ()=>agentRouterHeaders,
    "getAgentRouterConfig",
    ()=>getAgentRouterConfig,
    "normalizeModelList",
    ()=>normalizeModelList
]);
const DEFAULT_BASE_URL = "https://agentrouter.org/v1";
function getAgentRouterConfig() {
    const apiKey = process.env.AGENTROUTER_API_KEY;
    if (!apiKey) {
        throw new Error("AGENTROUTER_API_KEY is not set. Add it to your .env.local file.");
    }
    const baseUrl = process.env.AGENTROUTER_BASE_URL || DEFAULT_BASE_URL;
    return {
        apiKey,
        baseUrl
    };
}
function agentRouterHeaders(apiKey) {
    return {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
    };
}
function normalizeModelList(raw) {
    if (typeof raw !== "object" || raw === null || !("data" in raw) || !Array.isArray(raw.data)) {
        return [];
    }
    const data = raw.data;
    return data.filter((entry)=>typeof entry?.id === "string").map((entry)=>({
            id: entry.id,
            label: entry.id
        })).sort((a, b)=>a.label.localeCompare(b.label));
}
}),
"[project]/app/api/models/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agentrouter$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/agentrouter.ts [app-route] (ecmascript)");
;
async function GET() {
    let config;
    try {
        config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agentrouter$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAgentRouterConfig"])();
    } catch (err) {
        // Missing/invalid config, not a server fault — 401, not 500.
        return Response.json({
            error: err instanceof Error ? err.message : "Missing configuration"
        }, {
            status: 401
        });
    }
    const upstream = await fetch(`${config.baseUrl}/models`, {
        headers: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agentrouter$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["agentRouterHeaders"])(config.apiKey),
        // Model list changes rarely; avoid hammering AgentRouter on every load.
        next: {
            revalidate: 300
        }
    });
    if (!upstream.ok) {
        const text = await upstream.text().catch(()=>"");
        return Response.json({
            error: `AgentRouter returned ${upstream.status}: ${text}`
        }, {
            status: upstream.status
        });
    }
    const raw = await upstream.json();
    const models = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$agentrouter$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeModelList"])(raw);
    return Response.json({
        models
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0j5q2x7._.js.map