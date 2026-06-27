import { createClient } from '@sanity/client'

// Same public, non-secret identifiers as sanity.config.ts / src/lib/sanity.ts.
const PROJECT_ID = 'g80rrv8s'
const DATASET = 'production'
const API_VERSION = '2026-01-01'

const ALLOWED_ORIGINS = new Set(['https://honecraft.sanity.studio', 'http://localhost:3333'])

const TARGET_LOCALES = ['ja', 'my'] as const
type TargetLocale = (typeof TARGET_LOCALES)[number]

const LOCALE_NAMES: Record<TargetLocale, string> = { ja: 'Japanese', my: 'Burmese' }
// Sonnet 4.6 default, Opus 4.8 for Burmese (PLAN.md §AI-assisted translation).
const MODEL_BY_LOCALE: Record<TargetLocale, string> = {
  ja: 'claude-sonnet-4-6',
  my: 'claude-opus-4-8',
}

interface Env {
  ANTHROPIC_API_KEY: string
  SANITY_WRITE_TOKEN: string
  TRANSLATE_SHARED_SECRET: string
}

interface SourceArticle {
  _id: string
  title: string
  excerpt: string
  body: unknown
  language: string
  slug: { current: string }
  level: unknown
  roles: unknown
  topics: unknown
  glossary: Array<{ term: string }>
}

function corsHeaders(origin: string | null): HeadersInit {
  return {
    'Access-Control-Allow-Origin': origin && ALLOWED_ORIGINS.has(origin) ? origin : '',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    Vary: 'Origin',
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const headers = corsHeaders(request.headers.get('Origin'))

    if (request.method === 'OPTIONS') return new Response(null, { headers })

    if (request.method !== 'POST' || new URL(request.url).pathname !== '/translate') {
      return new Response('Not found', { status: 404, headers })
    }

    if (request.headers.get('Authorization') !== `Bearer ${env.TRANSLATE_SHARED_SECRET}`) {
      return new Response('Unauthorized', { status: 401, headers })
    }

    let body: { documentId?: string; targetLocale?: string }
    try {
      body = await request.json()
    } catch {
      return new Response('Invalid JSON', { status: 400, headers })
    }

    const { documentId, targetLocale } = body
    if (!documentId || !TARGET_LOCALES.includes(targetLocale as TargetLocale)) {
      return new Response('documentId and a valid targetLocale (ja|my) are required', {
        status: 400,
        headers,
      })
    }

    const sanity = createClient({
      projectId: PROJECT_ID,
      dataset: DATASET,
      apiVersion: API_VERSION,
      token: env.SANITY_WRITE_TOKEN,
      useCdn: false,
    })

    const source = await sanity.fetch<SourceArticle | null>(
      `*[_id==$id][0]{
        _id, title, excerpt, body, language, slug, level, roles, topics,
        "glossary": *[_type=="glossaryTerm" && language=="en"]{ term }
      }`,
      { id: documentId },
    )

    if (!source) return new Response('Article not found', { status: 404, headers })
    if (source.language !== 'en') {
      return new Response('Only English articles can be translated', { status: 400, headers })
    }

    let translated: { title: string; excerpt: string; body: unknown }
    try {
      translated = await translateArticle(source, targetLocale as TargetLocale, env.ANTHROPIC_API_KEY)
    } catch (error) {
      return new Response(`Translation failed: ${(error as Error).message}`, {
        status: 502,
        headers,
      })
    }

    const draftId = `drafts.translate-${source._id.replace(/^drafts\./, '')}-${targetLocale}`
    await sanity
      .transaction()
      .createOrReplace({
        _id: draftId,
        _type: 'article',
        title: translated.title,
        excerpt: translated.excerpt,
        body: translated.body,
        slug: { _type: 'slug', current: source.slug.current },
        language: targetLocale,
        translationOf: { _type: 'reference', _ref: source._id.replace(/^drafts\./, '') },
        translationStatus: 'machine-draft',
        level: source.level,
        roles: source.roles,
        topics: source.topics,
      })
      .commit()

    return new Response(JSON.stringify({ draftId }), {
      status: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
    })
  },
}

async function translateArticle(
  source: SourceArticle,
  targetLocale: TargetLocale,
  apiKey: string,
): Promise<{ title: string; excerpt: string; body: unknown }> {
  const glossaryNote = source.glossary.length
    ? `Use these exact terms consistently where they appear: ${source.glossary.map((g) => g.term).join(', ')}.`
    : ''

  const prompt = `Translate this article from English to ${LOCALE_NAMES[targetLocale]}.
Keep the JSON structure byte-for-byte identical — only translate human-readable text: the "title" and "excerpt" strings, and the "text" values inside Portable Text spans in "body". Do NOT translate or alter code blocks (type "code"), URLs, marks, keys, or _type/_key fields.
${glossaryNote}

Respond with ONLY valid JSON of this exact shape, nothing else: {"title": string, "excerpt": string, "body": <body array, same structure as input>}

Input:
${JSON.stringify({ title: source.title, excerpt: source.excerpt, body: source.body })}`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL_BY_LOCALE[targetLocale],
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    throw new Error(`Anthropic API error ${response.status}: ${await response.text()}`)
  }

  const data = (await response.json()) as { content: Array<{ type: string; text?: string }> }
  const text = data.content.find((block) => block.type === 'text')?.text
  if (!text) throw new Error('No text content in Anthropic response')

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Could not find JSON in model response')

  return JSON.parse(jsonMatch[0]) as { title: string; excerpt: string; body: unknown }
}
