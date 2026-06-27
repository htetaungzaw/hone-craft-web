import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@sanity/client'

// Same public, non-secret identifiers as sanity.config.ts — see that file for
// why these are hardcoded rather than read from import.meta.env (this script
// runs under plain Node via tsx, not Vite, so VITE_*/SANITY_STUDIO_* env
// prefixes don't apply here either).
const projectId = 'g80rrv8s'
const dataset = 'production'
const apiVersion = '2026-01-01'

// useCdn: false — this script runs rarely (only on pnpm run article:release /
// build) and must always see the very latest publish. The CDN-cached API
// (useCdn: true) lags up to ~60s after a mutation, which previously caused
// freshly-published articles to silently get skipped if article:release ran
// right after publishing in Studio.
const client = createClient({ projectId, dataset, apiVersion, useCdn: false })

const taxonomyProjection = `{ key, slug, order, title }`

async function main() {
  const [articles, level, role, topic] = await Promise.all([
    client.fetch(`*[_type=="article"]{
      _id,
      title,
      slug,
      excerpt,
      language,
      "level": level->key,
      "roles": roles[]->key,
      "topics": topics[]->key,
    }`),
    client.fetch(`*[_type=="level"] | order(order asc)${taxonomyProjection}`),
    client.fetch(`*[_type=="role"] | order(order asc)${taxonomyProjection}`),
    client.fetch(`*[_type=="topic"] | order(order asc)${taxonomyProjection}`),
  ])

  const index = {
    generatedAt: new Date().toISOString(),
    articles,
    taxonomy: { level, role, topic },
  }

  const outPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../src/data/search-index.json',
  )
  writeFileSync(outPath, JSON.stringify(index, null, 2))
  console.log(`search-index: wrote ${articles.length} articles to ${outPath}`)
}

main().catch((error) => {
  console.error('search-index: failed to build', error)
  process.exit(1)
})
