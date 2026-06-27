# Honecraft — project plan

A multilingual educational guide: **how to use AI as a developer / software engineer / DevOps in 2026** — types of AI, agentic AI (benefits & drawbacks), and usage styles from beginner to professional. Static-first, CMS-backed.

## Locked decisions

| Area | Decision |
|------|----------|
| Framework | TanStack Start (React 19), prerendered (SSG) |
| Styling | Tailwind CSS v4 + `@tailwindcss/typography` |
| CMS | Sanity — schema-as-code, Sanity-hosted Studio (sanity.studio, linked from `/studio`) — not embedded in the app's Worker, which would exceed Cloudflare's per-Worker size limit |
| Hosting | Cloudflare Workers (Vite plugin + Wrangler), publish-webhook → rebuild |
| Content model | One pool, three facets: **level × role × topic** + curated learning paths |
| Browse | Static pages per facet + client-side faceted `/browse` over a build-time JSON index |
| i18n | EN / JA / MY · doc-level translation (articles/paths/glossary) + field-level taxonomy · locale-prefixed routes |
| Burmese | Unicode-only · Noto Sans Myanmar · `lang="my"` · larger line-height |
| Translation rollout | English-first, progressive · fallback to EN with a notice |
| Translation workflow | Claude-powered, structure-aware Studio action → human review (Sonnet 4.6 default, Opus 4.8 for Burmese) |
| Name | **Honecraft** — "hone your craft"; cleared trademark/product/domain search |

## Content architecture

The three categorizations are **facets over one content pool**, not three separate trees — each article is tagged on all three axes and surfaces in every matching view.

| Axis | Values | Browse surface |
|------|--------|----------------|
| Level | beginner · intermediate · advanced · professional | `/levels/*` |
| Role | developer · software-engineer · devops | `/roles/*` |
| Topic | types-of-ai · agentic-ai · tools · pitfalls · … | `/topics/*` |

## Sanity content model (planned)

- **article** — title, slug, excerpt, body (Portable Text), `level` (1), `roles` (many), `topics` (many), `prerequisites`, author, readingTime, heroImage, seo, `language`, `translationStatus`
- **level / role / topic** — taxonomy documents (field-level i18n strings for titles)
- **learningPath** — ordered list of articles (curated guided track)
- **glossaryTerm** — types-of-AI definitions
- **author**, **siteSettings** (singleton)

## Sitemap (planned)

```
/$locale/                  landing
/$locale/start             guided "where do I begin?"
/$locale/browse            faceted filter (client-side: level × role × topic)
/$locale/levels/$level
/$locale/roles/$role
/$locale/topics/$topic
/$locale/paths/$slug
/$locale/articles/$slug
/$locale/glossary
/studio                    link-out page to the Sanity-hosted Studio (admin)
```

## AI-assisted translation (phase ~6)

English article → Studio action → Cloudflare Worker `/api/translate` (Anthropic + Sanity write tokens server-side) → Claude translates **structure-aware** (leaves code blocks / inline code / links intact) → creates a linked JA/MY draft (`translationStatus: machine-draft`) → human reviews → publish. Glossary injected for term consistency (critical for Burmese).

## Phased roadmap

1. **Setup** — repo, TanStack Start, Cloudflare, Tailwind ✅
2. **Content model** — Sanity schemas, taxonomy, i18n setup, locale-prefixed routing ✅ (locale routing pulled forward from phase 3 to ship a coherent deployable site)
3. **Read pages** — articles, facet landings over real Sanity data ✅
4. **Faceted browse** — client-side level × role × topic over a build-time index
5. **SSG + webhook** — prerender, publish → rebuild
6. **AI translation** — Claude Studio action, human review
7. **Seed content** — launch articles (the long pole)
8. **Polish & launch** — SEO, analytics, a11y, editor UX

## Repo structure

Note: TanStack Start uses `src/` (not `app/`).

```
src/
  routes/            file-based routes (mirrors the sitemap)
    __root.tsx       root layout + <head>
    index.tsx        landing
  router.tsx
  routeTree.gen.ts   generated
  styles.css         Tailwind entry
public/
vite.config.ts       Vite + Cloudflare + Tailwind + TanStack Start plugins
wrangler.jsonc       Cloudflare Worker config
```

## Open items (non-blocking)

- Domain: register `honecraft.com` / `honecraft.dev` + GitHub org + `@honecraft` npm scope
- Visual direction / tone
- Analytics (Cloudflare Web Analytics vs Plausible)
- Launch content count (lean 6 vs full 12 articles)
