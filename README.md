# Agent Chat

A minimal chat interface that lets you switch between any model available through
[AgentRouter](https://agentrouter.org) — one API key, many providers (Claude, GPT,
DeepSeek, GLM, Kimi, and more).

## Stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS v4
- No database yet — conversations live in memory for the session (see Roadmap)

## How it works

- `app/api/chat/route.ts` — streams chat completions by proxying to
  `AGENTROUTER_BASE_URL/chat/completions`. The API key never reaches the browser.
- `app/api/models/route.ts` — fetches the live model list from
  `AGENTROUTER_BASE_URL/models` so new models show up without a redeploy.
- `hooks/useChat.ts` — client-side state: conversations, active model, and the
  SSE stream reader that appends tokens as they arrive.
- `components/` — Sidebar, model dropdown, message thread, input box.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the env file and add your AgentRouter key:

   ```bash
   cp .env.example .env.local
   ```

   Get a free key at [agentrouter.org/register](https://agentrouter.org/register).

3. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Add the `AGENTROUTER_API_KEY` environment variable in the Vercel project
   settings (Settings → Environment Variables). No other config needed —
   it's a single Next.js app, one deployment.

## Cross-device sync (optional)

By default, chat history lives in `localStorage` — fast, but tied to one browser.
To sync across devices:

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run `supabase/migrations/0001_conversations.sql`.
3. In **Authentication → Sign In / Providers**, enable **Anonymous Sign-Ins**.
   This is what lets the app give each browser a stable identity without a
   login screen — no accounts, no passwords, just a persistent session per
   device/browser that the same person can also link to a real login later
   if that's ever needed.
4. Add these to `.env.local` (find them under Project Settings → API):

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

5. Restart the dev server. On first load, any conversations already sitting
   in localStorage get pushed up automatically; from then on every chat
   syncs (debounced ~1s after each change) and a "Synced" indicator shows
   in the header.

Leave the two env vars unset and none of this activates — the app behaves
exactly as it did before this section existed.

## Roadmap (later sessions)

- Real login (replace anonymous sessions), if this stops being just-for-us
  and answers need to follow a specific person rather than a specific browser

## Session log

- **Session 1** — infrastructure and backbone: chat UI, streaming API proxy,
  dynamic model list, in-memory conversation switching, light/dark theme.
- **Session 2** — persistent conversation history via `localStorage`
  (`lib/storage.ts`); conversations and the active chat now survive a
  refresh. Added delete-conversation (hover a chat in the sidebar) since
  persistence means old chats stick around until removed. A message left
  mid-stream when the tab closes is finalized on reload rather than showing
  a stuck typing indicator.
- **Session 3** — model-compare mode. Click "+ Compare" in the header to pick
  a second model; sending a message fires both models in parallel and shows
  their answers side by side, each tagged with its model. `ChatMessage` now
  carries a `turnId` so `MessageList` can group same-turn answers together.
  Toggle off with the ✕ next to the second dropdown.
- **Session 4** — message actions. Hover an assistant reply for copy and
  regenerate (regenerate re-runs just that model, using the history up to
  its triggering message — in compare mode it only redoes that one column).
  Hover a user message for edit; saving truncates everything after it and
  resends, effectively rewinding the conversation from that point.
  `hooks/useChat.ts` refactored so `updateMessage`/`streamOne` are shared
  between `sendMessage` and the new `regenerateMessage`/`editMessage`.
- **Session 5** — optional Supabase sync (`lib/supabaseClient.ts`,
  `lib/cloudSync.ts`, `supabase/migrations/0001_conversations.sql`). Chose
  anonymous per-device sessions over building a login screen — it's a real
  Supabase Auth session (not a fake client-side id), just without a
  password, so it's a straightforward upgrade path to real login later
  rather than a rewrite. Conversations sync as a single JSONB blob per row,
  debounced ~1s after changes settle so a streaming response doesn't fire a
  write per token. Entirely inert unless `NEXT_PUBLIC_SUPABASE_URL` and
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set.
