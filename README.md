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

## Roadmap (later sessions)

- Persist conversation history (localStorage, then Supabase for cross-device sync)
- Model-compare mode — ask two models the same question side by side
- Message actions: copy, regenerate, edit
- Auth, if this stops being just-for-us

## Session log

- **Session 1** — infrastructure and backbone: chat UI, streaming API proxy,
  dynamic model list, in-memory conversation switching, light/dark theme.
