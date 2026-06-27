import type { Locale } from '../../sanity/lib/locale'
import raw from '../data/search-index.json'

export interface IndexTaxonomyTerm {
  key: string
  slug: { current: string }
  order: number
  title: Partial<Record<Locale, string>>
}

export interface IndexArticle {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string
  language: Locale
  level: string | null
  roles: Array<string>
  topics: Array<string>
}

export interface SearchIndex {
  generatedAt: string
  articles: Array<IndexArticle>
  taxonomy: {
    level: Array<IndexTaxonomyTerm>
    role: Array<IndexTaxonomyTerm>
    topic: Array<IndexTaxonomyTerm>
  }
}

export const searchIndex = raw as SearchIndex
