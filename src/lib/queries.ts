import type { Locale } from '../../sanity/lib/locale'
import { sanityClient } from './sanity'

export type TaxonomyType = 'level' | 'role' | 'topic'

export interface TaxonomyTerm {
  _id: string
  key: string
  slug: { current: string }
  order: number
  title: Record<Locale, string | undefined>
  description?: Record<Locale, string | undefined>
}

export interface ArticleSummary {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string
  heroImage?: unknown
  readingTime?: number
  language: Locale
  level: TaxonomyTerm | null
  roles: Array<TaxonomyTerm>
  topics: Array<TaxonomyTerm>
}

export interface Article extends ArticleSummary {
  body: unknown
  translationStatus: string
  author: {
    name: string
    slug: { current: string }
    avatar?: unknown
    bio?: string
  } | null
}

const taxonomyProjection = `{ _id, key, slug, order, title, description }`

const articleSummaryProjection = `{
  _id,
  title,
  slug,
  excerpt,
  heroImage,
  readingTime,
  language,
  "level": level->${taxonomyProjection},
  "roles": roles[]->${taxonomyProjection},
  "topics": topics[]->${taxonomyProjection},
}`

const articleProjection = `{
  _id,
  title,
  slug,
  excerpt,
  heroImage,
  readingTime,
  language,
  "level": level->${taxonomyProjection},
  "roles": roles[]->${taxonomyProjection},
  "topics": topics[]->${taxonomyProjection},
  body,
  translationStatus,
  "author": author->{ name, slug, avatar, bio },
}`

export async function getArticleBySlug(
  slug: string,
  locale: Locale,
): Promise<{ article: Article; isFallback: boolean } | null> {
  const localized = await sanityClient.fetch<Article | null>(
    `*[_type=="article" && slug.current==$slug && language==$locale][0]${articleProjection}`,
    { slug, locale },
  )
  if (localized) return { article: localized, isFallback: false }

  const fallback = await sanityClient.fetch<Article | null>(
    `*[_type=="article" && slug.current==$slug && language=="en"][0]${articleProjection}`,
    { slug },
  )
  return fallback ? { article: fallback, isFallback: true } : null
}

// Resolves a translation by following translationOf rather than assuming a
// shared slug across languages -- slugs drift independently per language
// (Sanity's default slug-uniqueness check pushes authors toward distinct,
// locale-suffixed slugs), so the canonical document id is the only stable link.
async function getArticleSummaryByCanonicalId(
  canonicalId: string,
  locale: Locale,
): Promise<ArticleSummary | null> {
  const candidates = await sanityClient.fetch<Array<ArticleSummary>>(
    `*[_type=="article" && (_id==$canonicalId || translationOf._ref==$canonicalId)]${articleSummaryProjection}`,
    { canonicalId },
  )
  return (
    candidates.find((article) => article.language === locale) ??
    candidates.find((article) => article._id === canonicalId) ??
    null
  )
}

export async function getTaxonomyTerm(
  type: TaxonomyType,
  key: string,
): Promise<TaxonomyTerm | null> {
  return sanityClient.fetch<TaxonomyTerm | null>(
    `*[_type==$type && key==$key][0]${taxonomyProjection}`,
    { type, key },
  )
}

export async function getTaxonomyList(type: TaxonomyType): Promise<Array<TaxonomyTerm>> {
  return sanityClient.fetch<Array<TaxonomyTerm>>(
    `*[_type==$type] | order(order asc)${taxonomyProjection}`,
    { type },
  )
}

export async function getArticlesByTaxonomy(
  field: 'level' | 'roles' | 'topics',
  termId: string,
  locale: Locale,
): Promise<Array<ArticleSummary>> {
  const filter =
    field === 'level' ? `level._ref==$termId` : `$termId in ${field}[]._ref`
  return sanityClient.fetch<Array<ArticleSummary>>(
    `*[_type=="article" && language==$locale && ${filter}] | order(title asc)${articleSummaryProjection}`,
    { termId, locale },
  )
}

export interface LearningPath {
  _id: string
  title: Record<Locale, string | undefined>
  slug: { current: string }
  description?: Record<Locale, string | undefined>
  level: TaxonomyTerm | null
  articles: Array<ArticleSummary>
}

export interface LearningPathSummary {
  _id: string
  title: Record<Locale, string | undefined>
  slug: { current: string }
  description?: Record<Locale, string | undefined>
  articleCount: number
}

export async function getLearningPaths(): Promise<Array<LearningPathSummary>> {
  return sanityClient.fetch<Array<LearningPathSummary>>(
    `*[_type=="learningPath"] | order(title.en asc){
      _id,
      title,
      slug,
      description,
      "articleCount": count(articles),
    }`,
  )
}

export async function getLearningPathBySlug(
  slug: string,
  locale: Locale,
): Promise<LearningPath | null> {
  const path = await sanityClient.fetch<{
    _id: string
    title: Record<Locale, string | undefined>
    slug: { current: string }
    description?: Record<Locale, string | undefined>
    level: TaxonomyTerm | null
    articleIds: Array<string>
  } | null>(
    `*[_type=="learningPath" && slug.current==$slug][0]{
      _id,
      title,
      slug,
      description,
      "level": level->${taxonomyProjection},
      "articleIds": articles[]->_id,
    }`,
    { slug },
  )
  if (!path) return null

  const articles = await Promise.all(
    path.articleIds.map((articleId) => getArticleSummaryByCanonicalId(articleId, locale)),
  )

  return {
    _id: path._id,
    title: path.title,
    slug: path.slug,
    description: path.description,
    level: path.level,
    articles: articles.filter((article): article is ArticleSummary => article !== null),
  }
}

export interface GlossaryTerm {
  _id: string
  key: string
  term: string
  slug: { current: string }
  definition: string
  language: Locale
  translationStatus: string
}

export async function getGlossaryTerms(
  locale: Locale,
): Promise<{ terms: Array<GlossaryTerm>; isFallback: boolean }> {
  const localized = await sanityClient.fetch<Array<GlossaryTerm>>(
    `*[_type=="glossaryTerm" && language==$locale] | order(term asc){ _id, key, term, slug, definition, language, translationStatus }`,
    { locale },
  )
  if (localized.length > 0) return { terms: localized, isFallback: false }

  if (locale === 'en') return { terms: [], isFallback: false }

  const fallback = await sanityClient.fetch<Array<GlossaryTerm>>(
    `*[_type=="glossaryTerm" && language=="en"] | order(term asc){ _id, key, term, slug, definition, language, translationStatus }`,
  )
  return { terms: fallback, isFallback: fallback.length > 0 }
}
