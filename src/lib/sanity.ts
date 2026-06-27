import { createClient } from '@sanity/client'

// Hardcoded (not secrets — project ID/dataset are public identifiers, same as
// sanity.config.ts): keeps the app buildable in CI without wiring extra env vars.
const projectId = 'g80rrv8s'
const dataset = 'production'
const apiVersion = '2026-01-01'

// useCdn: false — this client is used both for live request-time reads and
// for prerendering at build time. The CDN-cached API can lag up to ~60s after
// a Studio publish, which previously baked stale content (e.g. a heading
// style edit) into a prerendered page when the rebuild ran soon after
// publishing. This is a low-traffic site, so the latency/quota tradeoff is
// worth the correctness.
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
})
