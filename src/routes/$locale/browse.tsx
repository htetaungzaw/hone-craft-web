import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import type { Locale } from '../../../sanity/lib/locale'
import { BackLink } from '../../components/BackLink'
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
      <BackLink locale={locale} />
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
          <p className="text-muted-foreground mb-4 text-sm">
            {filtered.length} article{filtered.length === 1 ? '' : 's'}
          </p>

          {filtered.length === 0 ? (
            <p className="text-muted-foreground">No articles match these filters yet.</p>
          ) : (
            <div className="grid gap-4">
              {filtered.map((article) => (
                <Link
                  key={article._id}
                  to="/$locale/articles/$slug"
                  params={{ locale, slug: article.slug.current }}
                  className="bg-card border-border hover:border-primary/40 rounded-xl border p-5 text-left shadow-sm transition hover:shadow-md"
                >
                  <h2 className="font-medium">{article.title}</h2>
                  <p className="text-muted-foreground mt-1 text-sm">{article.excerpt}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
