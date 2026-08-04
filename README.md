# Agent Chat

A minimal chat interface that lets you switch between any model available through
[AgentRouter](https://agentrouter.org) — one API key, many providers (Claude, GPT,
DeepSeek, GLM, Kimi, and more).

## Stack

- Next.js 16 (App Router, TypeScript) — note: Next 16 renamed `middleware.ts` to
  `proxy.ts`; that's not a typo if you go looking for it.
- Tailwind CSS v4
- `localStorage` by default; optional Supabase sync for cross-device history (see below)

## How it works

- `app/api/chat/route.ts` — streams chat completions by proxying to
  `AGENTROUTER_BASE_URL/chat/completions`. The API key never reaches the browser.
- `app/api/models/route.ts` — fetches the live model list from
  `AGENTROUTER_BASE_URL/models` so new models show up without a redeploy.
- `hooks/useChat.ts` — client-side state: conversations, per-conversation
  sending (one chat streaming doesn't block another), abort/timeout/stop.
- `lib/messages.ts` — groups compare-mode answers into a turn, and collapses
  each turn into a single, properly-alternating message when building the
  history sent back to the model (see Session 6 log below for why).
- `components/` — Sidebar, model dropdown, message thread, input box.
- `proxy.ts` — optional passphrase gate, see "Access gate" below.

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

## Verifying against a real AgentRouter key

I built and tested this without a real AgentRouter key (sandboxed, no network
access to agentrouter.org) — so before trusting the full UI, it's worth
confirming the raw wire format works with two direct calls:

```bash
# Should list real model ids (e.g. claude-sonnet-4-5-20250929, not "claude-sonnet-5")
curl https://agentrouter.org/v1/models -H "Authorization: Bearer $AGENTROUTER_API_KEY"

# Should stream back SSE chunks
curl https://agentrouter.org/v1/chat/completions \
  -H "Authorization: Bearer $AGENTROUTER_API_KEY" -H "Content-Type: application/json" \
  -d '{"model":"<a real id from the models call above>","messages":[{"role":"user","content":"hi"}],"stream":true}'
```

If the models call returns real ids, copy the exact string of whichever one
you use most and put it in `NEXT_PUBLIC_DEFAULT_MODEL` in `.env.local` — this
overrides the fallback the app guesses if `/api/models` ever fails outright.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Add the `AGENTROUTER_API_KEY` environment variable in the Vercel project
   settings (Settings → Environment Variables). No other config needed —
   it's a single Next.js app, one deployment.
4. Seriously consider the access gate below before this URL is public.

## Access gate (recommended before deploying anywhere public)

Right now there's no login, so `/api/chat` and `/api/models` are wide open —
anyone with the URL could burn through your AgentRouter credits. Set an
`APP_ACCESS_KEY` in `.env.local` (or Vercel's env vars) and the whole app is
gated behind a single shared passphrase — no accounts, just one secret you
share with yourself:

```bash
APP_ACCESS_KEY=choose-a-long-random-passphrase
```

Leave it unset and there's no gate at all — fine for localhost while you're
the only one who knows the URL. `proxy.ts` handles this: unset key means it's
a no-op; set key means every request needs a matching `app_access` cookie,
issued by `/unlock` after you enter the passphrase once.

## Cross-device sync (optional)

By default, chat history lives in `localStorage` — fast, but tied to one browser.

**Important caveat on what "cross-device" actually means here:** this uses
Supabase's anonymous auth, which gives each *browser* its own separate
identity — opening the app on your phone for the first time creates a new
anonymous user with no memory of your laptop's chats. This setup mainly buys
you a server-side backup of one browser's history (so a hard-refresh doesn't
lose anything), not chats that follow you across devices. It's also worth
knowing the anonymous session token itself lives in that same browser's
`localStorage` — clearing browser data loses the identity that points at your
synced chats, not just the local cache. Real cross-device access would mean
linking the anonymous session to an email (Supabase supports this via
`updateUser`), which isn't built yet.

To turn on what's here:

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run `supabase/migrations/0001_conversations.sql`.
3. In **Authentication → Sign In / Providers**, enable **Anonymous Sign-Ins**.
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

## Roadmap

- Real cross-device sync via linked identity (email/OAuth on top of the
  anonymous session), if the current per-browser backup stops being enough
- Real login, if this stops being just-for-you

## Session log

- **Session 1** — infrastructure and backbone: chat UI, streaming API proxy,
  dynamic model list, in-memory conversation switching, light/dark theme.
- **Session 2** — persistent conversation history via `localStorage`
  (`lib/storage.ts`); conversations and the active chat now survive a
  refresh. Added delete-conversation. A message left mid-stream when the tab
  closes is finalized on reload rather than showing a stuck typing indicator.
- **Session 3** — model-compare mode. "+ Compare" in the header picks a
  second model; sending fires both in parallel, answers render side by side.
- **Session 4** — message actions: copy, regenerate (per-model, even in
  compare mode), edit-and-resend (truncates and rewinds from that point).
- **Session 5** — optional Supabase sync, anonymous per-device sessions.
- **Session 6** — fixes from a full review of sessions 1–5:
  - **Compare-mode history bug**: after a compare turn, any follow-up message
    sent two consecutive `assistant`-role messages to the model (one per
    compared model, no `user` message between them) — not a valid
    alternating chat format, and providers vary in how they handle it. Fixed
    by `lib/messages.ts`, which collapses each turn into one message,
    labeling both answers when there were two. Also bounds history to the
    last 30 turns so a long-running chat doesn't grow the request forever.
  - **Global send lock**: sending in one conversation blocked sending in
    every other conversation, even unrelated ones. `useChat` now tracks
    sending per-conversation (`Set<conversationId>`) instead of one boolean.
  - **No way to stop or time out a hung request**: added a stop button
    (replaces send while generating) and a 120s timeout, both via
    `AbortController`.
  - **Silently swallowed provider errors**: the SSE parser only looked for
    `delta.content`; an in-stream `error` field from the provider now
    surfaces as a real error instead of the message just trailing off.
  - **Wide-open API routes**: added the optional `APP_ACCESS_KEY` gate
    described above.
  - **Hydration mismatch in `ThemeToggle`**: `useState`'s lazy initializer
    read `localStorage`/`matchMedia` during the client's hydration render,
    before any effect runs — so if your system theme was dark, that render
    already diverged from the server's (always "light", no `window` there).
    `suppressHydrationWarning` on `<html>` didn't cover it since the mismatch
    was several levels deeper in the tree. Fixed by rendering a neutral
    placeholder until mount, then resolving the real theme in an effect —
    first client render now matches the server exactly.
  - **API routes returned 500 for a missing API key**: that's a config
    problem, not a server fault — now 401, with the same clear message.
  - **Touch devices couldn't reach copy/regenerate/edit**: those were
    hover-only; now also shown via an `(hover: none)` media query.
  - **No responsive layout**: the sidebar is now a slide-over drawer below
    the `md` breakpoint, with a hamburger toggle in the header.
  - **Unverified fallback model id**: `NEXT_PUBLIC_DEFAULT_MODEL` env var
    added so you can set the exact id AgentRouter gives you, rather than
    trusting a guess — see "Verifying against a real AgentRouter key" above.
  - Confirmed (didn't just assume) that Vercel's Route Handlers support
    streaming responses the way `/api/chat` uses them.
