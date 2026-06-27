import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { codeInput } from '@sanity/code-input'

import { schemaTypes } from './sanity/schemaTypes'
import { translateToJaAction, translateToMyAction } from './sanity/actions/translateAction'

// Hardcoded (not secrets — project ID/dataset are public identifiers): the
// Sanity CLI's deploy worker runs its own Vite server with a different env
// prefix (SANITY_STUDIO_, not VITE_), so import.meta.env lookups here would
// resolve to undefined and fail config validation during `sanity deploy`.
const projectId = 'g80rrv8s'
const dataset = 'production'
const apiVersion = '2026-01-01'

export default defineConfig({
  name: 'honecraft',
  title: 'Honecraft',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion }), codeInput()],
  schema: { types: schemaTypes },
  document: {
    actions: (prev, context) =>
      context.schemaType === 'article'
        ? [...prev, translateToJaAction, translateToMyAction]
        : prev,
  },
})
