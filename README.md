# Honecraft

A practical, multilingual guide to using AI as a developer, software engineer, and DevOps in 2026 — from your first prompt to agentic workflows.

Content is organised on three independent axes so the same article can be browsed three ways:

- **Level** — beginner → intermediate → advanced → professional
- **Role** — developer · software engineer · DevOps / SRE
- **Topic** — types of AI · agentic AI · tooling · pitfalls

See [`PLAN.md`](./PLAN.md) for the full architecture, content model, and phased roadmap.

## Stack

- **App** — [TanStack Start](https://tanstack.com/start) (React 19, file-based routing), prerendered to static
- **Styling** — Tailwind CSS v4 (+ `@tailwindcss/typography` for article prose)
- **CMS** — Sanity (planned, phase 2) — content source of truth
- **i18n** — English / 日本語 / မြန်မာ (Burmese), English-first with progressive translation
- **Hosting** — Cloudflare Workers via the Cloudflare Vite plugin + Wrangler

## Local development

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

## Other scripts

```bash
pnpm build      # production build (also emits the Cloudflare Worker bundle)
pnpm preview    # preview the production build
pnpm test       # Vitest
pnpm lint       # ESLint
pnpm format     # Prettier + eslint --fix
```

## Routing

File-based via TanStack Router — routes live in `src/routes`. The root layout is `src/routes/__root.tsx`.

## Deploy (Cloudflare)

Configured via `vite.config.ts` (Cloudflare Vite plugin) and `wrangler.jsonc`.

```bash
wrangler login
pnpm run deploy   # build + wrangler deploy
```

Secrets: `wrangler secret put MY_VAR` (see `.env.example`). Public vars go in `wrangler.jsonc` under `vars`.

## Status

Phase 1 (project setup) complete. Next: Sanity content model + i18n (phase 2). See `PLAN.md`.
