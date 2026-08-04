(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/storage.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "loadActiveId",
    ()=>loadActiveId,
    "loadConversations",
    ()=>loadConversations,
    "saveActiveId",
    ()=>saveActiveId,
    "saveConversations",
    ()=>saveConversations
]);
const CONVERSATIONS_KEY = "agent-chat:conversations:v1";
const ACTIVE_ID_KEY = "agent-chat:active-id:v1";
function loadConversations() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const raw = window.localStorage.getItem(CONVERSATIONS_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return null;
        // A message left "pending" means the tab closed mid-stream. There's no
        // connection to resume it, so finalize it as-is rather than showing a
        // permanent typing indicator.
        return parsed.map((c)=>({
                ...c,
                messages: Array.isArray(c.messages) ? c.messages.map((m)=>({
                        ...m,
                        pending: false
                    })) : []
            }));
    } catch  {
        return null;
    }
}
function saveConversations(conversations) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        window.localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    } catch  {
    // Storage full or unavailable (e.g. private browsing) — fail silently,
    // the app keeps working in memory for the rest of the session.
    }
}
function loadActiveId() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return window.localStorage.getItem(ACTIVE_ID_KEY);
}
function saveActiveId(id) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        if (id) window.localStorage.setItem(ACTIVE_ID_KEY, id);
        else window.localStorage.removeItem(ACTIVE_ID_KEY);
    } catch  {
    // Ignore — same reasoning as saveConversations.
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/supabaseClient.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSupabaseClient",
    ()=>getSupabaseClient,
    "isCloudSyncEnabled",
    ()=>isCloudSyncEnabled
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-client] (ecmascript) <locals>");
;
let client;
function isCloudSyncEnabled() {
    return Boolean(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_SUPABASE_URL && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
function getSupabaseClient() {
    if (client !== undefined) return client;
    const url = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) {
        client = null;
        return client;
    }
    client = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(url, anonKey, {
        auth: {
            persistSession: true,
            autoRefreshToken: true
        }
    });
    return client;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/cloudSync.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deleteRemoteConversation",
    ()=>deleteRemoteConversation,
    "ensureAnonymousSession",
    ()=>ensureAnonymousSession,
    "fetchRemoteConversations",
    ()=>fetchRemoteConversations,
    "upsertRemoteConversation",
    ()=>upsertRemoteConversation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-client] (ecmascript)");
;
const TABLE = "conversations";
async function ensureAnonymousSession() {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSupabaseClient"])();
    if (!supabase) return null;
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) return session.user.id;
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) {
        console.error("Supabase anonymous sign-in failed:", error.message);
        return null;
    }
    return data.user?.id ?? null;
}
async function fetchRemoteConversations(userId) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSupabaseClient"])();
    if (!supabase) return [];
    const { data, error } = await supabase.from(TABLE).select("data").eq("user_id", userId).order("updated_at", {
        ascending: false
    });
    if (error) {
        console.error("Failed to fetch remote conversations:", error.message);
        return [];
    }
    return (data || []).map((row)=>row.data);
}
async function upsertRemoteConversation(userId, conversation) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSupabaseClient"])();
    if (!supabase) return;
    const { error } = await supabase.from(TABLE).upsert({
        id: conversation.id,
        user_id: userId,
        data: conversation,
        updated_at: new Date().toISOString()
    });
    if (error) console.error("Failed to sync conversation:", error.message);
}
async function deleteRemoteConversation(userId, id) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSupabaseClient"])();
    if (!supabase) return;
    const { error } = await supabase.from(TABLE).delete().eq("id", id).eq("user_id", userId);
    if (error) console.error("Failed to delete remote conversation:", error.message);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/useChat.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useChat",
    ()=>useChat
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/lib/messages'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/storage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cloudSync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/cloudSync.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
// AgentRouter model IDs are dated/versioned (e.g. "claude-sonnet-4-5-20250929"),
// never confirmed against a live catalog from this environment. Only used if
// /api/models fails outright. Override with NEXT_PUBLIC_DEFAULT_MODEL once
// you know the exact id your AgentRouter account exposes.
const FALLBACK_MODEL = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_DEFAULT_MODEL || "claude-sonnet-4-5-20250929";
// A hung request shouldn't lock the UI forever.
const REQUEST_TIMEOUT_MS = 120_000;
function makeId() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
function makeConversation(model) {
    return {
        id: makeId(),
        title: "New chat",
        model,
        compareModel: null,
        messages: [],
        createdAt: Date.now()
    };
}
function useChat() {
    _s();
    const [models, setModels] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [modelsError, setModelsError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [conversations, setConversations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "useChat.useState": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadConversations"])() ?? []
    }["useChat.useState"]);
    const [activeId, setActiveId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "useChat.useState": ()=>{
            const restored = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadConversations"])();
            if (!restored || restored.length === 0) return null;
            const storedActive = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadActiveId"])();
            return storedActive && restored.some({
                "useChat.useState": (c)=>c.id === storedActive
            }["useChat.useState"]) ? storedActive : restored[0].id;
        }
    }["useChat.useState"]);
    // Per-conversation, not global — sending in one chat must not block
    // sending in another.
    const [sendingIds, setSendingIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [sendErrors, setSendErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [cloudError, setCloudError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const initialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const syncTimers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    // assistantId -> its in-flight request's controller
    const controllers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    // conversationId -> assistantIds currently streaming into it (for stop)
    const activeStreams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    const markSending = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useChat.useCallback[markSending]": (conversationId, isSending)=>{
            setSendingIds({
                "useChat.useCallback[markSending]": (prev)=>{
                    const next = new Set(prev);
                    if (isSending) next.add(conversationId);
                    else next.delete(conversationId);
                    return next;
                }
            }["useChat.useCallback[markSending]"]);
        }
    }["useChat.useCallback[markSending]"], []);
    const setConversationError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useChat.useCallback[setConversationError]": (conversationId, message)=>{
            setSendErrors({
                "useChat.useCallback[setConversationError]": (prev)=>{
                    const next = {
                        ...prev
                    };
                    if (message) next[conversationId] = message;
                    else delete next[conversationId];
                    return next;
                }
            }["useChat.useCallback[setConversationError]"]);
        }
    }["useChat.useCallback[setConversationError]"], []);
    // Load the live model list once, then — if cloud sync is configured — sign
    // in anonymously and merge remote conversations with whatever was restored
    // from localStorage. Falls back to local-only if Supabase isn't set up or
    // the anonymous session can't be established.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useChat.useEffect": ()=>{
            if (initialized.current) return;
            initialized.current = true;
            // Snapshot the state this effect was mounted with — this closure only
            // ever runs once, so these are exactly the values from the initial
            // (possibly localStorage-restored) render.
            const localSnapshot = conversations;
            const activeIdSnapshot = activeId;
            ({
                "useChat.useEffect": async ()=>{
                    let modelList = [];
                    try {
                        const res = await fetch("/api/models");
                        const data = await res.json();
                        if (data.error) setModelsError(data.error);
                        modelList = data.models && data.models.length > 0 ? data.models : [];
                        setModels(modelList);
                    } catch (err) {
                        setModelsError(err instanceof Error ? err.message : "Failed to load models");
                    }
                    const seedDefault = {
                        "useChat.useEffect.seedDefault": ()=>{
                            const defaultModel = modelList[0]?.id || FALLBACK_MODEL;
                            const first = makeConversation(defaultModel);
                            setConversations([
                                first
                            ]);
                            setActiveId(first.id);
                        }
                    }["useChat.useEffect.seedDefault"];
                    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isCloudSyncEnabled"])()) {
                        if (localSnapshot.length === 0) seedDefault();
                        return;
                    }
                    const uid = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cloudSync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureAnonymousSession"])();
                    if (!uid) {
                        setCloudError("Couldn't start a Supabase session — check NEXT_PUBLIC_SUPABASE_* env vars and that anonymous sign-ins are enabled. Continuing with local-only storage.");
                        if (localSnapshot.length === 0) seedDefault();
                        return;
                    }
                    setUserId(uid);
                    const remote = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cloudSync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchRemoteConversations"])(uid);
                    const remoteIds = new Set(remote.map({
                        "useChat.useEffect": (c)=>c.id
                    }["useChat.useEffect"]));
                    const localOnly = localSnapshot.filter({
                        "useChat.useEffect.localOnly": (c)=>!remoteIds.has(c.id)
                    }["useChat.useEffect.localOnly"]);
                    localOnly.forEach({
                        "useChat.useEffect": (c)=>{
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cloudSync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["upsertRemoteConversation"])(uid, c);
                        }
                    }["useChat.useEffect"]);
                    const merged = [
                        ...remote,
                        ...localOnly
                    ].sort({
                        "useChat.useEffect.merged": (a, b)=>b.createdAt - a.createdAt
                    }["useChat.useEffect.merged"]);
                    if (merged.length === 0) {
                        seedDefault();
                        return;
                    }
                    setConversations(merged);
                    if (!activeIdSnapshot || !merged.some({
                        "useChat.useEffect": (c)=>c.id === activeIdSnapshot
                    }["useChat.useEffect"])) {
                        setActiveId(merged[0].id);
                    }
                }
            })["useChat.useEffect"]();
        // Intentionally mount-only: this reads `conversations`/`activeId` as a
        // one-time snapshot to merge with remote data, then never runs again.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["useChat.useEffect"], []);
    // Persist to localStorage whenever conversations or the active chat change
    // — this stays on even with cloud sync enabled, as a fast local cache and
    // an offline fallback.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useChat.useEffect": ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveConversations"])(conversations);
        }
    }["useChat.useEffect"], [
        conversations
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useChat.useEffect": ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveActiveId"])(activeId);
        }
    }["useChat.useEffect"], [
        activeId
    ]);
    // Push changes to Supabase, debounced per-conversation so a streaming
    // response doesn't fire a write on every token — only once things settle.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useChat.useEffect": ()=>{
            if (!userId) return;
            conversations.forEach({
                "useChat.useEffect": (c)=>{
                    if (syncTimers.current[c.id]) clearTimeout(syncTimers.current[c.id]);
                    syncTimers.current[c.id] = setTimeout({
                        "useChat.useEffect": ()=>{
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cloudSync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["upsertRemoteConversation"])(userId, c);
                        }
                    }["useChat.useEffect"], 1000);
                }
            }["useChat.useEffect"]);
        }
    }["useChat.useEffect"], [
        conversations,
        userId
    ]);
    // Clear any pending debounced syncs and in-flight requests on unmount.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useChat.useEffect": ()=>{
            const timers = syncTimers.current;
            const liveControllers = controllers.current;
            return ({
                "useChat.useEffect": ()=>{
                    Object.values(timers).forEach(clearTimeout);
                    Object.values(liveControllers).forEach({
                        "useChat.useEffect": (c)=>c.abort("unmount")
                    }["useChat.useEffect"]);
                }
            })["useChat.useEffect"];
        }
    }["useChat.useEffect"], []);
    const activeConversation = conversations.find((c)=>c.id === activeId) || null;
    const newConversation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useChat.useCallback[newConversation]": ()=>{
            const model = activeConversation?.model || models[0]?.id || FALLBACK_MODEL;
            const conv = makeConversation(model);
            setConversations({
                "useChat.useCallback[newConversation]": (prev)=>[
                        conv,
                        ...prev
                    ]
            }["useChat.useCallback[newConversation]"]);
            setActiveId(conv.id);
        }
    }["useChat.useCallback[newConversation]"], [
        activeConversation,
        models
    ]);
    const selectConversation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useChat.useCallback[selectConversation]": (id)=>{
            setActiveId(id);
        }
    }["useChat.useCallback[selectConversation]"], []);
    const deleteConversation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useChat.useCallback[deleteConversation]": (id)=>{
            (activeStreams.current[id] || []).forEach({
                "useChat.useCallback[deleteConversation]": (assistantId)=>{
                    controllers.current[assistantId]?.abort("deleted");
                }
            }["useChat.useCallback[deleteConversation]"]);
            setConversations({
                "useChat.useCallback[deleteConversation]": (prev)=>{
                    const next = prev.filter({
                        "useChat.useCallback[deleteConversation].next": (c)=>c.id !== id
                    }["useChat.useCallback[deleteConversation].next"]);
                    if (id === activeId) {
                        setActiveId(next[0]?.id ?? null);
                    }
                    return next;
                }
            }["useChat.useCallback[deleteConversation]"]);
            if (userId) (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cloudSync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteRemoteConversation"])(userId, id);
        }
    }["useChat.useCallback[deleteConversation]"], [
        activeId,
        userId
    ]);
    const setActiveModel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useChat.useCallback[setActiveModel]": (model)=>{
            if (!activeId) return;
            setConversations({
                "useChat.useCallback[setActiveModel]": (prev)=>prev.map({
                        "useChat.useCallback[setActiveModel]": (c)=>c.id === activeId ? {
                                ...c,
                                model
                            } : c
                    }["useChat.useCallback[setActiveModel]"])
            }["useChat.useCallback[setActiveModel]"]);
        }
    }["useChat.useCallback[setActiveModel]"], [
        activeId
    ]);
    const setCompareModel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useChat.useCallback[setCompareModel]": (model)=>{
            if (!activeId) return;
            setConversations({
                "useChat.useCallback[setCompareModel]": (prev)=>prev.map({
                        "useChat.useCallback[setCompareModel]": (c)=>c.id === activeId ? {
                                ...c,
                                compareModel: model
                            } : c
                    }["useChat.useCallback[setCompareModel]"])
            }["useChat.useCallback[setCompareModel]"]);
        }
    }["useChat.useCallback[setCompareModel]"], [
        activeId
    ]);
    const updateMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useChat.useCallback[updateMessage]": (conversationId, id, updater)=>{
            setConversations({
                "useChat.useCallback[updateMessage]": (prev)=>prev.map({
                        "useChat.useCallback[updateMessage]": (c)=>c.id !== conversationId ? c : {
                                ...c,
                                messages: c.messages.map({
                                    "useChat.useCallback[updateMessage]": (m)=>m.id === id ? updater(m) : m
                                }["useChat.useCallback[updateMessage]"])
                            }
                    }["useChat.useCallback[updateMessage]"])
            }["useChat.useCallback[updateMessage]"]);
        }
    }["useChat.useCallback[updateMessage]"], []);
    const streamOne = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useChat.useCallback[streamOne]": async (conversationId, model, history, assistantId)=>{
            const controller = new AbortController();
            controllers.current[assistantId] = controller;
            activeStreams.current[conversationId] = [
                ...activeStreams.current[conversationId] || [],
                assistantId
            ];
            const timeoutId = setTimeout({
                "useChat.useCallback[streamOne].timeoutId": ()=>controller.abort("timeout")
            }["useChat.useCallback[streamOne].timeoutId"], REQUEST_TIMEOUT_MS);
            try {
                const res = await fetch("/api/chat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model,
                        messages: buildApiHistory(history)
                    }),
                    signal: controller.signal
                });
                if (!res.ok || !res.body) {
                    const data = await res.json().catch({
                        "useChat.useCallback[streamOne]": ()=>({
                                error: "Request failed"
                            })
                    }["useChat.useCallback[streamOne]"]);
                    throw new Error(data.error || `Request failed with status ${res.status}`);
                }
                const reader = res.body.getReader();
                const decoder = new TextDecoder();
                let buffer = "";
                while(true){
                    const { done, value } = await reader.read();
                    if (done) break;
                    buffer += decoder.decode(value, {
                        stream: true
                    });
                    const lines = buffer.split("\n");
                    buffer = lines.pop() || "";
                    for (const line of lines){
                        const trimmed = line.trim();
                        if (!trimmed.startsWith("data:")) continue;
                        const payload = trimmed.slice(5).trim();
                        if (payload === "[DONE]") continue;
                        let parsed;
                        try {
                            parsed = JSON.parse(payload);
                        } catch  {
                            continue; // malformed fragment — skip, don't abort the stream
                        }
                        const obj = parsed;
                        // Unlike a malformed fragment, an explicit error from the
                        // provider must not be swallowed — surface it as a real failure.
                        if (obj?.error) {
                            const msg = typeof obj.error === "string" ? obj.error : obj.error?.message;
                            throw new Error(msg || "The model returned an error mid-response.");
                        }
                        const delta = obj?.choices?.[0]?.delta?.content;
                        if (delta) {
                            updateMessage(conversationId, assistantId, {
                                "useChat.useCallback[streamOne]": (m)=>({
                                        ...m,
                                        content: m.content + delta
                                    })
                            }["useChat.useCallback[streamOne]"]);
                        }
                    }
                }
                updateMessage(conversationId, assistantId, {
                    "useChat.useCallback[streamOne]": (m)=>({
                            ...m,
                            pending: false
                        })
                }["useChat.useCallback[streamOne]"]);
            } catch (err) {
                if (err instanceof DOMException && err.name === "AbortError") {
                    const reason = controller.signal.reason;
                    const message = reason === "timeout" ? `Timed out after ${REQUEST_TIMEOUT_MS / 1000}s.` : "Stopped.";
                    updateMessage(conversationId, assistantId, {
                        "useChat.useCallback[streamOne]": (m)=>({
                                ...m,
                                pending: false,
                                content: m.content || message
                            })
                    }["useChat.useCallback[streamOne]"]);
                    if (reason === "timeout") setConversationError(conversationId, message);
                } else {
                    const message = err instanceof Error ? err.message : "Something went wrong";
                    setConversationError(conversationId, message);
                    updateMessage(conversationId, assistantId, {
                        "useChat.useCallback[streamOne]": (m)=>({
                                ...m,
                                pending: false,
                                content: m.content || `Error: ${message}`
                            })
                    }["useChat.useCallback[streamOne]"]);
                }
            } finally{
                clearTimeout(timeoutId);
                delete controllers.current[assistantId];
                activeStreams.current[conversationId] = (activeStreams.current[conversationId] || []).filter({
                    "useChat.useCallback[streamOne]": (id)=>id !== assistantId
                }["useChat.useCallback[streamOne]"]);
            }
        }
    }["useChat.useCallback[streamOne]"], [
        updateMessage,
        setConversationError
    ]);
    const sendMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useChat.useCallback[sendMessage]": async (content)=>{
            if (!activeId || !content.trim() || sendingIds.has(activeId)) return;
            const conversationId = activeId;
            setConversationError(conversationId, null);
            const conversation = conversations.find({
                "useChat.useCallback[sendMessage].conversation": (c)=>c.id === conversationId
            }["useChat.useCallback[sendMessage].conversation"]);
            if (!conversation) return;
            const turnId = makeId();
            const userMessage = {
                id: makeId(),
                role: "user",
                content
            };
            const assistantAId = makeId();
            const modelA = conversation.model;
            const modelB = conversation.compareModel || null;
            const assistantBId = modelB ? makeId() : null;
            let historyForRequest = [];
            setConversations({
                "useChat.useCallback[sendMessage]": (prev)=>prev.map({
                        "useChat.useCallback[sendMessage]": (c)=>{
                            if (c.id !== conversationId) return c;
                            const newAssistants = [
                                {
                                    id: assistantAId,
                                    role: "assistant",
                                    content: "",
                                    model: modelA,
                                    pending: true,
                                    turnId
                                }
                            ];
                            if (modelB && assistantBId) {
                                newAssistants.push({
                                    id: assistantBId,
                                    role: "assistant",
                                    content: "",
                                    model: modelB,
                                    pending: true,
                                    turnId
                                });
                            }
                            historyForRequest = [
                                ...c.messages,
                                userMessage
                            ];
                            return {
                                ...c,
                                title: c.title === "New chat" ? content.slice(0, 48) : c.title,
                                messages: [
                                    ...c.messages,
                                    userMessage,
                                    ...newAssistants
                                ]
                            };
                        }
                    }["useChat.useCallback[sendMessage]"])
            }["useChat.useCallback[sendMessage]"]);
            markSending(conversationId, true);
            const tasks = [
                streamOne(conversationId, modelA, historyForRequest, assistantAId)
            ];
            if (modelB && assistantBId) {
                tasks.push(streamOne(conversationId, modelB, historyForRequest, assistantBId));
            }
            await Promise.all(tasks);
            markSending(conversationId, false);
        }
    }["useChat.useCallback[sendMessage]"], [
        activeId,
        conversations,
        sendingIds,
        streamOne,
        markSending,
        setConversationError
    ]);
    const regenerateMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useChat.useCallback[regenerateMessage]": async (assistantId)=>{
            if (!activeId || sendingIds.has(activeId)) return;
            const conversation = conversations.find({
                "useChat.useCallback[regenerateMessage].conversation": (c)=>c.id === activeId
            }["useChat.useCallback[regenerateMessage].conversation"]);
            if (!conversation) return;
            const idx = conversation.messages.findIndex({
                "useChat.useCallback[regenerateMessage].idx": (m)=>m.id === assistantId
            }["useChat.useCallback[regenerateMessage].idx"]);
            if (idx === -1) return;
            let userIdx = idx - 1;
            while(userIdx >= 0 && conversation.messages[userIdx].role !== "user")userIdx--;
            if (userIdx < 0) return;
            const conversationId = activeId;
            const history = conversation.messages.slice(0, userIdx + 1);
            const model = conversation.messages[idx].model || conversation.model;
            setConversationError(conversationId, null);
            updateMessage(conversationId, assistantId, {
                "useChat.useCallback[regenerateMessage]": (m)=>({
                        ...m,
                        content: "",
                        pending: true
                    })
            }["useChat.useCallback[regenerateMessage]"]);
            markSending(conversationId, true);
            await streamOne(conversationId, model, history, assistantId);
            markSending(conversationId, false);
        }
    }["useChat.useCallback[regenerateMessage]"], [
        activeId,
        conversations,
        sendingIds,
        streamOne,
        updateMessage,
        markSending,
        setConversationError
    ]);
    const editMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useChat.useCallback[editMessage]": (userMessageId, newContent)=>{
            if (!activeId || sendingIds.has(activeId) || !newContent.trim()) return;
            const conversationId = activeId;
            setConversations({
                "useChat.useCallback[editMessage]": (prev)=>prev.map({
                        "useChat.useCallback[editMessage]": (c)=>{
                            if (c.id !== conversationId) return c;
                            const idx = c.messages.findIndex({
                                "useChat.useCallback[editMessage].idx": (m)=>m.id === userMessageId
                            }["useChat.useCallback[editMessage].idx"]);
                            if (idx === -1) return c;
                            return {
                                ...c,
                                messages: c.messages.slice(0, idx)
                            };
                        }
                    }["useChat.useCallback[editMessage]"])
            }["useChat.useCallback[editMessage]"]);
            sendMessage(newContent);
        }
    }["useChat.useCallback[editMessage]"], [
        activeId,
        sendingIds,
        sendMessage
    ]);
    const stopGeneration = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useChat.useCallback[stopGeneration]": (conversationId)=>{
            (activeStreams.current[conversationId] || []).forEach({
                "useChat.useCallback[stopGeneration]": (assistantId)=>{
                    controllers.current[assistantId]?.abort("user");
                }
            }["useChat.useCallback[stopGeneration]"]);
        }
    }["useChat.useCallback[stopGeneration]"], []);
    return {
        models,
        modelsError,
        conversations,
        activeConversation,
        newConversation,
        selectConversation,
        deleteConversation,
        setActiveModel,
        setCompareModel,
        sendMessage,
        regenerateMessage,
        editMessage,
        stopGeneration,
        // Scoped to the active conversation for the UI's convenience — other
        // conversations can keep streaming independently in the background.
        sending: activeId ? sendingIds.has(activeId) : false,
        sendError: activeId ? sendErrors[activeId] ?? null : null,
        cloudSynced: Boolean(userId),
        cloudError
    };
}
_s(useChat, "Mghk1u+ZnfleUe4okj8aCnDmvY0=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/Sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sidebar",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
function Sidebar({ conversations, activeId, onSelect, onNew, onDelete, open, onClose }) {
    const handleSelect = (id)=>{
        onSelect(id);
        onClose(); // no-op on desktop widths; closes the drawer on mobile
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                onClick: onClose,
                "aria-hidden": "true",
                className: "fixed inset-0 z-10 bg-black/30 md:hidden"
            }, void 0, false, {
                fileName: "[project]/components/Sidebar.tsx",
                lineNumber: 25,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: `fixed inset-y-0 left-0 z-20 flex w-64 shrink-0 -translate-x-full flex-col gap-1 border-r border-[var(--border)] bg-[var(--surface-1)] p-3 transition-transform duration-200 md:relative md:z-auto md:w-60 md:translate-x-0 ${open ? "translate-x-0" : ""}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-3 flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onNew,
                                className: "flex flex-1 items-center justify-start gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm hover:bg-[var(--surface-2)]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "16",
                                        height: "16",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M12 5v14M5 12h14"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.tsx",
                                            lineNumber: 43,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/Sidebar.tsx",
                                        lineNumber: 42,
                                        columnNumber: 13
                                    }, this),
                                    "New chat"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 38,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                "aria-label": "Close sidebar",
                                className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-2)] md:hidden",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: "16",
                                    height: "16",
                                    viewBox: "0 0 24 24",
                                    fill: "none",
                                    stroke: "currentColor",
                                    strokeWidth: "2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M18 6 6 18M6 6l12 12"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Sidebar.tsx",
                                        lineNumber: 53,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/Sidebar.tsx",
                                    lineNumber: 52,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 47,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Sidebar.tsx",
                        lineNumber: 37,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-2 pb-1 text-xs text-[var(--text-muted)]",
                        children: "Recent"
                    }, void 0, false, {
                        fileName: "[project]/components/Sidebar.tsx",
                        lineNumber: 58,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-1 flex-col gap-1 overflow-y-auto",
                        children: [
                            conversations.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `group flex items-center gap-1 rounded-lg pr-1 ${c.id === activeId ? "bg-[var(--surface-2)]" : "hover:bg-[var(--surface-2)]"}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>handleSelect(c.id),
                                            title: c.title,
                                            className: `flex-1 truncate rounded-lg px-3 py-2 text-left text-sm ${c.id === activeId ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`,
                                            children: c.title
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.tsx",
                                            lineNumber: 68,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: (e)=>{
                                                e.stopPropagation();
                                                onDelete(c.id);
                                            },
                                            "aria-label": `Delete ${c.title}`,
                                            className: "hidden h-6 w-6 shrink-0 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--surface-0)] hover:text-[var(--text-primary)] group-hover:flex [@media(hover:none)]:flex",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                width: "13",
                                                height: "13",
                                                viewBox: "0 0 24 24",
                                                fill: "none",
                                                stroke: "currentColor",
                                                strokeWidth: "2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Sidebar.tsx",
                                                    lineNumber: 86,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/Sidebar.tsx",
                                                lineNumber: 85,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.tsx",
                                            lineNumber: 77,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, c.id, true, {
                                    fileName: "[project]/components/Sidebar.tsx",
                                    lineNumber: 62,
                                    columnNumber: 13
                                }, this)),
                            conversations.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "px-3 py-2 text-sm text-[var(--text-muted)]",
                                children: "No chats yet"
                            }, void 0, false, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 92,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Sidebar.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Sidebar.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_c = Sidebar;
var _c;
__turbopack_context__.k.register(_c, "Sidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ModelSelector.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ModelSelector",
    ()=>ModelSelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
function ModelSelector({ models, value, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
        value: value,
        onChange: (e)=>onChange(e.target.value),
        className: "w-auto rounded-lg border border-[var(--border)] bg-transparent px-2 py-1.5 text-sm font-medium",
        children: [
            !models.some((m)=>m.id === value) && value && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                value: value,
                children: value
            }, void 0, false, {
                fileName: "[project]/components/ModelSelector.tsx",
                lineNumber: 19,
                columnNumber: 9
            }, this),
            models.map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                    value: m.id,
                    children: m.label
                }, m.id, false, {
                    fileName: "[project]/components/ModelSelector.tsx",
                    lineNumber: 22,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/components/ModelSelector.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = ModelSelector;
var _c;
__turbopack_context__.k.register(_c, "ModelSelector");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/MessageList.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessageList",
    ()=>MessageList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/lib/messages'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function MessageList({ messages, onRegenerate, onEditUser, sending }) {
    _s();
    const bottomRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [editingId, setEditingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [copiedId, setCopiedId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MessageList.useEffect": ()=>{
            bottomRef.current?.scrollIntoView({
                block: "end"
            });
        }
    }["MessageList.useEffect"], [
        messages
    ]);
    const copy = (id, content)=>{
        navigator.clipboard.writeText(content).then(()=>{
            setCopiedId(id);
            setTimeout(()=>setCopiedId((current)=>current === id ? null : current), 1500);
        });
    };
    const startEdit = (m)=>{
        setEditingId(m.id);
        setDraft(m.content);
    };
    const saveEdit = (id)=>{
        if (draft.trim()) onEditUser(id, draft.trim());
        setEditingId(null);
    };
    if (messages.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-1 items-center justify-center text-sm text-[var(--text-muted)]",
            children: "Ask anything. Switch models any time from the dropdown above."
        }, void 0, false, {
            fileName: "[project]/components/MessageList.tsx",
            lineNumber: 43,
            columnNumber: 7
        }, this);
    }
    const groups = groupMessages(messages);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-5",
        children: [
            groups.map((group)=>{
                const first = group[0];
                if (first.role === "user") {
                    const isEditing = editingId === first.id;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "group flex justify-end",
                        children: isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-full max-w-[70%] rounded-xl border border-[var(--border)] bg-[var(--surface-1)] p-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    value: draft,
                                    onChange: (e)=>setDraft(e.target.value),
                                    rows: Math.min(6, Math.max(2, draft.split("\n").length)),
                                    className: "w-full resize-none border-none bg-transparent p-1.5 text-sm shadow-none focus:shadow-none",
                                    autoFocus: true
                                }, void 0, false, {
                                    fileName: "[project]/components/MessageList.tsx",
                                    lineNumber: 62,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-end gap-2 pt-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setEditingId(null),
                                            className: "rounded-lg px-2.5 py-1 text-xs text-[var(--text-secondary)] hover:bg-[var(--surface-2)]",
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/components/MessageList.tsx",
                                            lineNumber: 70,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>saveEdit(first.id),
                                            className: "rounded-lg bg-[var(--text-primary)] px-2.5 py-1 text-xs text-[var(--surface-0)]",
                                            children: "Save & resend"
                                        }, void 0, false, {
                                            fileName: "[project]/components/MessageList.tsx",
                                            lineNumber: 76,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/MessageList.tsx",
                                    lineNumber: 69,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/MessageList.tsx",
                            lineNumber: 61,
                            columnNumber: 17
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start gap-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>startEdit(first),
                                    "aria-label": "Edit message",
                                    className: "mt-2.5 hidden h-6 w-6 shrink-0 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] group-hover:flex [@media(hover:none)]:flex",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PencilIcon, {}, void 0, false, {
                                        fileName: "[project]/components/MessageList.tsx",
                                        lineNumber: 91,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/MessageList.tsx",
                                    lineNumber: 86,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "max-w-[70%] rounded-xl bg-[var(--surface-2)] px-3.5 py-2.5 text-sm leading-relaxed",
                                    children: first.content
                                }, void 0, false, {
                                    fileName: "[project]/components/MessageList.tsx",
                                    lineNumber: 93,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/MessageList.tsx",
                            lineNumber: 85,
                            columnNumber: 17
                        }, this)
                    }, first.id, false, {
                        fileName: "[project]/components/MessageList.tsx",
                        lineNumber: 59,
                        columnNumber: 13
                    }, this);
                }
                if (group.length > 1) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 gap-4",
                        children: group.map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AssistantBubble, {
                                message: m,
                                bordered: true,
                                sending: sending,
                                copied: copiedId === m.id,
                                onCopy: ()=>copy(m.id, m.content),
                                onRegenerate: ()=>onRegenerate(m.id)
                            }, m.id, false, {
                                fileName: "[project]/components/MessageList.tsx",
                                lineNumber: 106,
                                columnNumber: 17
                            }, this))
                    }, first.turnId, false, {
                        fileName: "[project]/components/MessageList.tsx",
                        lineNumber: 104,
                        columnNumber: 13
                    }, this);
                }
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AssistantBubble, {
                    message: first,
                    sending: sending,
                    copied: copiedId === first.id,
                    onCopy: ()=>copy(first.id, first.content),
                    onRegenerate: ()=>onRegenerate(first.id)
                }, first.id, false, {
                    fileName: "[project]/components/MessageList.tsx",
                    lineNumber: 121,
                    columnNumber: 11
                }, this);
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: bottomRef
            }, void 0, false, {
                fileName: "[project]/components/MessageList.tsx",
                lineNumber: 131,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/MessageList.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_s(MessageList, "U3hIVkXUxFintt4rWkePvYs9RSg=");
_c = MessageList;
function AssistantBubble({ message, bordered, sending, copied, onCopy, onRegenerate }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `group min-w-0 max-w-[78%] ${bordered ? "rounded-lg border border-[var(--border)] p-3" : ""}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-1 text-xs font-medium text-[var(--text-muted)]",
                children: message.model
            }, void 0, false, {
                fileName: "[project]/components/MessageList.tsx",
                lineNumber: 155,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-primary)]",
                children: message.content || (message.pending ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TypingDots, {}, void 0, false, {
                    fileName: "[project]/components/MessageList.tsx",
                    lineNumber: 157,
                    columnNumber: 48
                }, this) : "")
            }, void 0, false, {
                fileName: "[project]/components/MessageList.tsx",
                lineNumber: 156,
                columnNumber: 7
            }, this),
            !message.pending && message.content && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-1.5 hidden items-center gap-1 group-hover:flex [@media(hover:none)]:flex",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onCopy,
                        "aria-label": "Copy message",
                        className: "flex h-6 w-6 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]",
                        children: copied ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CheckIcon, {}, void 0, false, {
                            fileName: "[project]/components/MessageList.tsx",
                            lineNumber: 166,
                            columnNumber: 23
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CopyIcon, {}, void 0, false, {
                            fileName: "[project]/components/MessageList.tsx",
                            lineNumber: 166,
                            columnNumber: 39
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/MessageList.tsx",
                        lineNumber: 161,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onRegenerate,
                        disabled: sending,
                        "aria-label": "Regenerate response",
                        className: "flex h-6 w-6 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] disabled:opacity-30",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RegenerateIcon, {}, void 0, false, {
                            fileName: "[project]/components/MessageList.tsx",
                            lineNumber: 174,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/MessageList.tsx",
                        lineNumber: 168,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/MessageList.tsx",
                lineNumber: 160,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/MessageList.tsx",
        lineNumber: 152,
        columnNumber: 5
    }, this);
}
_c1 = AssistantBubble;
function TypingDots() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "inline-flex items-center gap-1 py-1",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--text-muted)] [animation-delay:-0.2s]"
            }, void 0, false, {
                fileName: "[project]/components/MessageList.tsx",
                lineNumber: 185,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--text-muted)]"
            }, void 0, false, {
                fileName: "[project]/components/MessageList.tsx",
                lineNumber: 186,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--text-muted)] [animation-delay:0.2s]"
            }, void 0, false, {
                fileName: "[project]/components/MessageList.tsx",
                lineNumber: 187,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/MessageList.tsx",
        lineNumber: 184,
        columnNumber: 5
    }, this);
}
_c2 = TypingDots;
function PencilIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "13",
        height: "13",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"
        }, void 0, false, {
            fileName: "[project]/components/MessageList.tsx",
            lineNumber: 195,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/MessageList.tsx",
        lineNumber: 194,
        columnNumber: 5
    }, this);
}
_c3 = PencilIcon;
function CopyIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "13",
        height: "13",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "9",
                y: "9",
                width: "13",
                height: "13",
                rx: "2"
            }, void 0, false, {
                fileName: "[project]/components/MessageList.tsx",
                lineNumber: 203,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
            }, void 0, false, {
                fileName: "[project]/components/MessageList.tsx",
                lineNumber: 204,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/MessageList.tsx",
        lineNumber: 202,
        columnNumber: 5
    }, this);
}
_c4 = CopyIcon;
function CheckIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "13",
        height: "13",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M20 6 9 17l-5-5"
        }, void 0, false, {
            fileName: "[project]/components/MessageList.tsx",
            lineNumber: 212,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/MessageList.tsx",
        lineNumber: 211,
        columnNumber: 5
    }, this);
}
_c5 = CheckIcon;
function RegenerateIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "13",
        height: "13",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M23 4v6h-6M1 20v-6h6"
            }, void 0, false, {
                fileName: "[project]/components/MessageList.tsx",
                lineNumber: 220,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
            }, void 0, false, {
                fileName: "[project]/components/MessageList.tsx",
                lineNumber: 221,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/MessageList.tsx",
        lineNumber: 219,
        columnNumber: 5
    }, this);
}
_c6 = RegenerateIcon;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "MessageList");
__turbopack_context__.k.register(_c1, "AssistantBubble");
__turbopack_context__.k.register(_c2, "TypingDots");
__turbopack_context__.k.register(_c3, "PencilIcon");
__turbopack_context__.k.register(_c4, "CopyIcon");
__turbopack_context__.k.register(_c5, "CheckIcon");
__turbopack_context__.k.register(_c6, "RegenerateIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ChatInput.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChatInput",
    ()=>ChatInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function ChatInput({ onSend, onStop, sending, disabled, placeholder }) {
    _s();
    const [value, setValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const textareaRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const submit = ()=>{
        const trimmed = value.trim();
        if (!trimmed || disabled || sending) return;
        onSend(trimmed);
        setValue("");
        if (textareaRef.current) textareaRef.current.style.height = "auto";
    };
    const handleKeyDown = (e)=>{
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
        }
    };
    const handleInput = ()=>{
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "border-t border-[var(--border)] p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-end gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-1)] p-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                    ref: textareaRef,
                    value: value,
                    onChange: (e)=>setValue(e.target.value),
                    onInput: handleInput,
                    onKeyDown: handleKeyDown,
                    placeholder: placeholder || "Message...",
                    rows: 1,
                    disabled: disabled,
                    className: "max-h-48 flex-1 resize-none border-none bg-transparent px-2 py-1.5 text-sm shadow-none focus:shadow-none"
                }, void 0, false, {
                    fileName: "[project]/components/ChatInput.tsx",
                    lineNumber: 43,
                    columnNumber: 9
                }, this),
                sending ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onStop,
                    "aria-label": "Stop generating",
                    className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--text-primary)] text-[var(--surface-0)]",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        width: "12",
                        height: "12",
                        viewBox: "0 0 24 24",
                        fill: "currentColor",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                            x: "4",
                            y: "4",
                            width: "16",
                            height: "16",
                            rx: "2"
                        }, void 0, false, {
                            fileName: "[project]/components/ChatInput.tsx",
                            lineNumber: 61,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ChatInput.tsx",
                        lineNumber: 60,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/ChatInput.tsx",
                    lineNumber: 55,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: submit,
                    disabled: disabled || !value.trim(),
                    "aria-label": "Send message",
                    className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--text-primary)] text-[var(--surface-0)] disabled:opacity-30",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        width: "16",
                        height: "16",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M5 12h14M13 6l6 6-6 6"
                        }, void 0, false, {
                            fileName: "[project]/components/ChatInput.tsx",
                            lineNumber: 72,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ChatInput.tsx",
                        lineNumber: 71,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/ChatInput.tsx",
                    lineNumber: 65,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ChatInput.tsx",
            lineNumber: 42,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ChatInput.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
_s(ChatInput, "siXqDNfwNO0wSL/H8B9PdNxU3i4=");
_c = ChatInput;
var _c;
__turbopack_context__.k.register(_c, "ChatInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ThemeToggle.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeToggle",
    ()=>ThemeToggle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function ThemeToggle() {
    _s();
    // Deliberately null on first render — not computed from window/localStorage
    // — so server and client render identically and hydration never mismatches.
    // The real value is only read after mount, in the effect below.
    const [theme, setTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeToggle.useEffect": ()=>{
            const stored = window.localStorage.getItem("theme");
            const resolved = stored === "light" || stored === "dark" ? stored : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            document.documentElement.setAttribute("data-theme", resolved);
            // Reading localStorage/matchMedia and syncing the result into React state
            // can only happen post-mount (no window on the server) — this is exactly
            // the "sync with an external system" case the rule expects an effect for.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTheme(resolved);
        }
    }["ThemeToggle.useEffect"], []);
    const toggle = ()=>{
        const next = theme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        window.localStorage.setItem("theme", next);
        setTheme(next);
    };
    if (theme === null) {
        // Same footprint as the real button, but no theme-dependent content —
        // this is what avoids both the mismatch and an icon "flash" on load.
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-8 w-8",
            "aria-hidden": "true"
        }, void 0, false, {
            fileName: "[project]/components/ThemeToggle.tsx",
            lineNumber: 39,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: toggle,
        "aria-label": "Toggle color theme",
        className: "flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-2)]",
        children: theme === "dark" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "16",
            height: "16",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "12",
                    cy: "12",
                    r: "4"
                }, void 0, false, {
                    fileName: "[project]/components/ThemeToggle.tsx",
                    lineNumber: 50,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                }, void 0, false, {
                    fileName: "[project]/components/ThemeToggle.tsx",
                    lineNumber: 51,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ThemeToggle.tsx",
            lineNumber: 49,
            columnNumber: 9
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "16",
            height: "16",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            }, void 0, false, {
                fileName: "[project]/components/ThemeToggle.tsx",
                lineNumber: 55,
                columnNumber: 11
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/ThemeToggle.tsx",
            lineNumber: 54,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ThemeToggle.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_s(ThemeToggle, "8cORP+VmZIUfFKJJBlFCtPazdq0=");
_c = ThemeToggle;
var _c;
__turbopack_context__.k.register(_c, "ThemeToggle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ChatApp.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChatApp",
    ()=>ChatApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useChat$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useChat.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ModelSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ModelSelector.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MessageList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/MessageList.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ChatInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ChatInput.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ThemeToggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ThemeToggle.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
function ChatApp() {
    _s();
    const { models, modelsError, conversations, activeConversation, newConversation, selectConversation, deleteConversation, setActiveModel, setCompareModel, sendMessage, regenerateMessage, editMessage, stopGeneration, sending, sendError, cloudSynced, cloudError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useChat$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChat"])();
    const [sidebarOpen, setSidebarOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const enableCompare = ()=>{
        if (!activeConversation) return;
        const fallback = models.find((m)=>m.id !== activeConversation.model)?.id || models[0]?.id || activeConversation.model;
        setCompareModel(fallback);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sidebar"], {
                conversations: conversations,
                activeId: activeConversation?.id ?? null,
                onSelect: selectConversation,
                onNew: newConversation,
                onDelete: deleteConversation,
                open: sidebarOpen,
                onClose: ()=>setSidebarOpen(false)
            }, void 0, false, {
                fileName: "[project]/components/ChatApp.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex min-w-0 flex-1 flex-col",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "flex items-center justify-between border-b border-[var(--border)] px-4 py-2.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex min-w-0 items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setSidebarOpen(true),
                                        "aria-label": "Open sidebar",
                                        className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-2)] md:hidden",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "16",
                                            height: "16",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: "2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M3 12h18M3 6h18M3 18h18"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ChatApp.tsx",
                                                lineNumber: 64,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/ChatApp.tsx",
                                            lineNumber: 63,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/ChatApp.tsx",
                                        lineNumber: 58,
                                        columnNumber: 13
                                    }, this),
                                    activeConversation ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex min-w-0 items-center gap-2 overflow-x-auto",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ModelSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ModelSelector"], {
                                                models: models,
                                                value: activeConversation.model,
                                                onChange: setActiveModel
                                            }, void 0, false, {
                                                fileName: "[project]/components/ChatApp.tsx",
                                                lineNumber: 70,
                                                columnNumber: 17
                                            }, this),
                                            activeConversation.compareModel ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "shrink-0 text-xs text-[var(--text-muted)]",
                                                        children: "vs"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ChatApp.tsx",
                                                        lineNumber: 77,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ModelSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ModelSelector"], {
                                                        models: models,
                                                        value: activeConversation.compareModel,
                                                        onChange: setCompareModel
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ChatApp.tsx",
                                                        lineNumber: 78,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setCompareModel(null),
                                                        "aria-label": "Exit compare mode",
                                                        className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-2)]",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            width: "14",
                                                            height: "14",
                                                            viewBox: "0 0 24 24",
                                                            fill: "none",
                                                            stroke: "currentColor",
                                                            strokeWidth: "2",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                d: "M18 6 6 18M6 6l12 12"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ChatApp.tsx",
                                                                lineNumber: 89,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ChatApp.tsx",
                                                            lineNumber: 88,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ChatApp.tsx",
                                                        lineNumber: 83,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: enableCompare,
                                                className: "shrink-0 rounded-lg border border-[var(--border)] px-2 py-1.5 text-xs text-[var(--text-secondary)] hover:bg-[var(--surface-2)]",
                                                children: "+ Compare"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ChatApp.tsx",
                                                lineNumber: 94,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ChatApp.tsx",
                                        lineNumber: 69,
                                        columnNumber: 15
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-[var(--text-muted)]",
                                        children: models.length === 0 && !modelsError ? "Loading models..." : "No chat selected"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ChatApp.tsx",
                                        lineNumber: 103,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ChatApp.tsx",
                                lineNumber: 57,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex shrink-0 items-center gap-2",
                                children: [
                                    cloudSynced && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        title: "Synced to your Supabase account",
                                        className: "hidden items-center gap-1 text-xs text-[var(--text-muted)] sm:flex",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                width: "13",
                                                height: "13",
                                                viewBox: "0 0 24 24",
                                                fill: "none",
                                                stroke: "currentColor",
                                                strokeWidth: "2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M17.5 19H9a7 7 0 1 1 6.71-9h.79a4.5 4.5 0 1 1 0 9Z"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ChatApp.tsx",
                                                    lineNumber: 116,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/ChatApp.tsx",
                                                lineNumber: 115,
                                                columnNumber: 17
                                            }, this),
                                            "Synced"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ChatApp.tsx",
                                        lineNumber: 111,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ThemeToggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeToggle"], {}, void 0, false, {
                                        fileName: "[project]/components/ChatApp.tsx",
                                        lineNumber: 121,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ChatApp.tsx",
                                lineNumber: 109,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ChatApp.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this),
                    cloudError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-b border-[var(--border)] bg-[var(--surface-1)] px-4 py-2 text-xs text-[var(--text-secondary)]",
                        children: cloudError
                    }, void 0, false, {
                        fileName: "[project]/components/ChatApp.tsx",
                        lineNumber: 126,
                        columnNumber: 11
                    }, this),
                    modelsError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-b border-[var(--border)] bg-[var(--surface-1)] px-4 py-2 text-xs text-[var(--text-secondary)]",
                        children: [
                            "Couldn't load the live model list (",
                            modelsError,
                            "). Set AGENTROUTER_API_KEY in .env.local."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ChatApp.tsx",
                        lineNumber: 132,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MessageList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessageList"], {
                        messages: activeConversation?.messages ?? [],
                        onRegenerate: regenerateMessage,
                        onEditUser: editMessage,
                        sending: sending
                    }, void 0, false, {
                        fileName: "[project]/components/ChatApp.tsx",
                        lineNumber: 137,
                        columnNumber: 9
                    }, this),
                    sendError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-4 pb-1 text-xs text-red-500",
                        children: sendError
                    }, void 0, false, {
                        fileName: "[project]/components/ChatApp.tsx",
                        lineNumber: 145,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ChatInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChatInput"], {
                        onSend: sendMessage,
                        onStop: ()=>activeConversation && stopGeneration(activeConversation.id),
                        sending: sending,
                        disabled: !activeConversation,
                        placeholder: activeConversation ? activeConversation.compareModel ? `Ask ${activeConversation.model} & ${activeConversation.compareModel}` : `Message ${activeConversation.model}` : "Message..."
                    }, void 0, false, {
                        fileName: "[project]/components/ChatApp.tsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ChatApp.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ChatApp.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
_s(ChatApp, "TB2o0YZC4ijgBT/X2S1Xh5d5cp8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useChat$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChat"]
    ];
});
_c = ChatApp;
var _c;
__turbopack_context__.k.register(_c, "ChatApp");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_1e9gg_8._.js.map