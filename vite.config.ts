import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'

import { SUPPORTED_LOCALES } from './sanity/lib/locale'

interface SearchIndexForPrerender {
  articles: Array<{ slug: { current: string }; language: string }>
  taxonomy: {
    level: Array<{ key: string }>
    role: Array<{ key: string }>
    topic: Array<{ key: string }>
  }
}

// Read directly from disk (not a static import) so this always reflects the
// freshest `pnpm run build:index` output without going through Vite's module
// graph/cache.
const searchIndex: SearchIndexForPrerender = JSON.parse(
  readFileSync(new URL('./src/data/search-index.json', import.meta.url), 'utf-8'),
)

const prerenderPages = [
  { path: '/studio' },
  ...SUPPORTED_LOCALES.flatMap((locale) => [
    { path: `/${locale}` },
    { path: `/${locale}/browse` },
    { path: `/${locale}/glossary` },
    ...searchIndex.taxonomy.level.map((term) => ({ path: `/${locale}/levels/${term.key}` })),
    ...searchIndex.taxonomy.role.map((term) => ({ path: `/${locale}/roles/${term.key}` })),
    ...searchIndex.taxonomy.topic.map((term) => ({ path: `/${locale}/topics/${term.key}` })),
  ]),
  ...searchIndex.articles.map((article) => ({
    path: `/${article.language}/articles/${article.slug.current}`,
  })),
]

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tailwindcss(),
    tanstackStart({
      prerender: { enabled: true, crawlLinks: false, failOnError: false },
      pages: prerenderPages,
    }),
    viteReact(),
  ],
})

export default config
