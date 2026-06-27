import { createClient } from '@sanity/client'

// Hardcoded (not secrets — project ID/dataset are public identifiers, same as
// sanity.config.ts): keeps the app buildable in CI without wiring extra env vars.
const projectId = 'g80rrv8s'
const dataset = 'production'
const apiVersion = '2026-01-01'

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})
