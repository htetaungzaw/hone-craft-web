import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import type { Locale } from '../../../sanity/lib/locale'
import { FacetGroup } from '../../components/FacetGroup'
import { searchIndex } from '../../lib/searchIndex'

export const Route = createFileRoute('/$locale/browse')({ component: BrowsePage })

function BrowsePage() {
  const { locale } = Route.useParams()
  const loc = locale as Locale

  const [level, setLevel] = useState<string | null>(null)
  const [roles, setRoles] = useState<Set<string>>(new Set())
  const [topics, setTopics] = useState<Set<string>>(new Set())

  const { articles, isFallback } = useMemo(() => {
    const inLocale = searchIndex.articles.filter((article) => article.language === loc)
    if (inLocale.length > 0) return { articles: inLocale, isFallback: false }
    return {
      articles: searchIndex.articles.filter((article) => article.language === 'en'),
      isFallback: loc !== 'en',
    }
  }, [loc])

  const filtered = articles.filter((article) => {
    if (level && article.level !== level) return false
    if (roles.size > 0 && !article.roles.some((role) => roles.has(role))) return false
    if (topics.size > 0 && !article.topics.some((topic) => topics.has(topic))) return false
    return true
  })

  function toggle(set: Set<string>, setSet: (next: Set<string>) => void, key: string) {
    const next = new Set(set)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    setSet(next)
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Link
        to="/$locale"
        params={{ locale }}
        className="text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
      >
        ← Honecraft
      </Link>
      <h1 className="mt-6 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        Browse
      </h1>

      {isFallback && (
        <p className="mt-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
          Not translated yet — showing English articles.
        </p>
      )}

      <div className="mt-8 grid gap-8 sm:grid-cols-[200px_1fr]">
        <aside className="space-y-6">
          <FacetGroup
            title="Level"
            terms={searchIndex.taxonomy.level}
            locale={loc}
            selected={level ? new Set([level]) : new Set()}
            onToggle={(key) => setLevel(level === key ? null : key)}
          />
          <FacetGroup
            title="Role"
            terms={searchIndex.taxonomy.role}
            locale={loc}
            selected={roles}
            onToggle={(key) => toggle(roles, setRoles, key)}
          />
          <FacetGroup
            title="Topic"
            terms={searchIndex.taxonomy.topic}
            locale={loc}
            selected={topics}
            onToggle={(key) => toggle(topics, setTopics, key)}
          />
        </aside>

        <div>
          <p className="mb-4 text-sm text-neutral-500">
            {filtered.length} article{filtered.length === 1 ? '' : 's'}
          </p>

          {filtered.length === 0 ? (
            <p className="text-neutral-500">No articles match these filters yet.</p>
          ) : (
            <div className="grid gap-4">
              {filtered.map((article) => (
                <Link
                  key={article._id}
                  to="/$locale/articles/$slug"
                  params={{ locale, slug: article.slug.current }}
                  className="rounded-xl border border-neutral-200 p-5 text-left transition hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
                >
                  <h2 className="font-medium">{article.title}</h2>
                  <p className="mt-1 text-sm text-neutral-500">{article.excerpt}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
